# @secretlint/secretlint-rule-filter-comments

secretlint-disable comment directive.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-filter-comments


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

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

MIT © azu
