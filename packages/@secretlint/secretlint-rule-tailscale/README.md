# @secretlint/secretlint-rule-tailscale

[Tailscale](https://tailscale.com/) rule for secretlint.

Detects Tailscale keys with the documented `tskey-` prefix:

- `tskey-api-` — API access tokens
- `tskey-auth-` — Pre-authentication keys
- `tskey-client-` — OAuth client keys
- `tskey-scim-` — SCIM keys
- `tskey-webhook-` — Webhook keys

Reference: https://tailscale.com/docs/reference/key-prefixes

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-tailscale

## Usage

Add the rule to your `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-tailscale"
        }
    ]
}
```

## MessageIDs

### TAILSCALE_KEY

> found Tailscale key: ${props.KEY}

A leaked Tailscale key can grant access to manage devices, ACLs, and network configuration.

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

    pnpm test

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
