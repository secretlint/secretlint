# @secretlint/secretlint-rule-hashicorp-vault

A rule for detecting [HashiCorp Vault](https://developer.hashicorp.com/vault) tokens in your code.

This rule detects the three main Vault token formats introduced in Vault 1.10+:

- Service tokens (`hvs.` prefix)
- Batch tokens (`hvb.` prefix)
- Recovery tokens (`hvr.` prefix)

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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

## Options

- `allows`: `string[]`
    - Allow list of [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).
    - Tokens matching any pattern in the allow list are not reported.

Example configuration:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-hashicorp-vault",
            "options": {
                "allows": [
                    "/hvs\\.EXAMPLE_FAKE[A-Za-z0-9_-]+/"
                ]
            }
        }
    ]
}
```

## References

- [HashiCorp Vault: Tokens](https://developer.hashicorp.com/vault/docs/concepts/tokens)
- [GitHub: Secret scanning partner program](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns)
