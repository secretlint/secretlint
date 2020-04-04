# Configuring Secretlint

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

### Using an Alternate File

You can use specif file as ignoring configuration.
you can specify it on the command line using the `--secretlintignore` option. 

For example, you can use `.gitignore` file because it has the same format:

    secretlint --secretlintignore .gitignore "**/*"