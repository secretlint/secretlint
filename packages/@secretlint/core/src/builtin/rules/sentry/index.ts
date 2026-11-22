import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SENTRY_ORGANIZATION_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry organization auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry organization auth トークン: ${props.TOKEN} がみつかりました`,
    },
    SENTRY_PERSONAL_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry personal auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry personal auth トークン: ${props.TOKEN} がみつかりました`,
    },
    SENTRY_USER_APP_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry user app auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry user app auth トークン: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

/**
 * The payload of an organization token is Base64 of a JSON object that has the issued-at time `iat`.
 * A string that is not such a payload is not an organization token.
 */
const isOrganizationPayload = (payload: string): boolean => {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    try {
        const decoded = atob(base64);
        if (btoa(decoded).replace(/=+$/, "") !== base64.replace(/=+$/, "")) {
            return false;
        }
        const data: unknown = JSON.parse(decoded);
        return (
            typeof data === "object" &&
            data !== null &&
            !Array.isArray(data) &&
            "iat" in data &&
            typeof data.iat === "number" &&
            Number.isFinite(data.iat)
        );
    } catch {
        return false;
    }
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-sentry",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/sentry.md",
        },
    },
    patterns: [
        {
            // Organization auth tokens: "sntrys_" + Base64 of a JSON payload + "_" + 43 Base64 characters of the secret.
            // https://github.com/getsentry/sentry/blob/master/src/sentry/utils/security/orgauthtoken_token.py
            // The payload has two URLs (the deployment URL of a self-hosted Sentry can be long) and the organization slug.
            // The length of the payload is bounded, so that a match attempt reads a bounded part of the line.
            pattern:
                /(?<!\p{L})sntrys_(?<payload>[A-Za-z0-9+/_-]{10,4096}={0,2})_[A-Za-z0-9+/_-]{43}(?![\p{L}\p{N}+/_=-])/gu,
            keywords: ["sntrys_"],
            scope: "line",
            report(match, context) {
                if (!isOrganizationPayload(match.groups?.payload ?? "")) {
                    return;
                }
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SENTRY_ORGANIZATION_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            // Personal auth tokens: "sntryu_" + 64 lowercase hex characters.
            pattern: /(?<!\p{L})sntryu_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu,
            keywords: ["sntryu_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SENTRY_PERSONAL_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
        {
            // User app auth tokens: "sntrya_" + 64 lowercase hex characters.
            pattern: /(?<!\p{L})sntrya_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu,
            keywords: ["sntrya_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SENTRY_USER_APP_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
