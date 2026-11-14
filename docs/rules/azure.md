# @secretlint/secretlint-rule-azure

A secretlint rule for Azure (i.e. Azure AD) secrets. This rule takes aim at two common credentials leaks:

- [Service principals in code and config](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/service-accounts-principal)
- [Standard environment variables](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.environmentcredential)

Note that unlike other secretlint PaaS rules, Azure does not have a standard file format for credentials and all
sensitive information is fully random, so discovering Azure AD credentials is purely heuristical.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-azure"
        }
    ]
}
```

## MessageIDs

### AzureTenantId

> found Azure AD tenant ID: {{ID}}

This is the GUID of an Azure AD tenant. While this ID can be discovered from the domain name, knowing the tenant ID
increases the chance that credentials can be exploited. It is thus a good idea to treat the tenant ID as sensitive.

### AzureClientId

> found Azure client id: {{ID}}

This is the equivalent of a username and should be treated as sensitive.

### AzureClientSecret

> found Azurre client secret: {{SECRET}}

This is the long-lived secret for a user or service principal and should be kept secret.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Examples

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-azure",
            // Ignore error related to IDs
            "allowMessageIds": ["AzureTenantId", "AzureClientId"],
            "options": {
                // allow list
                "allows": ["/IT_IS_PUBLIC/"]
            }
        }
    ]
}
```
