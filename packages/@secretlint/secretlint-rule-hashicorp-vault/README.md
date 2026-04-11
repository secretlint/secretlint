# @secretlint/secretlint-rule-hashicorp-vault

A rule for detecting [HashiCorp Vault](https://developer.hashicorp.com/vault) tokens in your code.

This rule detects the three main Vault token formats introduced in Vault 1.10+:

- Service tokens (`hvs.` prefix)
- Batch tokens (`hvb.` prefix)
- Recovery tokens (`hvr.` prefix)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-hashicorp-vault

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-hashicorp-vault"
        }
    ]
}
```

## MessageIDs

### HASHICORP_VAULT_SERVICE_TOKEN

HashiCorp Vault service token is detected.

Format: `hvs.` + 90–120 characters from `[A-Za-z0-9_-]`.

### HASHICORP_VAULT_BATCH_TOKEN

HashiCorp Vault batch token is detected.

Format: `hvb.` + 138–300 characters from `[A-Za-z0-9_-]`.

### HASHICORP_VAULT_RECOVERY_TOKEN

HashiCorp Vault recovery token is detected.

Format: `hvr.` + 90–120 characters from `[A-Za-z0-9_-]`.

## References

- [HashiCorp Vault: Tokens](https://developer.hashicorp.com/vault/docs/concepts/tokens)
- [GitHub: Secret scanning partner program](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns)

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

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
