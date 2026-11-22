# @secretlint/secretlint-rule-digitalocean

A rule for detecting [DigitalOcean](https://www.digitalocean.com/) API tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-digitalocean"
        }
    ]
}
```

## MessageIDs

### DIGITALOCEAN_PAT

DigitalOcean personal access token is detected. The token is `dop_v1_` followed by 64 lowercase hexadecimal characters.

**NG** examples:

```
dop_v1_0000000000000000000000000000000000000000000000000000000000000000
```

### DIGITALOCEAN_OAUTH_TOKEN

DigitalOcean OAuth token is detected. The token is `doo_v1_` followed by 64 lowercase hexadecimal characters.

**NG** examples:

```
doo_v1_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

### DIGITALOCEAN_OAUTH_REFRESH_TOKEN

DigitalOcean OAuth refresh token is detected. The token is `dor_v1_` followed by 64 lowercase hexadecimal characters.

**NG** examples:

```
dor_v1_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [DigitalOcean API reference: token prefixes](https://docs.digitalocean.com/reference/api/reference/account/)
