# @secretlint/secretlint-rule-sentry

A rule for detecting [Sentry](https://sentry.io/) auth tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-sentry"
        }
    ]
}
```

## MessageIDs

### SENTRY_ORGANIZATION_TOKEN

Sentry organization auth token is detected. The token is `sntrys_`, a Base64 JSON payload that has `iat`, `_`, and 43 Base64 characters. A string whose payload is not such JSON is not reported.

**NG** examples:

```
sntrys_eyJ0ZXN0IjoiZHVtbXkiLCJpYXQiOjB9_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

### SENTRY_PERSONAL_TOKEN

Sentry personal auth token is detected. The token is `sntryu_` followed by 64 lowercase hexadecimal characters.

**NG** examples:

```
sntryu_0000000000000000000000000000000000000000000000000000000000000000
```

### SENTRY_USER_APP_TOKEN

Sentry user app auth token is detected. The token is `sntrya_` followed by 64 lowercase hexadecimal characters.

**NG** examples:

```
sntrya_0000000000000000000000000000000000000000000000000000000000000000
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Sentry: organization auth token generator](https://github.com/getsentry/sentry/blob/master/src/sentry/utils/security/orgauthtoken_token.py)
