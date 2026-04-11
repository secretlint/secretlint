# @secretlint/secretlint-rule-grafana

[Grafana](https://grafana.com/) rule for secretlint.

This rule detects Grafana API tokens such as Grafana Cloud API tokens and
Grafana Service Account tokens.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-grafana

## MessageIDs

### GRAFANA_CLOUD_API_TOKEN
> found Grafana Cloud API token: ${props.TOKEN}

Grafana Cloud API tokens start with the `glc_` prefix and contain a
base64-encoded JWT payload. Real tokens typically start with `glc_eyJ`.
See [Grafana Cloud API keys](https://grafana.com/docs/grafana-cloud/account-management/authentication-and-permissions/api-keys/).

### GRAFANA_SERVICE_ACCOUNT_TOKEN
> found Grafana Service Account token: ${props.TOKEN}

Grafana Service Account tokens start with the `glsa_` prefix, followed by
32 alphanumeric characters, an underscore, and an 8-character hex checksum.
See [Grafana Service Accounts](https://grafana.com/docs/grafana/latest/administration/service-accounts/).

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
