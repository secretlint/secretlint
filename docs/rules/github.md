# @secretlint/secretlint-rule-github

A secretlint rule for GitHub.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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
