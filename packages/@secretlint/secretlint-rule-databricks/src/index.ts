import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
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
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-databricks/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // Databricks personal access tokens:
                // - Prefix: `dapi`
                // - Body: 32 hexadecimal characters (Databricks issues lowercase,
                //   but match case-insensitively to be lenient)
                // - Optional suffix: `-<single digit>`
                // Reference:
                // - https://docs.databricks.com/aws/en/dev-tools/auth/pat
                // - https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns
                const pattern = /(?<!\p{L})dapi[A-Fa-f0-9]{32}(?:-[0-9])?(?![A-Fa-f0-9])/gu;
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
                        message: t("DATABRICKS_PERSONAL_ACCESS_TOKEN", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
