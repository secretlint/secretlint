import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    POSTMAN_API_KEY: {
        en: (props: { TOKEN: string }) => `found Postman API key: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Postman APIキー: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-postman",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/postman.md",
        },
    },
    patterns: [
        {
            // Postman API keys: "PMAK-" + 24 hex characters + "-" + 34 hex characters.
            // Postman does not document the format. The format is the same as the detectors of GitHub secret scanning (postman_api_key) and Gitleaks.
            // https://learning.postman.com/docs/reference/postman-api/authentication
            // https://github.com/gitleaks/gitleaks/blob/master/cmd/generate/config/rules/postman.go
            pattern: /(?<![\p{L}\p{N}_])PMAK-[A-Fa-f0-9]{24}-[A-Fa-f0-9]{34}(?![\p{L}\p{N}_])/gu,
            keywords: ["PMAK-"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("POSTMAN_API_KEY", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
