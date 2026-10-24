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
- `github_pat_` for fine-grained personal access tokens

This rule can detect a new format of GitHub Token.

- [Authentication token format updates are generally available | GitHub Changelog](https://github.blog/changelog/2021-03-31-authentication-token-format-updates-are-generally-available/)
- [Introducing fine-grained personal access tokens for GitHub | The GitHub Blog](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

- `checkChecksum: boolean` (default: `false`)
    - Validate the CRC32 checksum of classic 40-character tokens with the
      `ghp_`, `gho_`, `ghu_`, `ghs_`, or `ghr_` prefix and a Base62 body.
      Matches with invalid checksums are ignored when this option is enabled.
    - Fine-grained PATs, JWT-style installation tokens, and other token shapes
      retain their existing detection behavior. Their checksums are not checked.

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-github",
            "options": {
                "checkChecksum": true
            }
        }
    ]
}
```

The classic format has 30 Base62 characters of random data followed by a
six-character Base62-encoded CRC32 checksum of that data, excluding the prefix.
See [GitHub's token format description](https://github.blog/engineering/platform-security/behind-githubs-new-authentication-token-formats/).
Checksum validation runs locally and does not establish whether a token is active.

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
