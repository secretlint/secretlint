# @secretlint/secretlint-rule-aws

A secretlint rule for AWS.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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

AWS's Access key is credential data. It should be private.

- https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html 

### AWSAccessKeyID
> found AWS Access Key ID: {{ID}}

[git-secrets](https://github.com/awslabs/git-secrets) detect it as secret.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
- `enableIDScanRule: boolean`
    - Default: `false`
    - Enable ID scan rules
      - `AWSAccountID`
      - `AWSAccessKeyID`
    - These rules may be false-positive. You can enable it by setting `true`.

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
