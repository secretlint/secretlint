import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DOPPLER_PERSONAL_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler personal token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Dopplerパーソナルトークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_SERVICE_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler service token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Dopplerサービストークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_SERVICE_ACCOUNT_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler service account token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Dopplerサービスアカウントトークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler service account identity token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) =>
            `Dopplerサービスアカウントアイデンティティトークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_CLI_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler CLI token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Doppler CLIトークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_SCIM_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler SCIM token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Doppler SCIMトークン: ${props.TOKEN} がみつかりました`,
    },
    DOPPLER_AUDIT_TOKEN: {
        en: (props: { TOKEN: string }) => `found Doppler audit token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Doppler監査トークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-doppler",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/doppler.md",
        },
    },
    patterns: [
        {
            // The formats are from the documentation of Doppler:
            // https://docs.doppler.com/reference/auth-token-formats
            pattern: /(?<![\p{L}\p{N}_])dp\.pt\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.pt."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_PERSONAL_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            // A service token can have the environment between the prefix and the secret: dp.st.dev.xxx
            pattern:
                /(?<![\p{L}\p{N}_])dp\.st\.(?:[a-z0-9_-]{2,35}\.)?[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_]|\.[A-Za-z0-9])/gu,
            keywords: ["dp.st."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_SERVICE_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dp\.sa\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.sa."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_SERVICE_ACCOUNT_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dp\.said\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.said."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dp\.ct\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.ct."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_CLI_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dp\.scim\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.scim."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_SCIM_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dp\.audit\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
            keywords: ["dp.audit."],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DOPPLER_AUDIT_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
