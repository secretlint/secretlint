import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DIGITALOCEAN_PAT: {
        en: (props: { TOKEN: string }) => `found DigitalOcean personal access token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `DigitalOceanパーソナルアクセストークン: ${props.TOKEN} がみつかりました`,
    },
    DIGITALOCEAN_OAUTH_TOKEN: {
        en: (props: { TOKEN: string }) => `found DigitalOcean OAuth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `DigitalOcean OAuthトークン: ${props.TOKEN} がみつかりました`,
    },
    DIGITALOCEAN_OAUTH_REFRESH_TOKEN: {
        en: (props: { TOKEN: string }) => `found DigitalOcean OAuth refresh token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `DigitalOcean OAuthリフレッシュトークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-digitalocean",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/digitalocean.md",
        },
    },
    patterns: [
        {
            // DigitalOcean tokens have an identifiable prefix and 64 lowercase hex characters.
            // dop_v1_: personal access tokens, doo_v1_: OAuth tokens, dor_v1_: OAuth refresh tokens
            // https://docs.digitalocean.com/reference/api/reference/account/
            pattern: /(?<![\p{L}\p{N}_])dop_v1_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu,
            keywords: ["dop_v1_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DIGITALOCEAN_PAT", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])doo_v1_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu,
            keywords: ["doo_v1_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DIGITALOCEAN_OAUTH_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            pattern: /(?<![\p{L}\p{N}_])dor_v1_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu,
            keywords: ["dor_v1_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DIGITALOCEAN_OAUTH_REFRESH_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
