import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
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
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-figma/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Figma Personal Access Token
                // Format: `figd_` prefix followed by 40-200 characters of [A-Za-z0-9_-]
                // Reference: https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
                const pattern = /(?<!\p{L})figd_[A-Za-z0-9_-]{40,200}(?![A-Za-z0-9_-])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("FIGMA_PERSONAL_ACCESS_TOKEN", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
