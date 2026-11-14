import type { SecretLintRuleCreator } from "@secretlint/types";
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
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/vercel.md",
        },
    },
    patterns: [
        {
            pattern: /(?<!\p{L})(?<prefix>vcp|vci|vca|vcr|vck)_[A-Za-z0-9]{20,60}(?![A-Za-z0-9])/gu,
            keywords: ["vcp_", "vci_", "vca_", "vcr_", "vck_"],
            scope: "line",
            report(match, context) {
                const prefix = match.groups?.prefix as VercelTokenPrefix;
                const messageId = prefixToMessageId[prefix];
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t(messageId, {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
