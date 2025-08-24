import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import path from "node:path";

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
    pattern?: string;
    filePathGlobs?: string[];
};

export type Options = {
    allows?: string[];
    patterns?: PatternType[];
};

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
        if (p.filePathGlobs && p.filePathGlobs.length > 0 && source.filePath) {
            const matchesPath = p.filePathGlobs.some((glob) => path.matchesGlob(source.filePath!, glob));
            if (!matchesPath) {
                continue; // Skip if file path doesn't match any glob pattern
            }
        }

        // Check pattern if specified
        if (p.pattern) {
            const results = matchPatterns(source.content, [p.pattern]);
            for (const result of results) {
                const index = result.startIndex || 0;
                const match = result.match || "";
                const range = [index, index + match.length] as const;
                const allowedResults = matchPatterns(match, options.allows);
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
            // If only filePathGlobs is specified (no pattern), report the file itself
            context.report({
                message: t("PATTERN", {
                    PATTERN_NAME: p.name,
                    CREDENTIAL: path.basename(source.filePath || ""),
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
            if (!p.pattern && (!p.filePathGlobs || p.filePathGlobs.length === 0)) {
                throw new Error(`Pattern "${p.name}" must have either "pattern" or "filePathGlobs" specified`);
            }
        }

        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundPattern({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
