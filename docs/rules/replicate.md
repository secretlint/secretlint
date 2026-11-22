# @secretlint/secretlint-rule-replicate

A rule for detecting [Replicate](https://replicate.com/) API tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-replicate"
        }
    ]
}
```

## MessageIDs

### REPLICATE_API_TOKEN

Replicate API token is detected. The token is `r8_` followed by 37 characters of `[A-Za-z0-9_-]`.

**NG** examples:

```
r8_Aa0_-Aa0_-Aa0_-Aa0_-Aa0_-Aa0_-Aa0_-Z9
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Replicate: API tokens](https://replicate.com/docs/topics/security/api-tokens)
