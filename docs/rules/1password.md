# @secretlint/secretlint-rule-1password

An example rule for secretlint.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## MessageIDs

### OPS_TOKEN
> found 1Password Service Account token: {token}

1Password Service Account token was found.
This token is used for 1Password CLI.
It should be treated as a secret.

- [1Password Service Account security | 1Password Developer](https://developer.1password.com/docs/service-accounts/security/)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
