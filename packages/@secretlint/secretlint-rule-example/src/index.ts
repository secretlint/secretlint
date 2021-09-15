import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props: { ID: string }) => `found secret: ${props.ID}`,
        ja: (props: { ID: string }) => `secret: ${props.ID} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-example",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-example/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /SECRET/g;
                let match;
                while ((match = pattern.exec(source.content)) !== null) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];
                    context.report({
                        message: t("EXAMPLE_MESSAGE", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
