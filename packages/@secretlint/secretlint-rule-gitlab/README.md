# @secretlint/secretlint-rule-gitlab

A secretlint rule for GitLab tokens.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-gitlab

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-gitlab"
        }
    ]
}
```

## MessageIDs

### GITLAB_PERSONAL_ACCESS_TOKEN

> found GitLab Personal Access Token: {{KEY}}

Disallow writing a GitLab Personal Access Token.

A GitLab Personal Access Token begins with the `glpat-` prefix.

- [GitLab Docs: Token prefixes](https://docs.gitlab.com/security/tokens/)
- [GitHub Docs: Supported secret scanning patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

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
