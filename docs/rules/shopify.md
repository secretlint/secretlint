# @secretlint/secretlint-rule-shopify

A secretlint rule for Shopify.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-shopify"
        }
    ]
}
```

## MessageIDs

### SHOPIFY_KEY
> found Shopify api key: {{KEY}}

Disallow to write Shopify api key.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
