# @secretlint/secretlint-rule-azure

A secretlint rule for Azure (i.e. Azure AD) secrets. This rule takes aim at two common credentials leaks:

- [Service principals in code and config](https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/service-accounts-principal)
- [Standard environment variables](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.environmentcredential)

Note that unlike other secretlint PaaS rules, Azure does not have a standard file format for credentials and all
sensitive information is fully random, so discovering Azure AD credentials is purely heuristical.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-azure

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

## Author

- [github/bittrance](https://github.com/bittrance)

## License

MIT © [Xenit AB](https://github.com/xenitab)
