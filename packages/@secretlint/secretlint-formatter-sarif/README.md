# @secretlint/secretlint-formatter-sarif

A secretlint formatter for SARIF format

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-formatter-sarif

## Usage

```
npm install @secretlint/secretlint-formatter-sarif --save-dev
secretlint --format @secretlint/secretlint-formatter-sarif "**/*"
# output as sarif format
```

The CLI passes its scanner version to the formatter as `secretlintVersion`.
When using `@secretlint/node` or calling the formatter directly, pass the scanner's
version in the options to include `runs[].tool.driver.version`. If no version is
provided, the report omits this optional field rather than reporting an incorrect
version. The formatter package version is not used as the scanner version.

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

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

MIT © azu
