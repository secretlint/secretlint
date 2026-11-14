# @secretlint/secretlint-rule-slack

A secretlint rule for slack.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-slack"
        }
    ]
}
```

## MessageIDs

### SLACK_TOKEN
> found slack token: {{TOKEN}}

Disallow to write slack token as plain text.
You should encrypt it before using.

- [Types of tokens | Slack](https://api.slack.com/docs/token-types)

### IncomingWebhook
> found Slack Incoming Webhook: {{URL}}

Disallow to write slack's Incoming Webhook URL in plain text.
You should encrypt it before using or inject via environment variables

> Keep it secret, keep it safe. Your webhook URL contains a secret. Don't share it online, including via public version control repositories. Slack actively searches out and revokes leaked secrets.
> -- https://api.slack.com/messaging/webhooks

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
