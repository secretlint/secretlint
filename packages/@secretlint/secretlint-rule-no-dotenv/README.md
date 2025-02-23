# @secretlint/secretlint-rule-no-dotenv
A secretlint rule for dotenv.

Prevents commits  `.env` file because it may contain credentials.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-no-dotenv

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-no-dotenv",
            "options": {
                "allowFileNames": [".env.local", ".env.test"]
            }
        }
    ]
}
```

The `allowFileNames` option allows you to specify certain .env files that should be allowed. This is useful for environment-specific configuration files that are safe to commit. Note that this option works alongside `.secretlintignore`, giving you flexibility in how you want to manage your environment files.

## MessageIDs

### FOUND_DOTENV_FILE
> found .env file

Disallow to commit `.env` file, because dotenv document describe that

> Should I commit my .env file?
> 
> No. We strongly recommend against committing your .env file to version control.
> 
> -- <https://github.com/motdotla/dotenv#should-i-commit-my-env-file>

You can tell Secretlint to ignore `.env` file by [`.secretlintignore`](https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#secretlintignore) configuration.

For more details `.secretlintignore`, see following document.

- <https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#secretlintignore>

## Author

- [Munieru](https://github.com/munierujp)

## License

MIT © secretlint
