# @secretlint/secretlint-rule-pattern

A secretlint rule that checks for RegEx patterns

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-pattern

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "patterns": [
          {
            "name": "password=",
            "pattern": "password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?\/~`_+-=|]{1,256})\\b.*"
          }
        ]
      }
    }
  ]
}

```

## MessageIDs

### Pattern
> found matching {{pattern.name}}: {{CREDENTIAL}}

Disallow to use specified RegEx patterns from SecretLint config.

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

- [github/PseudoCoding](https://github.com/PseudoCoding)

## License

MIT © azu
