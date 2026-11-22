import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    RUBYGEMS_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found RubyGems API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `RubyGems APIトークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-rubygems",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/rubygems.md",
        },
    },
    patterns: [
        {
            // RubyGems API keys: "rubygems_" + 48 lowercase hex characters.
            // https://guides.rubygems.org/api-key-scopes/
            pattern: /(?<![\p{L}\p{N}_])rubygems_[a-f0-9]{48}(?![\p{L}\p{N}_])/gu,
            keywords: ["rubygems_"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("RUBYGEMS_API_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
