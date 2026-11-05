# @secretlint/secretlint-rule-supabase

Detect [Supabase](https://supabase.com/) personal access tokens in text files.

## Install

```sh
npm install --save-dev secretlint @secretlint/secretlint-rule-supabase
```

## Usage

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-supabase"
        }
    ]
}
```

## MessageIDs

### SUPABASE_PERSONAL_ACCESS_TOKEN

> found Supabase personal access token: ${props.TOKEN}

Detects these prefixes followed by exactly 40 lowercase hexadecimal characters:

- `sbp_`
- `sbp_oauth_`
- `sbp_v0_`

These formats match Supabase's [CLI access token validator](https://github.com/supabase/cli/blob/main/apps/cli/src/auth/access-token.ts).
Matches embedded in words or followed by more identifier characters are ignored.
This rule checks the format locally and does not contact Supabase or verify
whether a token is active. Publishable keys, secret API keys, and legacy JWT
API keys are outside its scope. Secretlint masks token values in diagnostic
messages by default.

## Options

- `allows: string[]`: exclude matching tokens using literal strings or
  [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-supabase",
            "options": {
                "allows": ["/^sbp_(?:oauth_|v0_)?0{40}$/"]
            }
        }
    ]
}
```

## Changelog

See the [Releases page](https://github.com/secretlint/secretlint/releases).

## License

MIT © awais-ur-rehman
