import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

require("string.prototype.matchall").shim();

export const messages = {
    genericAPIKey: {
        en: (props: { KEY: string }) => `generic api key found: ${props.KEY}`,
        ja: (props: { KEY: string }) => `汎用APIキーが (${props.KEY}) で見つかりました`, // TODO: Needs review.
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
        id: "@secretlint/secretlint-rule-generic-api-key",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url:
                "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-generic-api-key/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /(?i)(?:apikey|api_key).*['|\"].+['|\"]/gi;
                const results = source.content.matchAll(pattern);
                for (const result of results) {
                    const index = result.index || 0;
                    const match = result[0] || "";
                    const range = [index, index + match.length];
                    const allowedResults = matchPatterns(match, options.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    context.report({
                        message: t("genericAPIKey", {
                            KEY: match,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
export default creator;
