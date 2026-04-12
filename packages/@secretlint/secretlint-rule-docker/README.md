# @secretlint/secretlint-rule-docker

A secretlint rule for Docker Personal Access Tokens.

Detects Docker Personal Access Tokens (PATs) that use the `dckr_pat_` prefix.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-docker

## MessageIDs

### DOCKER_PERSONAL_ACCESS_TOKEN

> found Docker Personal Access Token: {{TOKEN}}

Detects Docker PATs with the format `dckr_pat_` followed by 27 alphanumeric, underscore, or hyphen characters.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

## References

- [Docker Access Tokens documentation](https://docs.docker.com/security/access-tokens/)
- [GitHub Secret Scanning: supported patterns](https://docs.github.com/en/code-security/secret-scanning/introduction/supported-secret-scanning-patterns)
- [TruffleHog dockerhub v2 detector](https://github.com/trufflesecurity/trufflehog/blob/main/pkg/detectors/dockerhub/v2/dockerhub.go)

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

## License

MIT © azu
