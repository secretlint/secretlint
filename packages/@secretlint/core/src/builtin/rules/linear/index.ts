import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    LINEAR_API_TOKEN: {
        en: (props: { ID: string }) => `found linear api token: ${props.ID}`,
        ja: (props: { ID: string }) => `linear api token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-linear",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/linear.md",
        },
    },
    patterns: [
        {
            pattern: /(?<!\p{L})lin_api_[a-zA-Z0-9_]{32,128}(?![a-zA-Z0-9_])/gu,
            keywords: ["lin_api_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("LINEAR_API_TOKEN", {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
