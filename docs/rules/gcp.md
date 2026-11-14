# @secretlint/secretlint-rule-gcp

A secretlint rule for GCP.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-gcp"
        }
    ]
}
```

## MessageIDs

### PrivateKeyP12
> found GCP Service Account's private key(p12): {{FILE_NAME}}

This p12 file includes private key for GCP Service Account.

GCP Service Account's private key(PKCS12 format) is not encrypted data.
Because, the pass phase for this p12 file is `notasecret`.

- https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys#serviceaccountprivatekeytype

### PrivateKeyJSON
> found GCP Service Account's private key(json): {{FILE_NAME}}

This JSON file includes private key for GCP Service Account.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
    - For JSON key files, the patterns are matched against `private_key_id` and `private_key`
    - For `.p12` key files, the patterns are matched against the file name
