# @secretlint/config-loader

Config loader for secretlint.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/config-loader

## Usage

### API Interface

```ts 
import { SecretLintConfigDescriptor, SecretLintCoreDescriptor } from "@secretlint/types";
export declare type SecretLintConfigLoaderOptions = {
    cwd?: string;
};
export declare type SecretLintConfigLoaderResult = {
    ok: true;
    configFilePath: string;
    config: SecretLintCoreDescriptor;
} | {
    ok: false;
    configFilePath: null;
    config: null;
    errors: Error[];
};
export declare type SecretLintConfigLoaderRawResult = {
    ok: true;
    configFilePath: string;
    config: SecretLintConfigDescriptor;
} | {
    ok: false;
    errors: Error[];
};
/**
 * Load config file and return config object that is loaded rule instance. 
 * @param options
 */
export declare const loadConfig: (options: SecretLintConfigLoaderOptions) => SecretLintConfigLoaderResult;
export declare const loadConfigRaw: (options: SecretLintConfigLoaderOptions) => SecretLintConfigLoaderRawResult;
```

### Example

```js 
impor { loadConfig } from "@secretlint/config-loader";
// Load <CurrentDir>/.secretlintrc.{json,yml,js}
const { ok, config, configFilePath, errors } = loadConfig({ cwd: process.cwd() });
if(ok) {
  console.log("load from configFile:" + configFilePath);
  console.log("config", config);
} else{
  console.error(errors);
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
