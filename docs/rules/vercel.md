# @secretlint/secretlint-rule-vercel

[Vercel](https://vercel.com) rule for secretlint.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## MessageIDs

### VERCEL_PERSONAL_ACCESS_TOKEN
> found Vercel personal access token: ${props.ID}

Vercel personal access tokens (`vcp_`) should be private.

### VERCEL_INTEGRATION_TOKEN
> found Vercel integration token: ${props.ID}

Vercel integration tokens (`vci_`) should be private.

### VERCEL_APP_ACCESS_TOKEN
> found Vercel app access token: ${props.ID}

Vercel app access tokens (`vca_`) should be private.

### VERCEL_APP_REFRESH_TOKEN
> found Vercel app refresh token: ${props.ID}

Vercel app refresh tokens (`vcr_`) should be private.

### VERCEL_AI_GATEWAY_API_KEY
> found Vercel AI Gateway API key: ${props.ID}

Vercel AI Gateway API keys (`vck_`) should be private.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
