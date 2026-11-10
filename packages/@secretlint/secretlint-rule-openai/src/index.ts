import { defineRule } from "@secretlint/define-rule";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    OPENAI_TOKEN: {
        en: (props: { TOKEN: string }) => `found OpenAI API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `OpenAI API トークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-openai",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-openai/README.md",
        },
    },
    patterns: [
        {
            pattern:
                /sk-(?:proj|svcacct|admin)-(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})T3BlbkFJ(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})\b|sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}/g,
            keywords: ["T3BlbkFJ"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("OPENAI_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
});
