# @secretlint/secretlint-rule-digitalocean

Detect DigitalOcean personal access, OAuth access, and OAuth refresh tokens.

## Install

```sh
npm install @secretlint/secretlint-rule-digitalocean
```

## Usage

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-digitalocean" }]
}
```

The rule is also included in `@secretlint/secretlint-rule-preset-canary`.

## MessageIDs

### DIGITALOCEAN_PAT

A personal access token with prefix `dop_v1_` was detected.

### DIGITALOCEAN_OAUTH_TOKEN

An OAuth access token with prefix `doo_v1_` was detected.

### DIGITALOCEAN_OAUTH_REFRESH_TOKEN

An OAuth refresh token with prefix `dor_v1_` was detected.

All three formats have a body of exactly 64 lowercase hexadecimal characters.
The rule rejects truncated or overlong bodies and tokens embedded in words.
It detects the token format without sending requests to DigitalOcean or checking
whether a token is active. Legacy unprefixed tokens and Spaces keys are outside
this rule's scope.

References: [API token prefixes](https://docs.digitalocean.com/reference/api/reference/account/),
[personal access tokens](https://docs.digitalocean.com/reference/api/create-personal-access-token/),
[OAuth API](https://docs.digitalocean.com/reference/api/oauth/).

## Options

- `allows: string[]`: ignore matching values using
  [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

## Running tests

```sh
pnpm test
```

All token samples in the tests are synthetic and were never issued by DigitalOcean.

## License

MIT © azu
