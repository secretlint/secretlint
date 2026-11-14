# @secretlint/secretlint-rule-sendgrid

A secretlint rule for sendgrid.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-sendgrid"
        }
    ]
}
```

## MessageIDs

### SENDGRID_KEY
> found sendgrid api key: {{KEY}}

Disallow to write sendgrid api key.

- [Manage SendGrid API Keys | SendGrid Documentation](https://sendgrid.com/docs/ui/account-and-settings/api-keys/)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
