# @secretlint/secretlint-rule-1password

An example rule for secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-1password

## MessageIDs

### OPS_TOKEN
> found 1Password Service Account token: {token}

1Password Service Account token was found.
This token is used for 1Password CLI.
It should be treated as a secret.

- [1Password Service Account security | 1Password Developer](https://developer.1password.com/docs/service-accounts/security/)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

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
