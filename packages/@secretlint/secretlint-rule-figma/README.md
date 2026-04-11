# @secretlint/secretlint-rule-figma

[Figma](https://www.figma.com/) rule for secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-figma

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

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

No Test to avoid Dependency cycles.

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
