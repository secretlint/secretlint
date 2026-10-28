# @secretlint/secretlint-rule-postman

Detect [Postman API keys](https://learning.postman.com/docs/reference/postman-api/authentication).

## Install

```sh
npm install @secretlint/secretlint-rule-postman
```

## Usage

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-postman" }]
}
```

## MessageIDs

### POSTMAN_API_KEY

Detects the literal prefix `PMAK-`, followed by 24 hexadecimal characters, a hyphen,
and 34 hexadecimal characters. Hexadecimal characters are matched case-insensitively.
This is the API key format used by [Gitleaks' Postman detector](https://github.com/gitleaks/gitleaks/blob/master/cmd/generate/config/rules/postman.go);
Postman's authentication documentation does not specify the key format.
Collection access keys are outside this rule's scope.

## Options

- `allows: string[]` — exclusions using [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

## Running tests

Run `pnpm test` in this package after installing and building the workspace.

## License

MIT
