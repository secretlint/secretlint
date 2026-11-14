# @secretlint/secretlint-rule-linear

[Linear](https://linear.app) rule for secretlint.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## MessageIDs

### LINEAR_API_TOKEN
> found linear api token: ${props.ID}

Linear API tokens should be private.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
