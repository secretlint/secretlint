export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props) => `found secret: ${props.ID}`,
        ja: (props) => `secret: ${props.ID} がみつかりました`
    }
};

export const creator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-internal-test-esm",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-internal-test-esm/README.md"
        }
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source) {
                const pattern = /secret/gi;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
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
