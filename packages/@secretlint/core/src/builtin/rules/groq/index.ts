import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    GROQ_API_KEY: {
        en: (props: { KEY: string }) => `found Groq API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Groq API キー: ${props.KEY} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-groq",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/groq.md",
        },
    },
    patterns: [
        {
            // Groq API keys format:
            // - Prefix "gsk_" followed by exactly 52 alphanumeric characters
            // References:
            // - https://console.groq.com/docs/quickstart
            // - https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
            // - https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/groq/groq.go
            pattern: /(?<!\p{L})gsk_[a-zA-Z0-9]{52}(?![a-zA-Z0-9])/gu,
            keywords: ["gsk_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("GROQ_API_KEY", {
                        KEY: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
