# @secretlint/secretlint-rule-stripe

A secretlint rule for detecting [Stripe](https://stripe.com/) API keys.

## Detected Key Types

| Key Type | Prefix | Format |
|---|---|---|
| Live Secret Key | `sk_live_` | `sk_live_` + 24–99 alphanumeric chars |
| Test Secret Key | `sk_test_` | `sk_test_` + 24–99 alphanumeric chars |
| Live Restricted Key | `rk_live_` | `rk_live_` + 24–99 alphanumeric chars |
| Test Restricted Key | `rk_test_` | `rk_test_` + 24–99 alphanumeric chars |

References:

- [Stripe API keys documentation](https://docs.stripe.com/keys)
- GitHub Push Protection: supported provider "Stripe"

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-stripe"
        }
    ]
}
```

## Options

```ts
export type Options = {
    /**
     * Define allow pattern written by RegExp-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};
```

## Messages

### STRIPE_SECRET_KEY_LIVE

Detected a Stripe Live Secret Key (`sk_live_` prefix).

### STRIPE_SECRET_KEY_TEST

Detected a Stripe Test Secret Key (`sk_test_` prefix).

### STRIPE_RESTRICTED_KEY_LIVE

Detected a Stripe Live Restricted Key (`rk_live_` prefix).

### STRIPE_RESTRICTED_KEY_TEST

Detected a Stripe Test Restricted Key (`rk_test_` prefix).
