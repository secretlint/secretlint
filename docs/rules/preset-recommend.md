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

- [@secretlint/secretlint-rule-aws](https://www.npmjs.com/package/@secretlint/secretlint-rule-aws)
- [@secretlint/secretlint-rule-gcp](https://www.npmjs.com/package/@secretlint/secretlint-rule-gcp)
- [@secretlint/secretlint-rule-privatekey](https://www.npmjs.com/package/@secretlint/secretlint-rule-privatekey)
- [@secretlint/secretlint-rule-npm](https://www.npmjs.com/package/@secretlint/secretlint-rule-npm)
- [@secretlint/secretlint-rule-basicauth](https://www.npmjs.com/package/@secretlint/secretlint-rule-basicauth)
- [@secretlint/secretlint-rule-slack](https://www.npmjs.com/package/@secretlint/secretlint-rule-slack)
- [@secretlint/secretlint-rule-sendgrid](https://www.npmjs.com/package/@secretlint/secretlint-rule-sendgrid)
- [@secretlint/secretlint-rule-shopify](https://www.npmjs.com/package/@secretlint/secretlint-rule-shopify)
- [@secretlint/secretlint-rule-stripe](https://www.npmjs.com/package/@secretlint/secretlint-rule-stripe)
- [@secretlint/secretlint-rule-github](https://www.npmjs.com/package/@secretlint/secretlint-rule-github)
- [@secretlint/secretlint-rule-gitlab](https://www.npmjs.com/package/@secretlint/secretlint-rule-gitlab)
- [@secretlint/secretlint-rule-grafana](https://www.npmjs.com/package/@secretlint/secretlint-rule-grafana)
- [@secretlint/secretlint-rule-openai](https://www.npmjs.com/package/@secretlint/secretlint-rule-openai)
- [@secretlint/secretlint-rule-anthropic](https://www.npmjs.com/package/@secretlint/secretlint-rule-anthropic)
- [@secretlint/secretlint-rule-groq](https://www.npmjs.com/package/@secretlint/secretlint-rule-groq)
- [@secretlint/secretlint-rule-huggingface](https://www.npmjs.com/package/@secretlint/secretlint-rule-huggingface)
- [@secretlint/secretlint-rule-linear](https://www.npmjs.com/package/@secretlint/secretlint-rule-linear)
- [@secretlint/secretlint-rule-notion](https://www.npmjs.com/package/@secretlint/secretlint-rule-notion)
- [@secretlint/secretlint-rule-1password](https://www.npmjs.com/package/@secretlint/secretlint-rule-1password)
- [@secretlint/secretlint-rule-database-connection-string](https://www.npmjs.com/package/@secretlint/secretlint-rule-database-connection-string)
- [@secretlint/secretlint-rule-hashicorp-vault](https://www.npmjs.com/package/@secretlint/secretlint-rule-hashicorp-vault)
- [@secretlint/secretlint-rule-vercel](https://www.npmjs.com/package/@secretlint/secretlint-rule-vercel)
- [@secretlint/secretlint-rule-databricks](https://www.npmjs.com/package/@secretlint/secretlint-rule-databricks)
- [@secretlint/secretlint-rule-docker](https://www.npmjs.com/package/@secretlint/secretlint-rule-docker)
- [@secretlint/secretlint-rule-figma](https://www.npmjs.com/package/@secretlint/secretlint-rule-figma)
- [@secretlint/secretlint-rule-cloudflare](https://www.npmjs.com/package/@secretlint/secretlint-rule-cloudflare)
- [@secretlint/secretlint-rule-tailscale](https://www.npmjs.com/package/@secretlint/secretlint-rule-tailscale)
- [@secretlint/secretlint-rule-filter-comments](https://www.npmjs.com/package/@secretlint/secretlint-rule-filter-comments)
    - `secretlint-disable` directives. For more details, see <https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#ignoring-error-by-comments>

## Notes

The rules of this preset are built into `@secretlint/core`, and this package re-exports the preset of `@secretlint/core`.
secretlint resolves the id of this preset from `@secretlint/core`, so the config works without installing this package.
