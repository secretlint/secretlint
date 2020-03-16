# @secretlint/source-creator

Create SecretLintRawSource from content.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/source-creator

## Usage


```js
import { createRawSource } from "@secretlint/source-creator"
(async () => {
    const source = await createRawSource("/path/to/file");
    coneols.log(source);
})();
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

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
