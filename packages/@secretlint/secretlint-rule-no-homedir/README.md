# @secretlint/secretlint-rule-no-homedir

A secretlint rule that disallow to include user's homedir path.

For example, The user homedir is `/Usrs/exampleuser`, then this rule check if `/Usrs/exampleuser` is included. 

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-no-homedir

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-no-homedir"
        }
    ]
}
```

## MessageIDs

### HOMEDIR
> found user's homedir path: {{PATH}}

If it is expected exposed, please ignore it by following way.

- `.secretlintignore`: ignore specific file

## Options

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

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
