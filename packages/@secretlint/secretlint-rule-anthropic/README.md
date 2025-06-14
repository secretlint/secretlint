# @secretlint/secretlint-rule-anthropic

A rule for detecting Anthropic Claude API keys in your code.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-anthropic

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-anthropic"
        }
    ]
}
```

## MessageIDs

### ANTHROPIC_API_KEY

Anthropic Claude API key is detected.

**NG** examples:

```
sk-ant-api03-R2D2C3P0BEEP_BOOP_BUZZ_WHIRR_CLICK_SPIN_TURN_JUMP_SKIP_HOP_DANCE_SING_PLAY_WORK_LEARN_GROW_LOVE_LIVEigAA
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
