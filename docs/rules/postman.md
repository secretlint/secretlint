# @secretlint/secretlint-rule-postman

A rule for detecting [Postman](https://www.postman.com/) API keys in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-postman"
        }
    ]
}
```

## MessageIDs

### POSTMAN_API_KEY

Postman API key is detected. The key is `PMAK-`, 24 hexadecimal characters, `-`, and 34 hexadecimal characters.

**NG** examples:

```
PMAK-000000000000000000000000-0000000000000000000000000000000000
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Postman API authentication](https://learning.postman.com/docs/reference/postman-api/authentication)
- [Gitleaks: Postman rule](https://github.com/gitleaks/gitleaks/blob/master/cmd/generate/config/rules/postman.go)
