import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    PYPI_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found PyPI API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `PyPI APIトークン: ${props.TOKEN} がみつかりました`,
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
        id: "@secretlint/secretlint-rule-pypi",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/pypi.md",
        },
    },
    patterns: [
        {
            // PyPI API tokens are "pypi-" + a serialized macaroon (URL-safe Base64).
            // "AgEIcHlwaS5vcmc" is the encoded header with the location "pypi.org", so every token of pypi.org starts with it.
            // A token scoped to many projects has a caveat for each project, and Warehouse accepts tokens up to 16 KiB
            // (_MAX_TOKEN_BYTES), which is about 21,846 characters in Base64.
            // The length of the body is bounded, so that a match attempt reads a bounded part of the line.
            // https://github.com/pypi/warehouse/blob/main/warehouse/macaroons/services.py
            pattern: /(?<![\p{L}\p{N}_])pypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,22000}(?![\p{L}\p{N}_-])/gu,
            keywords: ["pypi-AgEIcHlwaS5vcmc"],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("PYPI_API_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
