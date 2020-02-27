import { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    message_id_a: {
        en: "found secret: {{ID}}",
        ja: "secret: {{ID}} がみつかりました"
    }
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-example",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"]
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /secret/gi;
                let match;
                while ((match = pattern.exec(source.content)) !== null) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length];
                    context.report({
                        message: t("message_id_a", {
                            ID: matchString
                        }),
                        range
                    });
                }
            }
        };
    }
};

module.exports = {
    rules: [
        {
            id: "example",
            disabledMessages: ["not_defined_id"],
            // debug
            rule: creator
        }
    ]
};
