import {
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleMessageTranslate,
    SecretLintSourceCode
} from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    SHOPIFY_KEY: {
        en: (props: { KEY: string }) => `found Shopify api key: ${props.KEY}`,
        ja: (props: { KEY: string }) => `Shopify APIキーが見つかりました： ${props.KEY}`
    }
};

export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};

function reportIfFoundKey({
    source,
    options,
    context,
    t
}: {
    source: SecretLintSourceCode;
    options: Required<Options>;
    context: SecretLintRuleContext;
    t: SecretLintRuleMessageTranslate<typeof messages>;
}) {
    /**
     * Source: https://shopify.dev/changelog/app-secret-key-length-has-increased
     * for app secret keys
     * shpss_[a-zA-Z0-9]{32,64}
     * e.g.) shpss_QlRSJy5AXX1cILNjVatTsEIhFxuPF5ex
     *
     * Source: https://shopify.dev/changelog/length-of-the-shopify-access-token-is-increasing
     * for public apps
     * shpat_[a-zA-Z0-9]{32,64}
     * e.g.) shpat_r8TRc9ZXAvcVvcrmtr7qoVw69WeeY1ex
     *
     * for custom apps
     * shpca_[a-zA-Z0-9]{32,64}
     * e.g.) shpca_7jqbg9cupMkZRxJKXWz3v8BvS8QBa7hMdJfAex
     *
     * for legacy private apps
     * shppa_[a-zA-Z0-9]{32,64}
     * e.g.) shppa_7jqbg9cupMkZRxJKXWz3v8BvS8QBa7hMdJfAex
     */
    const SHOPIFY_KEY_PATTERN = /(shppa|shpca|shpat|shpss)_[a-zA-Z0-9]{32,64}/g;
    const results = source.content.matchAll(SHOPIFY_KEY_PATTERN);
    for (const result of results) {
        const index = result.index || 0;
        const match = result[0] || "";
        const range = [index, index + match.length] as const;
        const allowedResults = matchPatterns(match, options.allows);
        if (allowedResults.length > 0) {
            continue;
        }
        context.report({
            message: t("SHOPIFY_KEY", {
                KEY: match
            }),
            range
        });
    }
}

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-shopify",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-shopify/README.md"
        }
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || []
        };
        return {
            file(source: SecretLintSourceCode) {
                reportIfFoundKey({ source, options: normalizedOptions, context, t });
            }
        };
    }
};
