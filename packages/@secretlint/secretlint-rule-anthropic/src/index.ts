import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    ANTHROPIC_API_KEY: {
        en: (props: { KEY: string }) => `found Anthropic Claude API key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Anthropic Claude API キー: ${props.KEY} がみつかりました`,
    },
};

export const creator: SecretLintRuleCreator = {
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
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                // Anthropic Claude API keys patterns:
                // - sk-ant-api03-... (original format) - 13 chars prefix
                // - sk-ant-api04-... (newer format) - 13 chars prefix
                // Examples from real keys:
                // sk-ant-api03-z0zjHHXo5uibD2havvfqiZYJe9ENlwI1trcQC4pyRC2N2w6nbpUitUU_iR4kkSszVyUpINaxvCtun3_Mub0O3w-48GXRgAA (108 chars total)
                // Breakdown: prefix(13) + middle(93) + suffix(2) = 108 chars
                // Pattern: sk-ant-api0[3-4]- + base64-like characters (exactly 93 chars) + ending with AA
                const pattern = /sk-ant-api0\d-[A-Za-z0-9_-]{90,128}AA/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
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
