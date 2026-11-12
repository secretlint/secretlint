# @secretlint/secretlint-rule-discord

Detect Discord bot tokens with Secretlint.

## Install

```sh
npm install @secretlint/secretlint-rule-discord
```

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-discord"
        }
    ]
}
```

## MessageIDs

### DISCORD_BOT_TOKEN

> found discord bot token: ${props.ID}

Recognizes three-part bot tokens containing a Base64URL-encoded decimal ID, a Base64URL-encoded four-byte timestamp, and a 27–128 character URL-safe signature.
The ID must contain 17–20 digits and fit in an unsigned 64-bit integer. Both encoded fields must use canonical Base64URL encoding.

The structure follows the [maintainer's detection proposal](https://github.com/secretlint/secretlint/issues/1010#issuecomment-2803465503); the 27-character legacy signature is also recognized by [TruffleHog's Discord bot detector](https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/discordbottoken/discordbottoken.go).

Detection runs locally. It does not verify the signature or contact Discord to check whether a token is active. Webhook URLs and MFA tokens are outside this rule's current scope.

## Options

- `allows: string[]`: Exclude matches using literal strings or [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string). Defaults to `[]`.

## Running tests

```sh
pnpm --filter @secretlint/secretlint-rule-discord test
```

## Changelog

See the [releases](https://github.com/secretlint/secretlint/releases).

## License

MIT © awais-ur-rehman
