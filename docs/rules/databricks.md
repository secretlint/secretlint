# @secretlint/secretlint-rule-databricks

A rule for detecting [Databricks personal access tokens](https://docs.databricks.com/aws/en/dev-tools/auth/pat) in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-databricks"
        }
    ]
}
```

## MessageIDs

### DATABRICKS_PERSONAL_ACCESS_TOKEN

Databricks personal access token is detected.

Databricks personal access tokens start with the literal prefix `dapi`, followed by a 32-character hexadecimal string, with an optional `-<digit>` suffix. The rule matches hex characters case-insensitively.

**NG** examples:

```
DATABRICKS_TOKEN=dapi1234567890ABCDEF1234567890ABCDEF
token: "dapi0123456789ABCDEF0123456789ABCDEF-3"
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
