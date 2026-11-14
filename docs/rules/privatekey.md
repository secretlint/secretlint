# @secretlint/secretlint-rule-privatekey

A secretlint rule for PrivateKey.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/privatekey"
        }
    ]
}
```

## MessageIDs

### PrivateKey
> found private key: {{KEY}}

Private Key should be private.

- https://en.wikipedia.org/wiki/Public-key_cryptography

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
