import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    TELEGRAM_BOT_TOKEN: {
        en: (props: { ID: string }) => `found Telegram bot token: ${props.ID}`,
        ja: (props: { ID: string }) => `Telegram bot token: ${props.ID} がみつかりました`,
    },
};

export type Options = {
    allows?: string[];
};

export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-telegram",
        recommended: true,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-telegram/README.md",
        },
    },
    create(context, options) {
        const t = context.createTranslator(messages);
        const allows = options?.allows ?? [];
        return {
            file(source: SecretLintSourceCode) {
                // Telegram API URLs place "bot" immediately before the token.
                const pattern =
                    /(?:(?<![\p{L}\p{N}_])|(?<=https:\/\/api\.telegram\.org\/bot))[0-9]{5,16}:A[A-Za-z0-9_-]{34}(?![\p{L}\p{N}_-])/gu;
                for (const match of source.content.matchAll(pattern)) {
                    const matchString = match[0];
                    if (matchPatterns(matchString, allows).length > 0) {
                        continue;
                    }
                    const index = match.index;
                    context.report({
                        message: t("TELEGRAM_BOT_TOKEN", { ID: matchString }),
                        range: [index, index + matchString.length],
                    });
                }
            },
        };
    },
};
