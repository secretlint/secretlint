export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props) => `found secret: ${props.ID}`,
        ja: (props) => `secret: ${props.ID} がみつかりました`
    }
};

export const creator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-example",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-example/README.md"
        }
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source) {
                const pattern = /secret/gi;
                let match;
                while ((match = pattern.exec(source.content)) !== null) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];
                    context.report({
                        message: t("EXAMPLE_MESSAGE", {
                            ID: matchString
                        }),
                        range
                    });
                }
            }
        };
    }
};
