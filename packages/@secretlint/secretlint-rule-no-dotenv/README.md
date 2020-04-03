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
            "id": "@secretlint/secretlint-rule-no-dotenv"
        }
    ]
}
```

## MessageIDs

### FOUND_DOTENV_FILE
> found .env file

`.env` file was found.

## Author

- [Munieru](https://github.com/munierujp)

## License

MIT © secretlint
