# @secretlint/secretlint-rule-grafana

[Grafana](https://grafana.com/) rule for secretlint.

This rule detects Grafana API tokens such as Grafana Cloud API tokens and
Grafana Service Account tokens.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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
