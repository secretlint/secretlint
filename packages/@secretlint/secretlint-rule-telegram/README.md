# @secretlint/secretlint-rule-telegram

Detects Telegram bot tokens in text, including Telegram Bot API URLs.

## Install

    npm install @secretlint/secretlint-rule-telegram

Add the rule to your secretlint configuration:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-telegram"
        }
    ]
}
```

The rule is also included in the experimental canary preset.

## MessageIDs

### TELEGRAM_BOT_TOKEN

> found Telegram bot token: ${props.ID}

Detects the format requested in [#1532](https://github.com/secretlint/secretlint/issues/1532):
a 5–16 digit bot ID, followed by `:A` and 34 ASCII letters, digits, underscores or hyphens.
Surrounding letters, digits and underscores prevent partial matches; a trailing hyphen
also prevents a match. The `https://api.telegram.org/bot` URL prefix is supported.

See the [Telegram Bot API authentication documentation](https://core.telegram.org/bots/api#authorizing-your-bot).
Detection is local and format-based; it does not verify whether a token is active.

## Options

- `allows: string[]`
    - Allows a list of literal strings or [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).
    - Patterns are matched against the token itself, excluding any URL prefix.

## Running tests

From the repository root:

    pnpm --filter @secretlint/secretlint-rule-telegram test

The fixtures use synthetic values and make no requests to Telegram.

## Contributing

See the repository's [contribution guide](../../../CONTRIBUTING.md).

## License

MIT © Abhinav Rastogi
