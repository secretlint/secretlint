# @secretlint/secretlint-rule-preset-recommend

Recommended rule preset for secretlint.

This preset is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-recommend"
        }
    ]
}
```

## Options

You can override preset default options for each rule.

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-recommend",
            "rules": [
                {
                    "id": "@secretlint/secretlint-rule-aws",
                    "options": {
                        "allows": ["allowed token"]
                    }
                }
            ]
        }
    ]
}
```

If you want to ignore `"AWSAccountID"` and `"AWSAccessKeyID"` of `"@secretlint/secretlint-rule-aws"`, you can configure following.

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-preset-recommend",
            "rules": [
                {
                    "id": "@secretlint/secretlint-rule-aws",
                    "allowMessageIds": ["AWSAccountID", "AWSAccessKeyID"]
                }
            ]
        }
    ]
}
```

## Rules

- [@secretlint/secretlint-rule-aws](./aws.md)
- [@secretlint/secretlint-rule-gcp](./gcp.md)
- [@secretlint/secretlint-rule-privatekey](./privatekey.md)
- [@secretlint/secretlint-rule-npm](./npm.md)
- [@secretlint/secretlint-rule-basicauth](./basicauth.md)
- [@secretlint/secretlint-rule-slack](./slack.md)
- [@secretlint/secretlint-rule-sendgrid](./sendgrid.md)
- [@secretlint/secretlint-rule-shopify](./shopify.md)
- [@secretlint/secretlint-rule-stripe](./stripe.md)
- [@secretlint/secretlint-rule-github](./github.md)
- [@secretlint/secretlint-rule-gitlab](./gitlab.md)
- [@secretlint/secretlint-rule-grafana](./grafana.md)
- [@secretlint/secretlint-rule-openai](./openai.md)
- [@secretlint/secretlint-rule-anthropic](./anthropic.md)
- [@secretlint/secretlint-rule-groq](./groq.md)
- [@secretlint/secretlint-rule-huggingface](./huggingface.md)
- [@secretlint/secretlint-rule-linear](./linear.md)
- [@secretlint/secretlint-rule-notion](./notion.md)
- [@secretlint/secretlint-rule-1password](./1password.md)
- [@secretlint/secretlint-rule-database-connection-string](./database-connection-string.md)
- [@secretlint/secretlint-rule-hashicorp-vault](./hashicorp-vault.md)
- [@secretlint/secretlint-rule-vercel](./vercel.md)
- [@secretlint/secretlint-rule-databricks](./databricks.md)
- [@secretlint/secretlint-rule-docker](./docker.md)
- [@secretlint/secretlint-rule-figma](./figma.md)
- [@secretlint/secretlint-rule-cloudflare](./cloudflare.md)
- [@secretlint/secretlint-rule-tailscale](./tailscale.md)
- [@secretlint/secretlint-rule-filter-comments](./filter-comments.md)
    - `secretlint-disable` directives. For more details, see <https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#ignoring-error-by-comments>

## Notes

The rules of this preset are built into `@secretlint/core`, and this package re-exports the preset of `@secretlint/core`.
secretlint resolves the id of this preset from `@secretlint/core`, so the config works without installing this package.
