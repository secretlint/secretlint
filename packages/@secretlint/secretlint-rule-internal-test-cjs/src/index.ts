import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    EXAMPLE_MESSAGE: {
        en: (props: { ID: string }) => `found secret: ${props.ID}`,
        ja: (props: { ID: string }) => `secret: ${props.ID} がみつかりました`,
    },
};
/**
 * It is for testing
 * @param override
 */
export const createCreator = (
    override: Partial<Pick<SecretLintRuleCreator, "messages" | "meta">>
): SecretLintRuleCreator => {
    return {
        ...creator,
        messages: {
            ...creator.messages,
            ...override.messages,
        },
        meta: {
            ...creator.meta,
            ...override.meta,
        },
    };
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-internal-test-esm",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-internal-test-cjs/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /SECRET/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length] as const;
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
