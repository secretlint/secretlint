# @secretlint/profiler

Profile manager for Secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/profiler

## Usage

`@secretlint/profiler` exports a shared `secretLintProfiler` instance. Secretlint packages mark their own timings with it.

Profiling costs performance—`performance.mark()` is called for each rule and each file—so the profiler should be enabled only when you need the profiling result.
The `secretlint` CLI enables it only when the `--profile` flag is passed.

```js
import { secretLintProfiler } from "@secretlint/profiler";

// Disable profiling: `mark()` becomes no-op and `PerformanceObserver` is not started
secretLintProfiler.setEnabled(false);

// Enable profiling before running secretlint
secretLintProfiler.setEnabled(true);
// ... run secretlint ...
const measures = await secretLintProfiler.getMeasures();
```

The profiler is enabled by default. If you use Secretlint as a library and do not need the profiling result, call `secretLintProfiler.setEnabled(false)` before running secretlint.

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
