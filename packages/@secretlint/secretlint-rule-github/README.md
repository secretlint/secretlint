# @secretlint/secretlint-rule-github

A secretlint rule for GitHub.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-github

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-github"
        }
    ]
}
```

## MessageIDs

### GITHUB_TOKEN
> found GitHub Token({{typeName}}): {{KEY}}

Disallow to write GitHub Token.

- `ghp_` for Personal Access Tokens
- `gho_` for OAuth Access tokens
- `ghu_` for GitHub App user-to-server tokens
- `ghs_` for GitHub App server-to-server tokens
- `ghr_` for GitHub App refresh tokens

This rule can detect a new format of GitHub Token.

- [Authentication token format updates are generally available | GitHub Changelog](https://github.blog/changelog/2021-03-31-authentication-token-format-updates-are-generally-available/)

## Options

- `allows: string[]`

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/secretlint/secretlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
