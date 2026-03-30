# @secretlint/secretlint-rule-vercel

[Vercel](https://vercel.com) rule for secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-vercel

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

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

No Test to avoid Dependency cycles.

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT © azu
