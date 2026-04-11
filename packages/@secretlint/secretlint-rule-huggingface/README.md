# @secretlint/secretlint-rule-huggingface

A rule for detecting [Hugging Face](https://huggingface.co/) User Access Tokens in your code.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-huggingface

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-huggingface"
        }
    ]
}
```

## MessageIDs

### HUGGINGFACE_USER_ACCESS_TOKEN

Hugging Face User Access Token is detected.

A Hugging Face User Access Token starts with the `hf_` prefix followed by exactly 34 alphabetic characters
(see [User Access Tokens](https://huggingface.co/docs/hub/security-tokens)).

**NG** examples:

```
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
