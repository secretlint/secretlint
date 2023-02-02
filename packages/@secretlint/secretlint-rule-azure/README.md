# @secretlint/secretlint-rule-azure

A secretlint rule for Azure (i.e. Azure AD) secrets.

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

### AzureClientId

> found Azure client id: {{ID}}

### AzureClientSecret

> found Azurre client secret: {{SECRET}}

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
