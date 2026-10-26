# @secretlint/secretlint-rule-replicate

Detect [Replicate](https://replicate.com/docs/reference/http#authentication) API tokens with Secretlint.

## Install

```sh
npm install @secretlint/secretlint-rule-replicate
```

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-replicate"
        }
    ]
}
```

## MessageIDs

### REPLICATE_API_TOKEN

> found replicate api token: ${props.ID}

Detects `r8_` followed by exactly 37 alphanumeric, hyphen, or underscore characters. The token must be separated from surrounding identifiers.

The format follows [the Replicate rule request](https://github.com/secretlint/secretlint/issues/1571) and [TruffleHog's Replicate detector](https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/replicate/replicate.go). Detection runs locally and does not check whether a token is active.

## Options

- `allows: string[]`: Exclude matches using literal strings or [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string). Defaults to `[]`.

## Running tests

```sh
pnpm --filter @secretlint/secretlint-rule-replicate test
```

## Changelog

See the [releases](https://github.com/secretlint/secretlint/releases).

## License

MIT © awais-ur-rehman
