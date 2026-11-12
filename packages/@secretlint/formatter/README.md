# @secretlint/formatter

A formatter collection for Secretlint.

## Formatters

| Name           | Description                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stylish`      | Human-readable format. The default formatter of `secretlint` command                                                                                |
| `pretty-error` | Human-readable format with the line of the source                                                                                                   |
| `table`        | Table format                                                                                                                                        |
| `compact`      | A message per line                                                                                                                                  |
| `unix`         | A message per line, like the output of compilers                                                                                                    |
| `github`       | [Workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands) that create annotations on GitHub Actions |
| `json`         | JSON of the results                                                                                                                                 |
| `checkstyle`   | Checkstyle XML                                                                                                                                      |
| `junit`        | JUnit XML                                                                                                                                           |
| `jslint-xml`   | JSLint XML                                                                                                                                          |
| `tap`          | [TAP](https://testanything.org/) version 13                                                                                                         |
| `mask-result`  | The content of the source with the secrets masked                                                                                                   |

`stylish`, `pretty-error`, `compact`, `unix`, `github`, `checkstyle`, `junit`, `jslint-xml` and `tap` are ported from [@textlint/linter-formatter](https://github.com/textlint/textlint/tree/master/packages/%40textlint/linter-formatter), and the output is the same as it.

You can also pass a file path or a package name as `formatterName`.
A package name can omit `secretlint-formatter-` prefix.

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
