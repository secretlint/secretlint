import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    FIGMA_PERSONAL_ACCESS_TOKEN: {
        en: (props: { ID: string }) => `found Figma Personal Access Token: ${props.ID}`,
        ja: (props: { ID: string }) => `Figma Personal Access Token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-figma",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/figma.md",
        },
    },
    patterns: [
        {
            // Figma Personal Access Token
            // Format: `figd_` prefix followed by 40-200 characters of [A-Za-z0-9_-]
            // Reference: https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
            pattern: /(?<!\p{L})figd_[A-Za-z0-9_-]{40,200}(?![A-Za-z0-9_-])/gu,
            keywords: ["figd_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("FIGMA_PERSONAL_ACCESS_TOKEN", {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
