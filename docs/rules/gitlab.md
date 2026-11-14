# @secretlint/secretlint-rule-gitlab

A secretlint rule for GitLab tokens.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

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
