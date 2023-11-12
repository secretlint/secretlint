# @secretlint/secretlint-rule-openai

A secretline rule for OpenAI.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-openai

## MessageIDs

### OPENAI_TOKEN

> found OpenAI API Token: {{KEY}}

OpenAI API tokens should be private.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Examples

```json5

{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-openai",
            // Ignore error related to IDs
            "allowMessageIds": ["OPENAI_TOKEN"],
            "options": {
                // allow list
                "allows": ["/IT_IS_PUBLIC/"]
            }
        }
    ]
}
```

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

- [github/siketyan](https://github.com/siketyan)
- [twitter/s6n_jp](https://twitter.com/s6n_jp)

## License

MIT © Natsuki Ikeguchi
