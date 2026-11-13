# @secretlint/profiler

Profile manager for Secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/profiler

## Usage

`@secretlint/profiler` exports a shared `secretLintProfiler` instance. Secretlint packages record their own timings with it.

Profiling costs performance, because the time is recorded for each file and each pattern. So the profiler should be enabled only when you need the profiling result.
The `secretlint` CLI enables it only when the `--profile` flag is passed.

The profiler is disabled by default: it records nothing.
Enable it before running secretlint if you need the profiling result.

```js
import { secretLintProfiler } from "@secretlint/profiler";

// Enable profiling before running secretlint
secretLintProfiler.setEnabled(true);
// ... run secretlint ...
const stats = secretLintProfiler.getStats();

// Disable profiling: the profiler records nothing and the collected totals are cleared
secretLintProfiler.setEnabled(false);
```

If you use `@secretlint/node`, pass `profile: true` to `createEngine()` instead.

### Stats

The profiler does not keep each record. It keeps the totals for each `type` and `id`, so the result is small for any number of files.

```ts
type SecretLintProfilerStat = {
    type: string; // what was measured, such as "@core>lint"
    id: string | undefined; // the target: a file path, a rule id, or the id of a pattern
    count: number; // how many times it was recorded
    duration: number; // the total time in milliseconds
    maxDuration: number; // the longest time of a record in milliseconds
};
```

| `type`                    | `id`       | Description                                                                                         |
| ------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `secretlint>cli`          |            | The CLI                                                                                             |
| `secretlint>search-files` |            | Search the target files                                                                             |
| `@node>load-config`       |            | Load the config. It includes the `@config-loader>*` types                                           |
| `@node>execute`           |            | Lint the files and format the results                                                               |
| `@node>read-file`         |            | Read a file                                                                                         |
| `@node>format`            |            | Format the results                                                                                  |
| `@core>lint`              | file path  | Lint a file                                                                                         |
| `@core>setup-rules`       |            | Create the plan of the rules. It runs once for a config                                             |
| `@core>keyword-scan`      |            | Scan the content once for the keywords of all rules. All rules share it                             |
| `@core>line-check`        |            | Test the lines that have a keyword with the patterns. It includes `@core>pattern-line-test`         |
| `@core>pattern-line-test` | pattern id | Test a line with a pattern, before the pattern runs                                                 |
| `@core>pattern`           | pattern id | Run a pattern on the content or a line, and report the matches                                      |
| `@core>pattern-match`     | pattern id | The number of the matches of a pattern. It has no duration                                          |
| `@core>rule-handler`      | rule id    | Run a rule for a file: the patterns of the rule, or the handler that `create()` of the rule returns |

The id of a pattern is `{rule id}#{index of the pattern in the rule} {pattern}`.

`getMeasures()` is deprecated. It returns the same totals as `{ name, duration, count }`, where `name` is `{type}` or `{type}||{id}`.

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
