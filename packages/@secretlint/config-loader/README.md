# @secretlint/config-loader

Config loader for secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/config-loader

## Usage

### API

`loadConfig(options)` returns a promise for an object containing:

- `ok`: `true` when loading succeeds.
- `configFilePath`: the path of the loaded config file.
- `configDescriptor`: the config file contents before rule modules are loaded.
- `config`: the validated config with loaded rule modules.

`loadConfigDescriptor(options)` returns a promise for `{ ok, configFilePath, configDescriptor }` without loading or validating rule modules.

Both functions accept `cwd` to choose the directory in which to search for a config file, or `configFilePath` to select a config file explicitly. See the exported `SecretLintConfigLoaderOptions`, `SecretLintConfigLoaderResult`, and `SecretLintConfigLoaderRawResult` types for the complete interfaces.

If the config file cannot be found or read, the promise rejects. `loadConfig` also rejects if the config is invalid or a rule module cannot be loaded. Handle these errors with `try`/`catch`.

### Example

Use an ES module (`.mjs`, or `.js` with `"type": "module"` in `package.json`):

```js
import { loadConfig } from "@secretlint/config-loader";

try {
    // Load a config file such as <CurrentDir>/.secretlintrc.json
    const { config, configFilePath } = await loadConfig({ cwd: process.cwd() });
    console.log("load from configFile:" + configFilePath);
    console.log("config", config);
} catch (error) {
    console.error(error);
}
```

## Terminology

- ConfigDescriptor: config file literal that is not loaded yet
- Config: loaded object

## Workflow

- Validate `ConfigDescriptor`
- Load `ConfigDescriptor` and create `Config` object - imports each rule modules
- Validate Loaded `Config` with `ConfigDescriptor`
    - Invalid option, Invalid allowMessageIds, Invalid id specify for a preset 
- If all validation is passed, get a Config.

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
