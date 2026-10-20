import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SUPABASE_PERSONAL_ACCESS_TOKEN: {
        en: (props: { TOKEN: string }) => `found Supabase personal access token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Supabase personal access token: ${props.TOKEN} がみつかりました`,
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
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-supabase/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /(?<!\p{L})sbp_(?:oauth_|v0_)?[a-f0-9]{40}(?![\p{L}\p{N}_])/gu;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchString = match[0] ?? "";
                    const allowedResults = matchPatterns(matchString, normalizedOptions.allows);
                    if (allowedResults.length > 0) {
                        continue;
                    }
                    const range = [index, index + matchString.length] as const;
                    context.report({
                        message: t("SUPABASE_PERSONAL_ACCESS_TOKEN", {
                            TOKEN: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
