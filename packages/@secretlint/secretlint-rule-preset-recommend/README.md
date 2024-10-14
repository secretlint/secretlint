# @secretlint/secretlint-rule-preset-recommend

Recommended rule preset for secretlint.

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

If you want to ignore `"AWSAccountID"` and `"AWSAccessKeyID"` of `"@secretlint/secretlint-rule-aws"`, you can configure following.

```json5
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend",
      "rules": [
        {
          "id": "@secretlint/secretlint-rule-aws",
          "allowMessageIds": ["AWSAccountID", "AWSAccessKeyID"]
        }
      ]
    }
  ]
}
```

## Rules

- [@secretlint/secretlint-rule-npm](https://www.npmjs.com/package/@secretlint/secretlint-rule-npm)
- [@secretlint/secretlint-rule-aws](https://www.npmjs.com/package/@secretlint/secretlint-rule-aws)
- [@secretlint/secretlint-rule-gcp](https://www.npmjs.com/package/@secretlint/secretlint-rule-gcp)
- [@secretlint/secretlint-rule-privatekey](https://www.npmjs.com/package/@secretlint/secretlint-rule-privatekey)
- [@secretlint/secretlint-rule-basicauth](https://www.npmjs.com/package/@secretlint/secretlint-rule-basicauth)
- [@secretlint/secretlint-rule-slack](https://www.npmjs.com/package/@secretlint/secretlint-rule-slack)
- [@secretlint/secretlint-rule-sendgrid](https://www.npmjs.com/package/@secretlint/secretlint-rule-sendgrid)
- [@secretlint/secretlint-rule-shopify](https://www.npmjs.com/package/@secretlint/secretlint-rule-shopify)
- [@secretlint/secretlint-rule-github](https://www.npmjs.com/package/@secretlint/secretlint-rule-github)
- [@secretlint/secretlint-rule-1password](https://www.npmjs.com/package/@secretlint/secretlint-rule-1password)
- [@secretlint/secretlint-rule-linear](https://www.npmjs.com/package/@secretlint/secretlint-rule-linear)
- [@secretlint/secretlint-rule-filter-comments](https://www.npmjs.com/package/@secretlint/secretlint-rule-filter-comments)
  - `secretlint-disable` directives. For more details, see <https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#ignoring-error-by-comments>

## Notes

This preset module is bundled by [Rollup](https://rollupjs.org).
It is performance reason. Bundled file will reduce loading cost.

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

Import rule tests and update snapshot:

    npm run import-test

:memo: It aims to test bundle version

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
