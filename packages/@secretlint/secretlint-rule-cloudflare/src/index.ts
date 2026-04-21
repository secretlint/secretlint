import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    CLOUDFLARE_GLOBAL_API_KEY: {
        en: (props: { TOKEN: string }) => `found Cloudflare Global API Key: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Cloudflare Global API Keyが見つかりました: ${props.TOKEN}`,
    },
    CLOUDFLARE_USER_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found Cloudflare User API Token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Cloudflare User API Tokenが見つかりました: ${props.TOKEN}`,
    },
    CLOUDFLARE_ACCOUNT_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found Cloudflare Account API Token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Cloudflare Account API Tokenが見つかりました: ${props.TOKEN}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

type CLOUDFLARE_TOKEN_TYPE = "cfk" | "cfut" | "cfat";
const messageIdMap: Record<CLOUDFLARE_TOKEN_TYPE, keyof typeof messages> = {
    cfk: "CLOUDFLARE_GLOBAL_API_KEY",
    cfut: "CLOUDFLARE_USER_API_TOKEN",
    cfat: "CLOUDFLARE_ACCOUNT_API_TOKEN",
};

// Cloudflare prefixed token format: {prefix}_{40 chars body}{8 chars checksum}
// The checksum is CRC32 of the body encoded as 8 lowercase hex chars (fixed length).
// If Cloudflare changes the checksum algorithm, update the total length ({48}) accordingly.
// https://developers.cloudflare.com/fundamentals/api/get-started/token-formats/
const CLOUDFLARE_TOKEN_PATTERN = /(?<!\p{L})(?<prefix>cfk|cfut|cfat)_[A-Za-z0-9]{48}(?![A-Za-z0-9])/gu;

function reportIfFound({
    source,
    options,
    context,
    t,
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    const results = source.content.matchAll(CLOUDFLARE_TOKEN_PATTERN);
    for (const result of results) {
        const index = result.index ?? 0;
        const match = result[0] ?? "";
        const prefix = result.groups?.["prefix"] as CLOUDFLARE_TOKEN_TYPE | undefined;
        if (!prefix) {
            continue;
        }
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t(messageIdMap[prefix], {
                TOKEN: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-cloudflare",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-cloudflare/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions: Required<Options> = {
            allows: options.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFound({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
