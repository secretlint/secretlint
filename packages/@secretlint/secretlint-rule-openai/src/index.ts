import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    OPENAI_TOKEN: {
        en: (props: { TOKEN: string }) => `found OpenAI API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `OpenAI API トークン: ${props.TOKEN} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
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
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("OPENAI_TOKEN", {
                            TOKEN: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
