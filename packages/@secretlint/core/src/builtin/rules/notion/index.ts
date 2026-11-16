import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    NOTION_INTEGRATION_TOKEN: {
        en: (props: { TOKEN: string }) => `found Notion integration token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Notion integration トークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-notion",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/notion.md",
        },
    },
    patterns: [
        {
            /**
             * Notion Integration Token (new format introduced September 2024).
             *
             * Structure: `ntn_` prefix + 11 digits + 35 alphanumeric characters (46 chars after prefix).
             * The legacy `secret_` prefix is intentionally NOT detected here because it is too
             * generic and prone to false positives.
             *
             * References:
             * - https://developers.notion.com/changelog (API token prefix transition)
             * - https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns
             * - https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml (notion-api-token)
             *
             * Note: Notion warns that the token format may change, so this pattern may need
             * to be revisited if a future format is introduced.
             */
            pattern: /(?<!\p{L})ntn_[0-9]{11}[A-Za-z0-9]{35}(?![A-Za-z0-9])/gu,
            keywords: ["ntn_"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("NOTION_INTEGRATION_TOKEN", {
                        TOKEN: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
