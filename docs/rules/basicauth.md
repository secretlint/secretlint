# @secretlint/secretlint-rule-basicauth

A secretlint rule that check Basic Authentication.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-basicauth"
        }
    ]
}
```

## MessageIDs

### BasicAuth
> found basic auth credential: {{CREDENTIAL}}

Disallow to use `<protocol>://<user>:<pass>@<host>` in plain text.

Basic Authentication includes a credential like `user:pass@host`.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
