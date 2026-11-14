# @secretlint/secretlint-rule-docker

A secretlint rule for Docker Personal Access Tokens.

Detects Docker Personal Access Tokens (PATs) that use the `dckr_pat_` prefix.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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
