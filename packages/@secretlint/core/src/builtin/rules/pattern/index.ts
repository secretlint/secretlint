import type { SecretLintRuleCreator } from "@secretlint/types";
import picomatch from "picomatch";

/**
 * Return true if the file path matches the globs, in the same way as `micromatch([filePath], globs).length > 0`.
 * A negated glob (starting with "!") excludes the path, and a later positive glob includes it again.
 * If all globs are negated, any path that none of them excludes matches.
 * This is the algorithm of micromatch() with picomatch, so that the rule does not need micromatch.
 */
export const matchFilePathGlobs = (filePath: string, globs: string[]): boolean => {
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
    /**
     * Keywords for pre-filtering: the patterns run only on a file that contains one of them (ASCII case-insensitive).
     * Every match of the patterns must contain one of the keywords.
     * If it is not set, secretlint finds keywords in the patterns. `[]` runs the patterns on every file.
     */
    keywords?: string[];
};

export type Options = {
    allows?: string[];
    patterns?: PatternType[];
};

/**
 * `@secretlint/core` reads the options of this rule as the patterns of the lint plan.
 * See `compileUserPatterns()` of `src/user-patterns.ts`.
 * The rule has no patterns of its own: without `options.patterns`, it is not a part of the lint.
 */
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pattern",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    patterns: [],
};
