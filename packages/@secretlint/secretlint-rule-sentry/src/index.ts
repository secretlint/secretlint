import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SENTRY_USER_APP_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry user app auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry user app auth トークン: ${props.TOKEN} がみつかりました`,
    },
    SENTRY_ORGANIZATION_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry organization auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry organization auth トークン: ${props.TOKEN} がみつかりました`,
    },
    SENTRY_PERSONAL_TOKEN: {
        en: (props: { TOKEN: string }) => `found Sentry personal auth token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Sentry personal auth トークン: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

type MessageId = keyof typeof messages;

function isOrganizationPayload(payload: string): boolean {
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
}

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
        if (messageId === "SENTRY_ORGANIZATION_TOKEN" && !isOrganizationPayload(result[1])) {
            continue;
        }
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
        id: "@secretlint/secretlint-rule-sentry",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-sentry/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions: Required<Options> = {
            allows: options?.allows ?? [],
        };
        const SENTRY_ORGANIZATION_TOKEN_PATTERN =
            /(?<!\p{L})sntrys_([A-Za-z0-9+/_-]{10,300}={0,2})_[A-Za-z0-9+/_-]{43}(?![\p{L}\p{N}+/_=-])/gu;
        const SENTRY_PERSONAL_TOKEN_PATTERN = /(?<!\p{L})sntryu_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu;
        const SENTRY_USER_APP_TOKEN_PATTERN = /(?<!\p{L})sntrya_[a-f0-9]{64}(?![\p{L}\p{N}_])/gu;
        return {
            file(source: SecretLintSourceCode) {
                reportIfFound({
                    pattern: SENTRY_ORGANIZATION_TOKEN_PATTERN,
                    messageId: "SENTRY_ORGANIZATION_TOKEN",
                    source,
                    options: normalizedOptions,
                    context,
                    t,
                });
                reportIfFound({
                    pattern: SENTRY_PERSONAL_TOKEN_PATTERN,
                    messageId: "SENTRY_PERSONAL_TOKEN",
                    source,
                    options: normalizedOptions,
                    context,
                    t,
                });
                reportIfFound({
                    pattern: SENTRY_USER_APP_TOKEN_PATTERN,
                    messageId: "SENTRY_USER_APP_TOKEN",
                    source,
                    options: normalizedOptions,
                    context,
                    t,
                });
            },
        };
    },
};
