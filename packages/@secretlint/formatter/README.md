# @secretlint/formatter

A formatter collection for Secretlint.

These formatter come from textlint and create compatible layer between Secretlint and textlint

We will re-implement formatter for Secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/formatter

## Usage

```js
import { loadFormatter } from "@secretlint/formatter";

const formatter = await loadFormatter({
    formatterName: "stylish",
    color: true,
    // Optional: return the content of the linted source by `filePath` of the result
    getSource: (filePath) => contents.get(filePath),
});
const output = formatter.format(results);
```

### The content of the source

The results do not have the content of the linted source.
A formatter that needs the content gets it from `getSource(filePath)` of the second argument.

```js
// custom formatter
export default (results, { getSource }) => {
    return results
        .map((result) => {
            // `undefined` if the content is not available
            const content = getSource?.(result.filePath);
            return `${result.filePath}: ${result.messages.length} messages, ${content?.length ?? 0} characters`;
        })
        .join("\n");
};
```

`getSource()` returns `undefined` if the content is not available.
`secretlint` command keeps the content of the files that have messages.
It keeps the content of all files only for `mask-result` formatter.

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
