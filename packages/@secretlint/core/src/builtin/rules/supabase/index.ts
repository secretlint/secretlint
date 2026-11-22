import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SUPABASE_PERSONAL_ACCESS_TOKEN: {
        en: (props: { TOKEN: string }) => `found Supabase personal access token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Supabaseパーソナルアクセストークン: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-supabase",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/supabase.md",
        },
    },
    patterns: [
        {
            // Supabase access tokens: "sbp_", "sbp_oauth_", or "sbp_v0_" + 40 lowercase hex characters.
            // The format is the same as the validator of Supabase CLI:
            // https://github.com/supabase/cli/blob/main/apps/cli/src/auth/access-token.ts
            pattern: /(?<![\p{L}\p{N}_])sbp_(?:oauth_|v0_)?[a-f0-9]{40}(?![\p{L}\p{N}_])/gu,
            keywords: ["sbp_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("SUPABASE_PERSONAL_ACCESS_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
