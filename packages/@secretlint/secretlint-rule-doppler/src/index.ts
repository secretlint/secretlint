import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DOPPLER_PERSONAL_TOKEN: {
        en: (props: { ID: string }) => `found doppler personal token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler personal token: ${props.ID} がみつかりました`,
    },
    DOPPLER_SERVICE_TOKEN: {
        en: (props: { ID: string }) => `found doppler service token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler service token: ${props.ID} がみつかりました`,
    },
    DOPPLER_SERVICE_ACCOUNT_TOKEN: {
        en: (props: { ID: string }) => `found doppler service account token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler service account token: ${props.ID} がみつかりました`,
    },
    DOPPLER_CLI_TOKEN: {
        en: (props: { ID: string }) => `found doppler CLI token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler CLI token: ${props.ID} がみつかりました`,
    },
    DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN: {
        en: (props: { ID: string }) => `found doppler service account identity token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler service account identity token: ${props.ID} がみつかりました`,
    },
    DOPPLER_SCIM_TOKEN: {
        en: (props: { ID: string }) => `found doppler SCIM token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler SCIM token: ${props.ID} がみつかりました`,
    },
    DOPPLER_AUDIT_TOKEN: {
        en: (props: { ID: string }) => `found doppler audit token: ${props.ID}`,
        ja: (props: { ID: string }) => `doppler audit token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    /** Allow patterns written as RegExp-like strings. */
    allows?: string[];
};

// https://docs.doppler.com/reference/auth-token-formats
const patterns: { messageId: keyof typeof messages; pattern: RegExp }[] = [
    { messageId: "DOPPLER_PERSONAL_TOKEN", pattern: /(?<![\p{L}\p{N}_])dp\.pt\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu },
    {
        messageId: "DOPPLER_SERVICE_TOKEN",
        pattern: /(?<![\p{L}\p{N}_])dp\.st\.(?:[a-z0-9_-]{2,35}\.)?[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_]|\.[A-Za-z0-9])/gu,
    },
    {
        messageId: "DOPPLER_SERVICE_ACCOUNT_TOKEN",
        pattern: /(?<![\p{L}\p{N}_])dp\.sa\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
    },
    { messageId: "DOPPLER_CLI_TOKEN", pattern: /(?<![\p{L}\p{N}_])dp\.ct\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu },
    {
        messageId: "DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN",
        pattern: /(?<![\p{L}\p{N}_])dp\.said\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu,
    },
    { messageId: "DOPPLER_SCIM_TOKEN", pattern: /(?<![\p{L}\p{N}_])dp\.scim\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu },
    { messageId: "DOPPLER_AUDIT_TOKEN", pattern: /(?<![\p{L}\p{N}_])dp\.audit\.[A-Za-z0-9]{40,44}(?![\p{L}\p{N}_])/gu },
];

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-doppler",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-doppler/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options?.allows ?? [];
        return {
            file(source: SecretLintSourceCode) {
                for (const { messageId, pattern } of patterns) {
                    for (const match of source.content.matchAll(pattern)) {
                        const index = match.index;
                        const matchString = match[0];
                        if (matchPatterns(matchString, allows).length > 0) {
                            continue;
                        }
                        context.report({
                            message: t(messageId, { ID: matchString }),
                            range: [index, index + matchString.length],
                        });
                    }
                }
            },
        };
    },
};
