import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    RUBYGEMS_API_TOKEN: {
        en: (props: { TOKEN: string }) => `found RubyGems API token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `RubyGems API トークン: ${props.TOKEN} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-rubygems",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-rubygems/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options.allows || [];
        return {
            file(source: SecretLintSourceCode) {
                // https://guides.rubygems.org/api-key-scopes/
                // RubyGems tokens contain exactly 48 lowercase hexadecimal characters.
                const pattern = /(?<!\p{L})rubygems_[a-f0-9]{48}(?![\p{L}\p{N}])/gu;
                for (const match of source.content.matchAll(pattern)) {
                    const token = match[0];
                    if (matchPatterns(token, allows).length > 0) {
                        continue;
                    }
                    const index = match.index;
                    context.report({
                        message: t("RUBYGEMS_API_TOKEN", { TOKEN: token }),
                        range: [index, index + token.length],
                    });
                }
            },
        };
    },
};
