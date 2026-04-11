import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

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

type MessageId = "GRAFANA_CLOUD_API_TOKEN" | "GRAFANA_SERVICE_ACCOUNT_TOKEN";

function reportIfFound({
    pattern,
    messageId,
    source,
    options,
    context,
    t,
}: {
    pattern: RegExp;
    messageId: MessageId;
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    const results = source.content.matchAll(pattern);
    for (const result of results) {
        const index = result.index ?? 0;
        const match = result[0] ?? "";
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        const range = [index, index + match.length] as const;
        context.report({
            message: t(messageId, {
                TOKEN: match,
            }),
            range,
        });
    }
}

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
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions: Required<Options> = {
            allows: options?.allows ?? [],
        };
        // Grafana Cloud API token
        // Prefix: `glc_`, followed by base64-encoded JWT content.
        // Real tokens start with `glc_eyJ` (the base64 prefix of `{"`).
        // https://grafana.com/docs/grafana-cloud/account-management/authentication-and-permissions/api-keys/
        const GRAFANA_CLOUD_API_TOKEN_PATTERN = /(?<!\p{L})glc_[A-Za-z0-9+/]{32,400}={0,2}(?![A-Za-z0-9+/=])/gu;
        // Grafana Service Account token
        // Prefix: `glsa_`, followed by 32 alphanumeric characters, an
        // underscore, and an 8-character hex checksum.
        // https://grafana.com/docs/grafana/latest/administration/service-accounts/
        const GRAFANA_SERVICE_ACCOUNT_TOKEN_PATTERN = /(?<!\p{L})glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8}(?![A-Fa-f0-9])/gu;
        return {
            file(source: SecretLintSourceCode) {
                reportIfFound({
                    pattern: GRAFANA_CLOUD_API_TOKEN_PATTERN,
                    messageId: "GRAFANA_CLOUD_API_TOKEN",
                    source,
                    options: normalizedOptions,
                    context,
                    t,
                });
                reportIfFound({
                    pattern: GRAFANA_SERVICE_ACCOUNT_TOKEN_PATTERN,
                    messageId: "GRAFANA_SERVICE_ACCOUNT_TOKEN",
                    source,
                    options: normalizedOptions,
                    context,
                    t,
                });
            },
        };
    },
};
