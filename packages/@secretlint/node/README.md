# @secretlint/node

Secretlint client library for Node.js.

An engine handles

- Read files and Lint these and Output results
    - IO and Core and Formatter

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/node

## Usage

```js
import { createEngine } from "@secretlint/node";
(async () => {
    const engine = await createEngine({
        color: false,
        cwd: path.join(__dirname, "fixtures/valid-config"),
        formatter: "stylish"
    });
    const output = await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
    console.log(output); /*
[TEST_DIR]/fixtures/SECRET.txt
1:8  warning  found secret: SECRET  example

✖ 1 problem (0 errors, 1 warning)
*/
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
