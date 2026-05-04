import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    TAILSCALE_API_KEY: {
        en: (props: { KEY: string }) => `found Tailscale API access token: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale API アクセストークン: ${props.KEY} がみつかりました`,
    },
    TAILSCALE_AUTH_KEY: {
        en: (props: { KEY: string }) => `found Tailscale pre-authentication key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale 事前認証キー: ${props.KEY} がみつかりました`,
    },
    TAILSCALE_CLIENT_KEY: {
        en: (props: { KEY: string }) => `found Tailscale OAuth client key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale OAuth クライアントキー: ${props.KEY} がみつかりました`,
    },
    TAILSCALE_SCIM_KEY: {
        en: (props: { KEY: string }) => `found Tailscale SCIM key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale SCIM キー: ${props.KEY} がみつかりました`,
    },
    TAILSCALE_WEBHOOK_KEY: {
        en: (props: { KEY: string }) => `found Tailscale webhook key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale Webhook キー: ${props.KEY} がみつかりました`,
    },
    TAILSCALE_KEY: {
        en: (props: { KEY: string }) => `found Tailscale key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale キー: ${props.KEY} がみつかりました`,
    },
};

const messageIdByType: Record<string, keyof typeof messages> = {
    api: "TAILSCALE_API_KEY",
    auth: "TAILSCALE_AUTH_KEY",
    client: "TAILSCALE_CLIENT_KEY",
    scim: "TAILSCALE_SCIM_KEY",
    webhook: "TAILSCALE_WEBHOOK_KEY",
};

export const creator: SecretLintRuleCreator = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-tailscale",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-tailscale/README.md",
        },
    },
    create(context) {
        const t = context.createTranslator(messages);
        return {
            file(source: SecretLintSourceCode) {
                // Tailscale keys: tskey-{type}-{identifier}-{secret}
                // Documented types: api, auth, client, scim, webhook
                // https://tailscale.com/docs/reference/key-prefixes
                // GitHub Secret Scanning supports these as Push Protection targets.
                // TruffleHog uses the equivalent pattern: \btskey-[a-z]+-[0-9A-Za-z_]+-[0-9A-Za-z_]+\b
                const pattern =
                    /(?<!\p{L})tskey-(?<type>[a-z]+)-[0-9A-Za-z_]{8,40}-[0-9A-Za-z_]{16,60}(?![0-9A-Za-z_])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const type = match.groups?.type ?? "";
                    const range = [index, index + matchString.length] as const;
                    const messageId = messageIdByType[type] ?? "TAILSCALE_KEY";
                    context.report({
                        message: t(messageId, {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
