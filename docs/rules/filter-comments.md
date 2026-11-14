# @secretlint/secretlint-rule-filter-comments

secretlint-disable comment directive.

This rule is built into secretlint (`@secretlint/core`), so you do not need to install a package for it.

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-filter-comments"
    }
  ]
}
```

## secretlint-disable directives

- `secretlint-disable` disable 
- `secretlint-enable`: enable again
- `secretlint-disable-line`: ignore current line
- `secretlint-disable-next-line`: ignore next line

### Examples

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

## MessageIDs

### IGNORE_MESSAGE
> disable by secretlint-disable comment

Ignored messages. It will not appear on result.

## Options

- [ ] No Options yet
