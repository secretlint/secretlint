import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    DATABRICKS_PERSONAL_ACCESS_TOKEN: {
        en: (props: { ID: string }) => `found Databricks personal access token: ${props.ID}`,
        ja: (props: { ID: string }) => `Databricks personal access token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-databricks",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/databricks.md",
        },
    },
    patterns: [
        {
            // Databricks personal access tokens:
            // - Prefix: `dapi`
            // - Body: 32 hexadecimal characters (Databricks issues lowercase,
            //   but match case-insensitively to be lenient)
            // - Optional suffix: `-<single digit>`
            // Reference:
            // - https://docs.databricks.com/aws/en/dev-tools/auth/pat
            // - https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns
            pattern: /(?<!\p{L})dapi[A-Fa-f0-9]{32}(?:-[0-9])?(?![A-Fa-f0-9])/gu,
            keywords: ["dapi"],
            scope: "line",
            report(match, context) {
                const allowedResults = matchPatterns(match.text, context.options.allows ?? []);
                if (allowedResults.length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("DATABRICKS_PERSONAL_ACCESS_TOKEN", {
                        ID: match.text,
                    }),
                    range: match.range,
                });
            },
        },
    ],
};
