import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "../../../helper/regexp-string-matcher.js";

export const messages = {
    GRAFANA_CLOUD_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found Grafana Cloud API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Grafana Cloud API トークン: ${props.TOKEN} がみつかりました`,
    },
    GRAFANA_SERVICE_ACCOUNT_TOKEN: {
        en: (props: { TOKEN: string }) => `found Grafana Service Account token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Grafana Service Account トークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-grafana",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-grafana/README.md",
        },
    },
    patterns: [
        {
            // Grafana Cloud API token
            // Prefix: `glc_`, followed by base64-encoded JWT content.
            // Real tokens start with `glc_eyJ` (the base64 prefix of `{"`).
            // https://grafana.com/docs/grafana-cloud/account-management/authentication-and-permissions/api-keys/
            pattern: /(?<!\p{L})glc_[A-Za-z0-9+/]{32,400}={0,2}(?![A-Za-z0-9+/=])/gu,
            keywords: ["glc_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("GRAFANA_CLOUD_API_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
        {
            // Grafana Service Account token
            // Prefix: `glsa_`, followed by 32 alphanumeric characters, an
            // underscore, and an 8-character hex checksum.
            // https://grafana.com/docs/grafana/latest/administration/service-accounts/
            pattern: /(?<!\p{L})glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8}(?![A-Fa-f0-9])/gu,
            keywords: ["glsa_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("GRAFANA_SERVICE_ACCOUNT_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
