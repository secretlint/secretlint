# @secretlint/secretlint-rule-telegram

A rule for detecting [Telegram](https://telegram.org/) bot tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-telegram"
        }
    ]
}
```

## MessageIDs

### TELEGRAM_BOT_TOKEN

Telegram bot token is detected. The token is a bot ID of 5 to 16 digits, `:A`, and 34 characters of `[A-Za-z0-9_-]`.
A token in a Bot API URL (`https://api.telegram.org/bot<token>/...` or `https://api.telegram.org/file/bot<token>/...`) is detected too, and the report covers only the token.

The token has no fixed prefix, so a letter, a digit, or `_` just before or after the token prevents a match.

**NG** examples:

```
123456789:ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Telegram Bot API: Authorizing your bot](https://core.telegram.org/bots/api#authorizing-your-bot)
