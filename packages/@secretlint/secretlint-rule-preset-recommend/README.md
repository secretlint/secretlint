# @secretlint/secretlint-rule-preset-recommend

Recommended rule preset of secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-preset-recommend

## Usage


Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-recommend"
        }
    ]
}
```

## Options

```json5
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-recommend",
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

## Messages

- [@secretlint/secretlint-rule-npm](https://www.npmjs.com/package/@secretlint/secretlint-rule-npm)
- [@secretlint/secretlint-rule-aws](https://www.npmjs.com/package/@secretlint/secretlint-rule-aws)
- [@secretlint/secretlint-rule-privatekey](https://www.npmjs.com/package/@secretlint/secretlint-rule-privatekey)
- [@secretlint/secretlint-rule-basicauth](https://www.npmjs.com/package/@secretlint/secretlint-rule-basicauth)
- [@secretlint/secretlint-rule-slack](https://www.npmjs.com/package/@secretlint/secretlint-rule-slack)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
