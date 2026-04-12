import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    VERCEL_PERSONAL_ACCESS_TOKEN: {
        en: (props: { ID: string }) => `found Vercel personal access token: ${props.ID}`,
        ja: (props: { ID: string }) => `Vercel personal access token: ${props.ID} がみつかりました`,
    },
    VERCEL_INTEGRATION_TOKEN: {
        en: (props: { ID: string }) => `found Vercel integration token: ${props.ID}`,
        ja: (props: { ID: string }) => `Vercel integration token: ${props.ID} がみつかりました`,
    },
    VERCEL_APP_ACCESS_TOKEN: {
        en: (props: { ID: string }) => `found Vercel app access token: ${props.ID}`,
        ja: (props: { ID: string }) => `Vercel app access token: ${props.ID} がみつかりました`,
    },
    VERCEL_APP_REFRESH_TOKEN: {
        en: (props: { ID: string }) => `found Vercel app refresh token: ${props.ID}`,
        ja: (props: { ID: string }) => `Vercel app refresh token: ${props.ID} がみつかりました`,
    },
    VERCEL_AI_GATEWAY_API_KEY: {
        en: (props: { ID: string }) => `found Vercel AI Gateway API key: ${props.ID}`,
        ja: (props: { ID: string }) => `Vercel AI Gateway API key: ${props.ID} がみつかりました`,
    },
};

type VercelTokenPrefix = "vcp" | "vci" | "vca" | "vcr" | "vck";

const prefixToMessageId: Record<VercelTokenPrefix, keyof typeof messages> = {
    vcp: "VERCEL_PERSONAL_ACCESS_TOKEN",
    vci: "VERCEL_INTEGRATION_TOKEN",
    vca: "VERCEL_APP_ACCESS_TOKEN",
    vcr: "VERCEL_APP_REFRESH_TOKEN",
    vck: "VERCEL_AI_GATEWAY_API_KEY",
};

export type Options = {
    allows?: string[];
};
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-vercel",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-vercel/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /(?<!\p{L})(?<prefix>vcp|vci|vca|vcr|vck)_[A-Za-z0-9]{20,60}(?![A-Za-z0-9])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const prefix = match.groups?.prefix as VercelTokenPrefix;
                    const messageId = prefixToMessageId[prefix];
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t(messageId, {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
