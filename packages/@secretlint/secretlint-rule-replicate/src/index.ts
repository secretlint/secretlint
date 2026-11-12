import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    REPLICATE_API_TOKEN: {
        en: (props: { ID: string }) => `found replicate api token: ${props.ID}`,
        ja: (props: { ID: string }) => `replicate api token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-replicate",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-replicate/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /(?<![\p{L}\p{N}_])r8_[A-Za-z0-9_-]{37}(?![\p{L}\p{N}_-])/gu;
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
                        message: t("REPLICATE_API_TOKEN", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
