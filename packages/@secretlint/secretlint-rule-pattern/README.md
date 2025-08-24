# @secretlint/secretlint-rule-pattern

A secretlint rule that checks for RegEx patterns

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-pattern

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "patterns": [
          {
            "name": "credentials",
            "patterns": [
              "/password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?\/~`_+-=|]{1,256})\\b.*/",
              "/apikey\\s*=\\s*(?<apikey>[\\w\\d]{8,})\\b.*/",
              "/token\\s*=\\s*(?<token>[\\w\\d]{16,})\\b.*/"
            ]
          }
        ]
      }
    }
  ]
}

```

### Deprecated options

The `pattern` field (singular) is still supported but deprecated. Use `patterns` array instead:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "patterns": [
          {
            "name": "password",
            "pattern": "/password\\s*=\\s*(?<password>[\\w\\d!@#$%^&(){}\\[\\]:\";'<>,.?\/~`_+-=|]{1,256})\\b.*/"
          }
        ]
      }
    }
  ]
}
```

### Using filePathGlobs

You can use `filePathGlobs` to match against file paths using glob patterns:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "patterns": [
          {
            "name": "env files",
            "filePathGlobs": ["**/.env", "**/.env.*"]
          },
          {
            "name": "AWS credentials in env files",
            "filePathGlobs": ["**/.env*"],
            "patterns": [
              "/aws_access_key_id\\s*=\\s*\\S+/i",
              "/aws_secret_access_key\\s*=\\s*\\S+/i"
            ]
          },
          {
            "name": "private keys",
            "filePathGlobs": ["**/*.pem", "**/*.key"],
            "patterns": [
              "/BEGIN (RSA |EC )?PRIVATE KEY/"
            ]
          }
        ]
      }
    }
  ]
}
```

- When only `filePathGlobs` is specified, the rule reports if the file path matches any of the glob patterns
- When only `patterns` is specified, the rule reports if the file content matches any of the regex patterns
- When both are specified, the rule reports only if both the file path matches the glob AND the content matches any of the patterns

## MessageIDs

### Pattern
> found matching {{pattern.name}}: {{CREDENTIAL}}

Disallow to use specified RegEx patterns from SecretLint config.

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)
- `patterns: PatternType[]`
    - Array of pattern configurations
    - Each pattern can have:
        - `name: string` - Name of the pattern (required)
        - `patterns?: string[]` - Array of RegExp-like strings to match against file content
        - `pattern?: string` - Single RegExp-like string to match against file content (deprecated, use `patterns` instead)
        - `filePathGlobs?: string[]` - Array of glob patterns to match against file paths

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

- [github/PseudoCoding](https://github.com/PseudoCoding)

## License

MIT © azu
