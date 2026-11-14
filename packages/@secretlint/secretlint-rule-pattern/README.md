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

### Using keywords

secretlint runs a pattern only on the files that contain one of its keywords, as it does for the built-in rules.
Without `keywords`, secretlint finds them in the patterns: for example, `/password\s*=\s*\S+/i` gets the keyword `password`.
When no keyword is found, such as for `/[0-9a-f]{64}/`, the pattern runs on every file. Write `keywords` to make it faster:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "patterns": [
          {
            "name": "internal token",
            "patterns": ["/itk_[a-z0-9]{32}/"],
            "keywords": ["itk_"]
          }
        ]
      }
    }
  ]
}
```

- Keywords are ASCII strings, matched case-insensitively.
- Every match of the patterns must contain one of the keywords. A match without one is not reported.
- `"keywords": []` runs the patterns on every file.
- `secretlint --profile` shows a pattern that runs on every file as `<name> (no keywords)`.
- Keywords are ASCII, so a pattern with the `i` flag can miss a match that uses a non-ASCII letter in place of a letter of the keyword. secretlint adds the `u` flag to every pattern, and with `iu`, `k` also matches the Kelvin sign `K` (U+212A) and `s` also matches the long s `ſ` (U+017F). For example, `/token=\w+/i` gets the keyword `token=`, and `to\u212Aen=abc123` (written with the Kelvin sign) is not reported, because the file does not contain `token=`. Write `"keywords": []` if a pattern should also find such text.

#### A keyword that is short or common

A short keyword such as `00` is in most files, so it does not tell where the secret can be.
For such a keyword, write the characters that follow it as a guard: `{ "keyword": ..., "after": ... }`.
secretlint finds the keyword only where the guard is met.

```json
{
  "name": "internal key",
  "patterns": ["/00[A-Za-z0-9_-]{40}/"],
  "keywords": [{ "keyword": "00", "after": "[A-Za-z0-9_-]{40,}" }]
}
```

- `after` is one set of ASCII characters and one least count: `[...]` and `{n,}`. `n` is from 1 to 255.
- In the set, write characters and ranges such as `a-z`. Write `\` only before `\` and `]`, and write a `-` as the last item.
- The keyword is matched case-insensitively, and the set is compared as it is written: `[a-f0-9]` does not have `A`.
- The syntax is strict. Other forms, such as `{40}`, `{32,40}`, `+`, `\d`, and `[^...]`, are an error, and the error tells the supported form.
- Every match of the patterns that contains the keyword must have the characters that meet the guard after it. Otherwise the match is not reported.
- `secretlint --profile` shows how many places of the keyword were found, and how many met the guard.

## MessageIDs

### Pattern
> found matching {{pattern.name}}: {{CREDENTIAL}}

Disallow to use specified RegEx patterns from SecretLint config.

## Options

### `allows`

A global list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string) that are allowed across all patterns. Each pattern can additionally define its own `allows` list to allow values only for that specific pattern.

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-pattern",
      "options": {
        "allows": ["/^test-/"],
        "patterns": [
          {
            "name": "password=",
            "patterns": ["/password\\s*=\\s*(?<password>[\\w\\d]{1,256})\\b.*/gi"],
            "allows": ["/^dummy-/"]
          },
          {
            "name": "apikey=",
            "patterns": ["/apikey\\s*=\\s*(?<apikey>[\\w\\d]{8,})\\b.*/gi"]
          }
        ]
      }
    }
  ]
}
```

In this example:
- `test-*` values are allowed globally for all patterns
- `dummy-*` values are allowed only for the `password=` pattern, but still flagged for `apikey=`

### `patterns`

Array of pattern configurations. Each pattern can have:

- `name: string` - Name of the pattern (required)
- `patterns?: string[]` - Array of RegExp-like strings to match against file content
- `pattern?: string` - **[DEPRECATED]** Single RegExp-like string to match against file content (use `patterns` instead)
- `filePathGlobs?: string[]` - Array of glob patterns to match against file paths
- `keywords?: (string | { keyword: string; after: string })[]` - Keywords for pre-filtering. See [Using keywords](#using-keywords)
- `allows?: string[]` - Per-pattern allow list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string), applied in addition to the global `allows`

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
