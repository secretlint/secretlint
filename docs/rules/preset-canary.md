# @secretlint/secretlint-rule-preset-canary

Canary rule preset of secretlint.
**Canary** means that is experimental.

This preset similar with [secretlint-rule-preset-recommend](./preset-recommend.md), but it does not base on [Semantic Versioning](https://semver.org/).

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

This preset is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
The package of this preset is not published from v14, but its id still works in the config.
