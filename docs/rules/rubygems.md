# @secretlint/secretlint-rule-rubygems

A rule for detecting [RubyGems](https://rubygems.org/) API keys in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-rubygems"
        }
    ]
}
```

## MessageIDs

### RUBYGEMS_API_TOKEN

RubyGems API key is detected. The key is `rubygems_` followed by 48 lowercase hexadecimal characters.

**NG** examples:

```
rubygems_000000000000000000000000000000000000000000000000
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [RubyGems Guides: API key scopes](https://guides.rubygems.org/api-key-scopes/)
