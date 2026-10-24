import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DIGITALOCEAN_PAT: {
        en: (props: { ID: string }) => `found DigitalOcean personal access token: ${props.ID}`,
        ja: (props: { ID: string }) => `DigitalOcean personal access token: ${props.ID} がみつかりました`,
    },
    DIGITALOCEAN_OAUTH_TOKEN: {
        en: (props: { ID: string }) => `found DigitalOcean OAuth access token: ${props.ID}`,
        ja: (props: { ID: string }) => `DigitalOcean OAuth access token: ${props.ID} がみつかりました`,
    },
    DIGITALOCEAN_OAUTH_REFRESH_TOKEN: {
        en: (props: { ID: string }) => `found DigitalOcean OAuth refresh token: ${props.ID}`,
        ja: (props: { ID: string }) => `DigitalOcean OAuth refresh token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-digitalocean",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-digitalocean/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options?.allows ?? [];
        return {
            file(source: SecretLintSourceCode) {
                // Versioned token prefixes are documented in the API reference:
                // https://docs.digitalocean.com/reference/api/reference/account/
                // Reject partial matches of longer or embedded token-like words.
                const patterns = [
                    { pattern: /(?<!\p{L})dop_v1_[a-f0-9]{64}(?![\p{L}0-9_])/gu, id: "DIGITALOCEAN_PAT" },
                    { pattern: /(?<!\p{L})doo_v1_[a-f0-9]{64}(?![\p{L}0-9_])/gu, id: "DIGITALOCEAN_OAUTH_TOKEN" },
                    {
                        pattern: /(?<!\p{L})dor_v1_[a-f0-9]{64}(?![\p{L}0-9_])/gu,
                        id: "DIGITALOCEAN_OAUTH_REFRESH_TOKEN",
                    },
                ] as const;
                for (const { pattern, id } of patterns) {
                    for (const match of source.content.matchAll(pattern)) {
                        const index = match.index ?? 0;
                        const matchString = match[0];
                        if (matchPatterns(matchString, allows).length > 0) {
                            continue;
                        }
                        context.report({
                            message: t(id, { ID: matchString }),
                            range: [index, index + matchString.length],
                        });
                    }
                }
            },
        };
    },
};
