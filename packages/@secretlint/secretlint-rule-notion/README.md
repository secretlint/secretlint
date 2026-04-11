# @secretlint/secretlint-rule-notion

A rule for detecting [Notion](https://www.notion.so/) integration tokens in your code.

This rule detects the new token format (`ntn_` prefix) introduced by Notion in September 2024.
The legacy `secret_` prefix is intentionally **not** detected because it is too generic and
prone to false positives.

> Notion warns that the token format may change in the future, so this rule may need to be
> updated when a new format is introduced.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-notion

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-notion"
        }
    ]
}
```

## MessageIDs

### NOTION_INTEGRATION_TOKEN

Notion integration token is detected.

**NG** examples:

```
NOTION_TOKEN=ntn_12345678901aBcDeFgHiJkLmNoPqRsT1234567890abcde
```

**OK** examples:

```
ntn_abc
secret_abc123
```

## Options

-   `allows: string[]`
    -   Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

-   [Notion API changelog](https://developers.notion.com/changelog)
-   [GitHub secret scanning patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns)
-   [Gitleaks rules](https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT © azu
