# @secretlint/secretlint-rule-npm

A secretlint rule for npm.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/secretlint-rule-npm

## Usage

Via `.secretlintrc.json`(Recommended)

```json
{
    "rules": [
        {
            "id": "@secretlint/secretlint-rule-npm"
        }
    ]
}
```

## MessageIDs

### PackageJSON_xOauthToken
> found GitHub Token: {{TOKEN}}

Disallow to use `https://<token>@github.com/owner/repo.git` in `package.json` or `package-lock.json`.

Often, `https://<token>@github.com/owner/repo.git` is used for installing module from private repository.

- [Easier builds and deployments using Git over HTTPS and OAuth - The GitHub Blog](https://github.blog/2012-09-21-easier-builds-and-deployments-using-git-over-https-and-oauth/)

If you want to use some module as private, please use private registry like npm, [GitHub Package Registry](https://help.github.com/packages/publishing-and-managing-packages/about-github-packages), or [Verdaccio](https://verdaccio.org/).

- [About private packages | npm Documentation](https://docs.npmjs.com/about-private-packages)

### Npmrc_authToken
> found npmrc authToken: {{TOKEN}}

Disallow to include `<registry>:_authToken=<TOKEN>` in `.npmrc`.

The `TOKEN` is credential data.

- [npm - Using auth tokens in .npmrc - Stack Overflow](https://stackoverflow.com/questions/53099434/using-auth-tokens-in-npmrc)

### NPM_ACCESS_TOKEN
> found npm access token: {{TOKEN}}

Disallow to include npm access token.

The `TOKEN` is credential data.

- [About access tokens | npm Docs](https://docs.npmjs.com/about-access-tokens)
- [Announcing npm’s new access token format | The GitHub Blog](https://github.blog/2021-09-23-announcing-npms-new-access-token-format/)

## Options

- `allows: string[]`
    - Allows a list of [RegExp-like String](https://github.com/textlint/regexp-string-matcher#regexp-like-string)

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

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
