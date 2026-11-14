# @secretlint/secretlint-rule-preset-canary

Canary rule preset of secretlint.
**Canary** means that is experimental.

This preset similar with [secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend), but it does not base on [Semantic Versioning](https://semver.org/).

In other words, This rule preset always be experimental release.
It may introduce breaking change in patch release.

## Versioning Policy

- Patch release
    - BREAKING CHANGE
- Minor release
    - BREAKING CHANGE
- Major release
    - BREAKING CHANGE

This preset is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage


Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-canary"
        }
    ]
}
```

## Options

```json5
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-canary",
            // You can override preset default options for each rule
            "rules": [
                {
                     "id": "@secretlint/secretlint-rule-aws",
                     "options": {
                          "allows": ["allowed token"]
                     }
                }
            ]
        }
    ]
}
```

## Notes

The rules of this preset are built into `@secretlint/core`, and this package re-exports the preset of `@secretlint/core`.
secretlint resolves the id of this preset from `@secretlint/core`, so the config works without installing this package.
