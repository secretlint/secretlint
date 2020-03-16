# @secretlint/secretlint-rule-preset-canary

Canary rule preset of secretlint.

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

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-preset-canary

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

This preset module is bundled by [Rollup](https://rollupjs.org).
It is performance reason. Bundled file will reduce loading cost.

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
