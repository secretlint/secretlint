# @secretlint/profiler

Profile manager for Secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/profiler

## Usage

`@secretlint/profiler` exports a shared `secretLintProfiler` instance. Secretlint packages mark their own timings with it.

Profiling costs performance—`performance.mark()` is called for each rule and each file—so the profiler should be enabled only when you need the profiling result.
The `secretlint` CLI enables it only when the `--profile` flag is passed.

The profiler is disabled by default: `mark()` is no-op and `PerformanceObserver` is not started.
Enable it before running secretlint if you need the profiling result.

```js
import { secretLintProfiler } from "@secretlint/profiler";

// Enable profiling before running secretlint
secretLintProfiler.setEnabled(true);
// ... run secretlint ...
const measures = await secretLintProfiler.getMeasures();

// Disable profiling: `mark()` becomes no-op and collected entries are cleared
secretLintProfiler.setEnabled(false);
```

If you use `@secretlint/node`, pass `profile: true` to `createEngine()` instead.

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
