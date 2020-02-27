# @secretlint/secretlint-rule-basicauth

A secretlint rule that check Basic Authentication.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-basicauth

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-basicauth"
        }
    ]
}
```

## Messages

### BasicAuth
> found basic auth credential: {{CREDENTIAL}}

Disallow to use `<protocol>://<user>:<pass>@<host>` in plain text.

Basic Authentication includes a credential like `user:pass@host`.

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
