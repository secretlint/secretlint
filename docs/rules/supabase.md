# @secretlint/secretlint-rule-supabase

A rule for detecting [Supabase](https://supabase.com/) personal access tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

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

Supabase personal access token is detected. The token is `sbp_`, `sbp_oauth_`, or `sbp_v0_` followed by 40 lowercase hexadecimal characters.

**NG** examples:

```
sbp_oauth_0000000000000000000000000000000000000000
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Supabase CLI: access token validator](https://github.com/supabase/cli/blob/main/apps/cli/src/auth/access-token.ts)
