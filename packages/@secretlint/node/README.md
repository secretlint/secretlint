# @secretlint/node

Secretlint client library for Node.js.

An engine handles

- Read files and Lint these and Output results
    - IO and Core and Formatter

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/node

## Usage

Install the rules you want to use and create a `.secretlintrc.json` in the working directory. For example:

```sh
npm install @secretlint/secretlint-rule-preset-recommend
```

```json
{
    "rules": [{ "id": "@secretlint/secretlint-rule-preset-recommend" }]
}
```

Save the following as `lint.mjs` and run `node lint.mjs path/to/file.txt`:

```js
import { createEngine } from "@secretlint/node";

const engine = await createEngine({
    color: false,
    maskSecrets: true,
    cwd: process.cwd(),
    formatter: "stylish"
});
const result = await engine.executeOnFiles({ filePathList: process.argv.slice(2) });
console.log(result.output);
process.exitCode = result.ok ? 0 : 1;
```

`maskSecrets: true` hides detected secret values in lint messages.

`executeOnFiles` returns an object with the formatted `output` string and an `ok` flag. `ok` is `false` if any file has a lint message. Configuration and file-reading errors reject the promise.

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
