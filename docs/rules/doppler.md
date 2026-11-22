# @secretlint/secretlint-rule-doppler

A rule for detecting [Doppler](https://www.doppler.com/) auth tokens in your code.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.
This rule is in [@secretlint/secretlint-rule-preset-canary](./preset-canary.md), and is not in [@secretlint/secretlint-rule-preset-recommend](./preset-recommend.md) yet.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-doppler"
        }
    ]
}
```

## MessageIDs

### DOPPLER_PERSONAL_TOKEN

Doppler personal token is detected. The token is `dp.pt.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.pt.00000000000000AAAAAAAAAAAAAzzzzzzzzzzzzz
```

### DOPPLER_SERVICE_TOKEN

Doppler service token is detected. The token is `dp.st.`, an optional environment name (2 to 35 characters of `[a-z0-9_-]`) and `.`, followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.st.env_1-2.AAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaa
```

### DOPPLER_SERVICE_ACCOUNT_TOKEN

Doppler service account token is detected. The token is `dp.sa.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.sa.0000000000000000000000000000000000000000
```

### DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN

Doppler service account identity token is detected. The token is `dp.said.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.said.0000000000000000000000000000000000000000
```

### DOPPLER_CLI_TOKEN

Doppler CLI token is detected. The token is `dp.ct.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.ct.0000000000000000000000000000000000000000
```

### DOPPLER_SCIM_TOKEN

Doppler SCIM token is detected. The token is `dp.scim.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.scim.0000000000000000000000000000000000000000
```

### DOPPLER_AUDIT_TOKEN

Doppler audit token is detected. The token is `dp.audit.` followed by 40 to 44 alphanumeric characters.

**NG** examples:

```
dp.audit.0000000000000000000000000000000000000000
```

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Doppler: Auth Token Formats](https://docs.doppler.com/reference/auth-token-formats)
