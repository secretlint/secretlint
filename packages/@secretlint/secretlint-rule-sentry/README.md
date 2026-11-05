# @secretlint/secretlint-rule-sentry

Detect Sentry authentication tokens in text files.

## Install

```sh
npm install --save-dev secretlint @secretlint/secretlint-rule-sentry
```

Add the rule to `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-sentry"
        }
    ]
}
```

## MessageIDs

### SENTRY_ORGANIZATION_TOKEN

> found Sentry organization auth token: ${props.TOKEN}

Detects `sntrys_` tokens with a Base64 payload and a 43-character Base64
secret. Both padded and unpadded payloads are supported, as are standard
and URL-safe Base64 characters. Payloads are limited to 10–300 characters
before padding to keep scanning bounded. The payload must decode to a JSON
object with a finite numeric `iat` (issued-at) value. Invalid Base64 padding
and non-canonical encodings are ignored.

See Sentry's [organization token generation](https://github.com/getsentry/sentry/blob/master/src/sentry/utils/security/orgauthtoken_token.py).

### SENTRY_PERSONAL_TOKEN

> found Sentry personal auth token: ${props.TOKEN}

Detects `sntryu_` followed by 64 lowercase hexadecimal characters.

### SENTRY_USER_APP_TOKEN

> found Sentry user app auth token: ${props.TOKEN}

Detects `sntrya_` followed by 64 lowercase hexadecimal characters.

See Sentry's [token prefixes](https://github.com/getsentry/sentry/blob/master/src/sentry/types/token.py)
and [API token generation](https://github.com/getsentry/sentry/blob/master/src/sentry/models/apitoken.py).

This rule checks token formats locally; it does not contact Sentry or verify
whether a token is active. Public Sentry DSNs and legacy tokens without a
prefix are outside its scope. Secretlint masks token values in diagnostic
messages by default.

## Options

- `allows: string[]`: exclude matching tokens using literal strings or
  [RegExp-like strings](https://github.com/textlint/regexp-string-matcher#regexp-like-string).

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-sentry",
            "options": {
                "allows": ["/^sntryu_0{64}$/"]
            }
        }
    ]
}
```

## Changelog

See the [Releases page](https://github.com/secretlint/secretlint/releases).

## License

MIT © awais-ur-rehman
