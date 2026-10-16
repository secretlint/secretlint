import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    ANTHROPIC_API_KEY: {
        en: (props: { KEY: string }) => `found Anthropic Claude API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Anthropic Claude API キー: ${props.KEY} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-anthropic",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-anthropic/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Anthropic Claude API keys patterns:
                // - sk-ant-api03-... (original format) - 13 chars prefix
                // - sk-ant-api04-... (newer format) - 13 chars prefix
                // Example format: sk-ant-api03-<93 base64url chars>AA (108 chars total)
                // Breakdown: prefix(13) + middle(93) + suffix(2) = 108 chars
                // Pattern: sk-ant-api0[3-4]- + base64-like characters (exactly 93 chars) + ending with AA
                // https://docs.anthropic.com/en/api/overview
                // https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key
                // https://docs.gitguardian.com/secrets-detection/secrets-detection-engine/detectors/specifics/claude_api_key
                const pattern = /(?<!\p{L})sk-ant-api0\d-[A-Za-z0-9_-]{90,128}AA(?![A-Za-z0-9_-])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("ANTHROPIC_API_KEY", {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
