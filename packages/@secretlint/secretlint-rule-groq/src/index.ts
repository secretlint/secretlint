import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    GROQ_API_KEY: {
        en: (props: { KEY: string }) => `found Groq API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Groq API キー: ${props.KEY} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-groq",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-groq/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                // Groq API keys format:
                // - Prefix "gsk_" followed by exactly 52 alphanumeric characters
                // Example: gsk_aBcDeFgHiJkLmNoPqRsT1234567890abcdefghijklmnopqrstuv (56 chars total)
                // References:
                // - https://console.groq.com/docs/quickstart
                // - https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
                // - https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/groq/groq.go
                const pattern = /(?<!\p{L})gsk_[a-zA-Z0-9]{52}(?![a-zA-Z0-9])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("GROQ_API_KEY", {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
