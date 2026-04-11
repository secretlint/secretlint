# @secretlint/secretlint-rule-databricks

A rule for detecting [Databricks personal access tokens](https://docs.databricks.com/aws/en/dev-tools/auth/pat) in your code.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-databricks

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-databricks"
        }
    ]
}
```

## MessageIDs

### DATABRICKS_PERSONAL_ACCESS_TOKEN

Databricks personal access token is detected.

Databricks personal access tokens start with the literal prefix `dapi`, followed by a 32-character hexadecimal string, with an optional `-<digit>` suffix. The rule matches hex characters case-insensitively.

**NG** examples:

```
DATABRICKS_TOKEN=dapi1234567890ABCDEF1234567890ABCDEF
token: "dapi0123456789ABCDEF0123456789ABCDEF-3"
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

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

## License

MIT © azu
