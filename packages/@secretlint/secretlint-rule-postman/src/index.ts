import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    POSTMAN_API_KEY: {
        en: (props: { ID: string }) => `found Postman API key: ${props.ID}`,
        ja: (props: { ID: string }) => `Postman API key: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-postman",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-postman/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options?.allows ?? [],
        };
        return {
            file(source: SecretLintSourceCode) {
                // PMAK- + 24 hexadecimal characters + '-' + 34 hexadecimal characters.
                // Postman documents authentication but not the key format; use Gitleaks' detector:
                // https://github.com/gitleaks/gitleaks/blob/master/cmd/generate/config/rules/postman.go
                const pattern = /(?<!\p{L})PMAK-[A-Fa-f0-9]{24}-[A-Fa-f0-9]{34}(?![A-Fa-f0-9])/gu;
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
                        message: t("POSTMAN_API_KEY", {
                            ID: matchString,
                        }),
                        range,
                    });
                }
            },
        };
    },
};
