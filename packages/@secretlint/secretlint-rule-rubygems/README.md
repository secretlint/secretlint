# @secretlint/secretlint-rule-rubygems

Detect [RubyGems API tokens](https://guides.rubygems.org/api-key-scopes/) in text files.
Tokens consist of `rubygems_` followed by exactly 48 lowercase hexadecimal characters.
Legacy unprefixed keys are not detected.

## Install

```sh
npm install @secretlint/secretlint-rule-rubygems
```

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-rubygems" }]
}
```

## MessageIDs

### RUBYGEMS_API_TOKEN

Found a RubyGems API token.

## Options

- `allows: string[]`: allow token patterns using [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

## Running tests

```sh
pnpm test --filter="@secretlint/secretlint-rule-rubygems"
```

All test tokens are synthetic and are not used to contact RubyGems.

## License

MIT © owenshen0907
