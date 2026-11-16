# @secretlint/secretlint-rule-slack

A secretlint rule for slack.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md).

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

This rule reports a string that starts with `xoxb-`, `xoxp-`, `xapp-`, `xoxa-`, `xoxo-`, or `xoxr-` and has the shape of a Slack token.
A Slack token is divided into sections separated by `-`, and the final section is the secret.
This rule reports the string only when the sections before the secret include a section of two or more digits (an ID such as a team ID) and the secret has six or more characters.
For example, it reports `xoxp-111-222-333-d6bc76`, but it does not report a word such as `xapp-le-kernel`.

- [Token types | Slack](https://docs.slack.dev/authentication/tokens/)

### IncomingWebhook
> found Slack Incoming Webhook: {{URL}}

Disallow to write slack's Incoming Webhook URL in plain text.
You should encrypt it before using or inject via environment variables

> Keep it secret, keep it safe. Your webhook URL contains a secret. Don't share it online, including via public version control repositories. Slack actively searches out and revokes leaked secrets.
> -- https://api.slack.com/messaging/webhooks

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
