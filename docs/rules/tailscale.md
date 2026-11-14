# @secretlint/secretlint-rule-tailscale

[Tailscale](https://tailscale.com/) rule for secretlint.

Detects Tailscale keys with the documented `tskey-` prefix:

- `tskey-api-` — API access tokens
- `tskey-auth-` — Pre-authentication keys
- `tskey-client-` — OAuth client keys
- `tskey-scim-` — SCIM keys
- `tskey-webhook-` — Webhook keys

Reference: https://tailscale.com/docs/reference/key-prefixes

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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

### TAILSCALE_API_KEY

> found Tailscale API access token: ${props.KEY}

### TAILSCALE_AUTH_KEY

> found Tailscale pre-authentication key: ${props.KEY}

### TAILSCALE_CLIENT_KEY

> found Tailscale OAuth client key: ${props.KEY}

### TAILSCALE_SCIM_KEY

> found Tailscale SCIM key: ${props.KEY}

### TAILSCALE_WEBHOOK_KEY

> found Tailscale webhook key: ${props.KEY}

### TAILSCALE_KEY

> found Tailscale key: ${props.KEY}

Fallback message used when the key type does not match a known prefix.

A leaked Tailscale key can grant access to manage devices, ACLs, and network configuration.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
