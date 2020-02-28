# @secretlint/config-validator

.secretlintrc config validation library

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @secretlint/config-validator

## Usage

```ts
import { validateRawConfig } from "@secretlint/config-validator";
import fs from "fs";
const secretlintrc = require("./.secretlintrc.json");
const { ok, error } = validateRawConfig(secretlintrc);
if (!ok) {
  console.error(error);
}
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
