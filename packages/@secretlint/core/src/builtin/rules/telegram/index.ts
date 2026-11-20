import type { SecretLintRuleCreator } from "@secretlint/types";
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
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/HEAD/docs/rules/telegram.md",
        },
    },
    patterns: [
        {
            // Telegram API URLs place "bot" immediately before the token.
            pattern:
                /(?:(?<![\p{L}\p{N}_])|(?<=https:\/\/api\.telegram\.org\/bot))[0-9]{5,16}:A[A-Za-z0-9_-]{34}(?![\p{L}\p{N}_-])/gu,
            keywords: [{ keyword: ":A", after: "[A-Za-z0-9_-]{34,}" }],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("TELEGRAM_BOT_TOKEN", { ID: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
