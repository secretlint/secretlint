import type {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode,
} from "@secretlint/types";
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

function reportIfFoundToken({
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
    const NOTION_INTEGRATION_TOKEN_PATTERN = /(?<!\p{L})ntn_[0-9]{11}[A-Za-z0-9]{35}(?![A-Za-z0-9])/gu;
    const results = source.content.matchAll(NOTION_INTEGRATION_TOKEN_PATTERN);
    for (const result of results) {
        const index = result.index ?? 0;
        const match = result[0] ?? "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("NOTION_INTEGRATION_TOKEN", {
                TOKEN: match,
            }),
            range,
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-notion",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-notion/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions: Required<Options> = {
            allows: options.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundToken({ source, options: normalizedOptions, context, t });
            },
        };
    },
};
