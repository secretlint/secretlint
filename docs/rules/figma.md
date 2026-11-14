# @secretlint/secretlint-rule-figma

[Figma](https://www.figma.com/) rule for secretlint.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## MessageIDs

### FIGMA_PERSONAL_ACCESS_TOKEN

> found Figma Personal Access Token: ${props.ID}

Figma Personal Access Tokens (`figd_`) should be private.

The token format is a `figd_` prefix followed by 40 to 200 characters of
`[A-Za-z0-9_-]`. This prefix matches the pattern supported by
[GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns).

Legacy UUID-format Figma tokens (without a prefix) are intentionally not
detected because their pattern is too generic and would produce false
positives.

## Options

-   `allows: string[]`
    -   Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
