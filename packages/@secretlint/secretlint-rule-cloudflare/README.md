# @secretlint/secretlint-rule-cloudflare

A secretlint rule for detecting Cloudflare API tokens.

## Detected Token Types

| Token Type | Prefix | Format |
|---|---|---|
| Global API Key | `cfk_` | `cfk_` + 40 chars + 8 char checksum |
| User API Token | `cfut_` | `cfut_` + 40 chars + 8 char checksum |
| Account API Token | `cfat_` | `cfat_` + 40 chars + 8 char checksum |

References:
- [Token formats · Cloudflare Fundamentals docs](https://developers.cloudflare.com/fundamentals/api/get-started/token-formats/)
- [API tokens now detectable by secret scanning tools · Changelog](https://developers.cloudflare.com/changelog/post/2026-04-10-secret-scanning-support/)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-cloudflare

## Usage

Via `.secretlintrc.json`:

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-cloudflare"
        }
    ]
}
```

## Options

```ts
export type Options = {
    /**
     * Define allow pattern written by RegReg-like strings
     * See https://github.com/textlint/regexp-string-matcher#regexp-like-string
     **/
    allows?: string[];
};
```

## Messages

### CLOUDFLARE_GLOBAL_API_KEY

Detected a Cloudflare Global API Key (`cfk_` prefix).

### CLOUDFLARE_USER_API_TOKEN

Detected a Cloudflare User API Token (`cfut_` prefix).

### CLOUDFLARE_ACCOUNT_API_TOKEN

Detected a Cloudflare Account API Token (`cfat_` prefix).

## License

MIT © azu
