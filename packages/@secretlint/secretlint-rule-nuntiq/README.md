# @secretlint/secretlint-rule-nuntiq

[Nuntiq](https://nuntiq.com/) rule for secretlint.

Detects Nuntiq credentials:

- `nuntiq_ck_` — Customer API keys
- `nuntiq_pk_` — Partner API keys
- `nuntiq_rs_` — Key rotation secrets

Format:

    nuntiq_<ck|pk|rs>_<live|test|dev>_<8 hex key id>_<43 base64url random><6 base62 checksum>

The checksum is CRC32 (IEEE) of the 43 random characters, written as 6 base62 digits (`0-9A-Za-z`, most significant first). A match with a wrong checksum is not reported.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-nuntiq

## Usage

Add the rule to your `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-nuntiq"
        }
    ]
}
```

## MessageIDs

### NUNTIQ_CUSTOMER_API_KEY

> found Nuntiq customer API key: ${props.KEY}

### NUNTIQ_PARTNER_API_KEY

> found Nuntiq partner API key: ${props.KEY}

### NUNTIQ_ROTATION_SECRET

> found Nuntiq key rotation secret: ${props.KEY}

A leaked Nuntiq key gives access to a tenant's invoice, supplier and payment data through the Nuntiq APIs. A rotation secret can be used to rotate a partner API key.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

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

MIT © Nuntiq
