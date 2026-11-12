import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";

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
    patterns: [
        {
            // Anthropic Claude API keys patterns:
            // - sk-ant-api03-... (original format) - 13 chars prefix
            // - sk-ant-api04-... (newer format) - 13 chars prefix
            // Example format: sk-ant-api03-<93 base64url chars>AA (108 chars total)
            // Breakdown: prefix(13) + middle(93) + suffix(2) = 108 chars
            // Pattern: sk-ant-api0[3-4]- + base64-like characters (exactly 93 chars) + ending with AA
            // https://docs.anthropic.com/en/api/overview
            // https://docs.anthropic.com/en/api/admin-api/apikeys/get-api-key
            // https://docs.gitguardian.com/secrets-detection/secrets-detection-engine/detectors/specifics/claude_api_key
            pattern: /(?<!\p{L})sk-ant-api0\d-[A-Za-z0-9_-]{90,128}AA(?![A-Za-z0-9_-])/gu,
            keywords: ["sk-ant-api0"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("ANTHROPIC_API_KEY", {
                        KEY: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
