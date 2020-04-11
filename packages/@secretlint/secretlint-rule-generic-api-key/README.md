# @secretlint/secretlint-rule-generic-api-key

A secretlint for to detect generic API keys such as the ones used by SendGrid.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-generic-api-key

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-generic-api-key"
        }
    ]
}
```


## MessageIDs

### genericApiKey
> found generic api key: {{KEY}}

API keys such as the ones used by SendGrid.
It should be treated as credentials.

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

- [github/mtsalenc](https://github.com/mtsalenc)
- [twitter/mtsalenc](https://twitter.com/mtsalenc)

## License

MIT © mtsalenc
