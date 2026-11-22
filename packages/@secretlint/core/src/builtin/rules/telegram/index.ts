import type { SecretLintRuleCreator } from "@secretlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";

export const messages = {
    TELEGRAM_BOT_TOKEN: {
        en: (props: { TOKEN: string }) => `found Telegram bot token: ${props.TOKEN}`,
        ja: (props: { TOKEN: string }) => `Telegram ボットトークン: ${props.TOKEN} がみつかりました`,
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
            // Telegram bot tokens: a bot ID of 5 to 16 digits, ":A", and 34 characters of [A-Za-z0-9_-].
            // https://core.telegram.org/bots/api#authorizing-your-bot
            // The Bot API URLs put "bot" just before the token: https://api.telegram.org/bot<token>/getMe
            // and https://api.telegram.org/file/bot<token>/<file_path> (getFile)
            // The token has no fixed prefix, so the keyword ":A" has a guard:
            // the keyword counts only when 34 or more characters of the set follow it.
            pattern:
                /(?:(?<![\p{L}\p{N}_])|(?<=https:\/\/api\.telegram\.org\/(?:file\/)?bot))[0-9]{5,16}:A[A-Za-z0-9_-]{34}(?![\p{L}\p{N}_-])/gu,
            keywords: [{ keyword: ":A", after: "[A-Za-z0-9_-]{34,}" }],
            scope: "line",
            report(match, context) {
                if (matchPatterns(match.text, context.options.allows ?? []).length > 0) {
                    return;
                }
                const t = context.createTranslator(messages);
                context.report({
                    message: t("TELEGRAM_BOT_TOKEN", { TOKEN: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
