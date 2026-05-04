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

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-stripe

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

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

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
