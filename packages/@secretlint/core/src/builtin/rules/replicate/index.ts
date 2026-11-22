import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    REPLICATE_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found Replicate API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Replicate APIトークン: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-replicate",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/replicate.md",
        },
    },
    patterns: [
        {
            // Replicate API tokens are 40-character strings that start with "r8_".
            // https://replicate.com/docs/topics/security/api-tokens
            pattern: /(?<![\p{L}\p{N}_])r8_[A-Za-z0-9_-]{37}(?![\p{L}\p{N}_-])/gu,
            keywords: ["r8_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("REPLICATE_API_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
