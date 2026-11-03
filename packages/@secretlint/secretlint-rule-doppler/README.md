# @secretlint/secretlint-rule-doppler

[Doppler](https://www.doppler.com/) auth token rule for secretlint.

## Install

```sh
npm install @secretlint/secretlint-rule-doppler
```

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-doppler" }]
}
```

## Detected formats

Detects the [documented auth token formats](https://docs.doppler.com/reference/auth-token-formats): `dp.pt.`, `dp.st.`, `dp.sa.`, `dp.ct.`, `dp.said.`, `dp.scim.`, and `dp.audit.`, followed by 40–44 ASCII alphanumeric characters.
Service tokens may include a 2–35 character environment qualifier (`[a-z0-9_-]`) before the token body, for example `dp.st.dev.<body>`.
Tokens embedded in identifiers are excluded. Service tokens followed by a dot and another alphanumeric segment are excluded to avoid reporting an invalid environment qualifier as a token body.

## MessageIDs

### DOPPLER_PERSONAL_TOKEN

> found doppler personal token: ${props.ID}

Doppler personal tokens should be private.

### DOPPLER_SERVICE_TOKEN

> found doppler service token: ${props.ID}

Doppler service tokens should be private.

### DOPPLER_SERVICE_ACCOUNT_TOKEN

> found doppler service account token: ${props.ID}

Doppler service account tokens should be private.

### DOPPLER_CLI_TOKEN

> found doppler CLI token: ${props.ID}

Doppler CLI tokens should be private.

### DOPPLER_SERVICE_ACCOUNT_IDENTITY_TOKEN

> found doppler service account identity token: ${props.ID}

Doppler service account identity tokens should be private.

### DOPPLER_SCIM_TOKEN

> found doppler SCIM token: ${props.ID}

Doppler SCIM tokens should be private.

### DOPPLER_AUDIT_TOKEN

> found doppler audit token: ${props.ID}

Doppler audit tokens should be private.

## Options

- `allows: string[]`: allows a list of [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

## Running tests

```sh
pnpm test
```

## Changelog

See the [releases](https://github.com/secretlint/secretlint/releases).

## License

MIT © awais-ur-rehman
