import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";
import picomatch from "picomatch";
import { basename } from "../../path-util.js";

/**
 * Return true if the file path matches the globs, in the same way as `micromatch([filePath], globs).length > 0`.
 * A negated glob (starting with "!") excludes the path, and a later positive glob includes it again.
 * If all globs are negated, any path that none of them excludes matches.
 * This is the algorithm of micromatch() with picomatch, so that the rule does not need micromatch.
 */
const matchFilePathGlobs = (filePath: string, globs: string[]): boolean => {
    let kept = false;
    let omitted = false;
    let negatives = 0;
    for (const glob of globs) {
        const isMatch = picomatch(glob, { dot: true }, true);
        const negated = Boolean(isMatch.state?.negated || isMatch.state?.negatedExtglob);
        if (negated) {
            negatives++;
        }
        // For a negated glob, picomatch returns true if the path does NOT match the glob without "!"
        const matched = isMatch(filePath);
        const match = negated ? !matched : matched;
        if (!match) {
            continue;
        }
        if (negated) {
            omitted = true;
        } else {
            omitted = false;
            kept = true;
        }
    }
    return (negatives === globs.length || kept) && !omitted;
};

export const messages = {
    PATTERN: {
        en: (props: { PATTERN_NAME: string; CREDENTIAL: string }) =>
            `found matching ${props.PATTERN_NAME}: ${props.CREDENTIAL}`,
        ja: (props: { PATTERN_NAME: string; CREDENTIAL: string }) =>
            `${props.PATTERN_NAME}にマッチするパターンが見つかりました: ${props.CREDENTIAL}`,
    },
};

export type PatternType = {
    name: string;
    patterns?: string[];
    /**
     * @deprecated Use patterns instead
     */
    pattern?: string;
    filePathGlobs?: string[];
    allows?: string[];
};

export type Options = {
    allows?: string[];
    patterns?: PatternType[];
};

function collectPatterns(patternConfig: PatternType): string[] {
    // Error if both patterns and pattern are specified
    if (patternConfig.patterns && patternConfig.patterns.length > 0 && patternConfig.pattern) {
        throw new Error(
            `Pattern "${patternConfig.name}" cannot have both "patterns" and "pattern" specified. Use "patterns" array instead.`,
        );
    }

    // Prefer patterns array
    if (patternConfig.patterns && patternConfig.patterns.length > 0) {
        return patternConfig.patterns;
    }

    // Fallback to deprecated pattern field
    if (patternConfig.pattern) {
        return [patternConfig.pattern];
    }

    return [];
}

function reportIfFoundPattern({
    source,
    options,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    for (const p of options.patterns) {
        // Check filePathGlobs if specified
        // Negation patterns (e.g., "!**/excluded/**") are supported in the same way as micromatch().
        // `dot: true` is required so that `**` traverses segments that start with `.`
        // (e.g., `.github`, `.ai`); otherwise negation patterns like `!**/excluded/**`
        // fail to match files located under a dot-directory.
        if (p.filePathGlobs && p.filePathGlobs.length > 0 && source.filePath) {
            if (!matchFilePathGlobs(source.filePath, p.filePathGlobs)) {
                continue; // Skip if file path doesn't match any glob pattern
            }
        }

        const allPatterns = collectPatterns(p);

        // Check patterns if specified
        if (allPatterns.length > 0) {
            const mergedAllows = [...options.allows, ...(p.allows ?? [])];
            const results = matchPatterns(source.content, allPatterns);
            for (const result of results) {
                const index = result.startIndex || 0;
                const match = result.match || "";
                const range = [index, index + match.length] as const;
                const allowedResults = matchPatterns(match, mergedAllows);
                if (allowedResults.length > 0) {
                    continue;
                }
                context.report({
                    message: t("PATTERN", {
                        PATTERN_NAME: p.name,
                        CREDENTIAL: match,
                    }),
                    range,
                });
            }
        } else if (p.filePathGlobs && p.filePathGlobs.length > 0) {
            // If only filePathGlobs is specified (no patterns), report the file itself
            context.report({
                message: t("PATTERN", {
                    PATTERN_NAME: p.name,
                    CREDENTIAL: basename(source.filePath || ""),
                }),
                range: [0, source.content.length],
            });
        }
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pattern",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
            patterns: options.patterns || [],
        };

        // Validate patterns
        for (const p of normalizedOptions.patterns) {
            // Validate that patterns and pattern are not both specified
            if (p.patterns && p.patterns.length > 0 && p.pattern) {
                throw new Error(
                    `Pattern "${p.name}" cannot have both "patterns" and "pattern" specified. Use "patterns" array instead.`,
                );
            }

            const hasPatterns = (p.patterns && p.patterns.length > 0) || p.pattern;
            const hasFilePathGlobs = p.filePathGlobs && p.filePathGlobs.length > 0;
            if (!hasPatterns && !hasFilePathGlobs) {
                throw new Error(
                    `Pattern "${p.name}" must have either "patterns", "pattern" (deprecated), or "filePathGlobs" specified`,
                );
            }
        }

        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundPattern({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
