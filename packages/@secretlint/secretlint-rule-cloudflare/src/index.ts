import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    CLOUDFLARE_API_TOKEN: {
        en: (props: { TOKEN: string; TYPE: string }) => `found Cloudflare ${props.TYPE}: ${props.TOKEN}`,
        ja: (props: { TOKEN: string; TYPE: string }) => `Cloudflare ${props.TYPE}が見つかりました: ${props.TOKEN}`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

const TOKEN_TYPES: Record<string, string> = {
    cfk: "Global API Key",
    cfut: "User API Token",
    cfat: "Account API Token",
};

// Cloudflare prefixed token format: {prefix}_{40 chars body}{8 chars checksum}
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
        const prefix = result.groups?.["prefix"] ?? "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("CLOUDFLARE_API_TOKEN", {
                TOKEN: match,
                TYPE: TOKEN_TYPES[prefix] ?? "API token",
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
