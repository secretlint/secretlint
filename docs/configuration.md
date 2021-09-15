# Configuring Secretlint

## .secretlintrc file

`.secretlintrc.json` is configuration file on secretlint.

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}
```

The `id` property is the name of secretlint rule package.

Secretlint does not have built-in rule.
You want to add some rule and You should **install** the package and **add** the rule to `.secretlintrc` file.

Each rule has same configuration pattern:

- `options`: Option definition for the rule. For more details, see each rule documentation
- `disabled`: If `disabled` is `true`, disable the rule
- `allowMessageIds`: `allowMessageIds` is an array of message id that you want to suppress error report
    - message id is defined in each rule and please see the rule documentation

### Example: `options`

For example, `@secretlint/secretlint-rule-example` has `allows` in `options`.
This `allows` option define a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string) that you want to ignore.

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-example",
      "options": {
        "allows": [
          "/dummy_secret/i"
        ]
      }
    }
  ]
}
```

When you use a preset like `@secretlint/secretlint-rule-preset-recommend`, you need to put the option in `rules`.

For example, an option for `@secretlint/secretlint-rule-preset-recommend > @secretlint/secretlint-rule-aws`

```json5
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend",
      "rules": [
        {
          "id": "@secretlint/secretlint-rule-aws",
            "options": {
              "allows": [
	            // it will be ignored
                "xxxx-xxxx-xxxx-xxxx-xxxx"
              ]
            }
        }
      ]
    }
  ]
}
```

## Ignoring Files

### `.secretlintignore`

You can tell Secretlint to ignore specific files and directories by creating an `.secretlintignore` file in your project's root directory. 

The `.secretlintignore` file is a plain text file where each line is a glob pattern indicating which paths should be omitted from linting. For example, the following will omit all JavaScript files:

```text
**/*.js
```

`.secretlintignore` define syntax

- Lines beginning with `#` are treated as comments and do not affect ignore patterns
- Paths are relative to the current working directory
- Lines preceded by `!` are negated patterns that re-include a pattern that was ignored by an earlier pattern.
- Ignore patterns behave according to the `.gitignore` [specification](https://git-scm.com/docs/gitignore).

Of particular note is that like `.gitignore` files, all paths used as patterns for `.secretlintignore` must use forward slashes as their path separators.

```text
# Valid - use \
/config/*.pem

# Invalid
\config\*.pem
```

Please see [`.gitignore`'s specification](https://git-scm.com/docs/gitignor) for further examples of valid syntax.

#### Ignoring by default

Currently, secretlint ignore following file by default:

```
[
    "**/.git/**",
    "**/node_modules/**",
    "**/.secretlintrc/**",
    "**/.secretlintrc.{json,yaml,yml,js}/**",
    "**/.secretlintignore*/**"
]
```

### Using an Alternate Ignoring File

You can use specif file as ignoring configuration.
you can specify it on the command line using the `--secretlintignore` option. 

For example, you can use `.gitignore` file because it has the same format:

    secretlint --secretlintignore .gitignore "**/*"

## Ignoring by comments

[@secretlint/secretlint-rule-filter-comments](https://www.npmjs.com/package/@secretlint/secretlint-rule-filter-comments) support ignoring comment like `secretlint-disable`.

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-filter-comments

And setting to `.secretlintrc.json`:

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-filter-comments"
    }
  ]
}
```

[@secretlint/secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend) includes [@secretlint/secretlint-rule-filter-comments](https://www.npmjs.com/package/@secretlint/secretlint-rule-filter-comments).
If you have used [@secretlint/secretlint-rule-preset-recommend](./packages/@secretlint/secretlint-rule-preset-recommend), you not need to setup `@secretlint/secretlint-rule-filter-comments`.

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}
```

### `secretlint-disable` directives

- `secretlint-disable` disable
- `secretlint-enable`: enable again
- `secretlint-disable-line`: ignore current line
- `secretlint-disable-next-line`: ignore next line

###  `secretlint-disable` examples

To temporarily disable rule warnings in your file, use block comments in the following format:

You can replace `//` with any characters like `#` or `/*` etc...
`@secretlint/secretlint-rule-filter-comments` only look up `/(?<type>secretlint-(?:disable-next-line|disable-line|disable|enable))(?<options>.*)/g` pattern.

```
// secretlint-disable

THIS IS IGNORED SECRET

// secretlint-enable

THIS WILL REPORTED SECRET
```

You can also disable or enable warnings for specific rules:

```js
/* secretlint-disable @secretlint/secretlint-rule-github */
const TOKEN = "ghs-<github token>";

/* secretlint-enable @secretlint/secretlint-rule-github */
```

To disable rule warnings in an entire file, put a `/* secretlint-disable */` block comment at the top of the file.
Of course, you can use [.secretlintignore](https://github.com/secretlint/secretlint/blob/master/docs/configuration.md#secretlintignore) instead of it.

```
// secretlint-disable

.... all ignored ....
```

You can also disable or enable specific rules for an entire file:

```
// secretlint-disable @secretlint/secretlint-rule-github

GITHUB TOKEN WILL NOT DETECT!
```

To disable all rules on a specific line using `secretlint-disable-line`:

```
THIS IS SECRET BUT IT WILL BE IGNORED // secretlint-disable-line
```

To disable all rules on a next line using `secretlint-disable-nextline`:

```
// secretlint-disable-next-line
THIS IS SECRET BUT IT WILL BE IGNORED
```

All disable/enable syntax can include comment using `-- comment`.

```
// secretlint-disable @secretlint/secretlint-rule-github -- disable github rule
```
