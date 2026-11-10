import { defineRule } from "@secretlint/define-rule";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SENDGRID_KEY: {
        en: (props: { KEY: string }) => `found Sendgrid api key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Sendgrid APIキーが見つかりました： ${props.KEY}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator = defineRule<Options>({
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-sendgrid",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-sendgrid/README.md",
        },
    },
    patterns: [
        {
            pattern: /(?<!\p{L})SG\.\w{1,128}\.\w{1,128}([-_]?)\w{1,128}(?!\w)/gu,
            keywords: ["SG."],
            // "sg." appears often in lower case, such as "msg."
            caseSensitiveKeywords: true,
            scope: "line",
            report(match, context) {
                // send grid api key is 69 characters long
                if (match.text.length !== 69) {
                    return;
                }
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SENDGRID_KEY", {
                        KEY: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
});
