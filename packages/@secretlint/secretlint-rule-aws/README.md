# @secretlint/secretlint-rule-aws

A secretlint rule for AWS.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-aws

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-aws"
        }
    ]
}
```

## MessageIDs

### AWSAccountID
> found AWS Account ID: {{ID}}

[git-secrets](https://github.com/awslabs/git-secrets) detect it as secret.

### AWSSecretAccessKey
> found AWS Secret Access Key: {{KEY}}

AWS's Access key is crendential data. It should be private.

- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html 

### AWSAccessKeyID
> found AWS Access Key ID: {{ID}}

[git-secrets](https://github.com/awslabs/git-secrets) detect it as secret.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## Examples

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-aws",
            // Ignore error related to IDs
            "allowMessageIds": ["AWSAccountID", "AWSAccessKeyID"],
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

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
