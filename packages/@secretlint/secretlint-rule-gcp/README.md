# @secretlint/secretlint-rule-gcp

A secretlint rule for GCP.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-gcp

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-gcp"
        }
    ]
}
```

## MessageIDs

### PrivateKeyP12
> found GCP Service Account's private key(p12): {{FILE_NAME}}

This p12 file includes private key for GCP Service Account.

GCP Service Account's private key(PKCS12 format) is not encrypted data.
Because, the pass phase for this p12 file is `notasecret`.

- https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys#serviceaccountprivatekeytype

### PrivateKeyJSON
> found GCP Service Account's private key(json): {{FILE_NAME}}

This JSON file includes private key for GCP Service Account.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

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
