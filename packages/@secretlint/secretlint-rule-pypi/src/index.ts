import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    PYPI_API_TOKEN: {
        en: (props: { ID: string }) => `found PyPI API token: ${props.ID}`,
        ja: (props: { ID: string }) => `PyPI API token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pypi",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-pypi/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options?.allows ?? [];
        return {
            file(source: SecretLintSourceCode) {
                // PyPI uses a serialized V2 macaroon with location pypi.org.
                // https://github.com/pypi/warehouse/blob/main/warehouse/macaroons/services.py
                // Bound the body and reject partial matches of overlong tokens.
                const pattern = /(?<!\p{L})pypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,1000}(?![\p{L}0-9_-])/gu;
                for (const match of source.content.matchAll(pattern)) {
                    const index = match.index ?? 0;
                    const matchString = match[0];
                    if (matchPatterns(matchString, allows).length > 0) {
                        continue;
                    }
                    context.report({
                        message: t("PYPI_API_TOKEN", { ID: matchString }),
                        range: [index, index + matchString.length],
                    });
                }
            },
        };
    },
};
