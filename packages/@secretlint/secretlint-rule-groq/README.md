# @secretlint/secretlint-rule-groq

A rule for detecting [Groq](https://groq.com/) API keys in your code.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-groq

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-groq"
        }
    ]
}
```

## MessageIDs

### GROQ_API_KEY

Groq API key is detected.

Groq API keys use the `gsk_` prefix followed by exactly 52 alphanumeric characters.

**NG** examples:

```
gsk_aBcDeFgHiJkLmNoPqRsT1234567890abcdefghijklmnopqrstuv
```

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
