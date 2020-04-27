# @secretlint/secretlint-rule-sendgrid

A secretlint rule for sendgrid.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-sendgrid

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-sendgrid"
        }
    ]
}
```

## MessageIDs

### SENDGRID_KEY
> found sendgrid api key: {{KEY}}

Disallow to write sendgrid api key.

- [Manage SendGrid API Keys | SendGrid Documentation](https://sendgrid.com/docs/ui/account-and-settings/api-keys/)

## Options

- `allows: string[]`

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
