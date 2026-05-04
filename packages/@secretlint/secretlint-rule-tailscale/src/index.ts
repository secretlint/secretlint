import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

export const messages = {
    TAILSCALE_KEY: {
        en: (props: { KEY: string }) => `found Tailscale key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Tailscale キー: ${props.KEY} がみつかりました`,
    },
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
                const pattern = /(?<!\p{L})tskey-[a-z]+-[0-9A-Za-z_]{8,40}-[0-9A-Za-z_]{16,60}(?![0-9A-Za-z_])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("TAILSCALE_KEY", {
                            KEY: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
