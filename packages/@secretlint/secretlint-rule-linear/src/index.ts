import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    LINEAR_API_TOKEN: {
        en: (props: { ID: string }) => `found linear api token: ${props.ID}`,
        ja: (props: { ID: string }) => `linear api token: ${props.ID} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-linear",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-linear/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /lin_api_[a-zA-Z0-9_]{32,128}/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("LINEAR_API_TOKEN", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
