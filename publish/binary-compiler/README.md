# @secretlint/binary-compiler

Single executable binary compiler for secretlint using [bun](https://bun.sh/)

## Supported Platform

[Releases page](https://github.com/secretlint/secretlint/releases) includes the following platform binaries:

| Platform | Arch  | FileName                               | 
|----------|-------|----------------------------------------|
| Linux    | x64   | `secretlint-<version>-linux-x64`       |
| Linux    | arm64 | `secretlint-<version>-linux-arm64`     |
| Windows  | x64   | `secretlint-<version>-windows-x64.exe` |
| macOS    | x64   | `secretlint-<version>-darwin-x64`      |
| macOS    | arm64 | `secretlint-<version>-darwin-arm64`    |

Checksum files are available as `secretlint-<version>-sha256sum.txt`

## Built-in Rules

This binary includes the following rules:

- [@secretlint/secretlint-rule-preset-recommend](https://www.npmjs.com/package/@secretlint/secretlint-rule-preset-recommend)
- [@secretlint/secretlint-rule-pattern](https://www.npmjs.com/package/@secretlint/secretlint-rule-pattern)
- [@secretlint/secretlint-formatter-sarif](https://www.npmjs.com/package/@secretlint/secretlint-formatter-sarif)

## CURRENT PROBLEM

- output binary does not be code-sign.
- `--version` does not work because `package.json` is not included in the binary.

## Usage

```bash
#!/usr/bin/env bash
set -euo pipefail
# Get current architecture
SECRET_LINT_VERSION="x.x.x"
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
# Map architecture to the expected format
case "$ARCH" in
    x86_64)
        ARCH="x64"
        ;;
    aarch64)
        ARCH="arm64"
        ;;
    arm64)
        ARCH="arm64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

# Download the binary
curl -sSL "https://github.com/secretlint/secretlint/releases/download/$(SECRET_LINT_VERSION)/secretlint-$(SECRET_LINT_VERSION)-$(OS)-$(ARCH)" -o secretlint
chmod +x secretlint
# init .secretlintrc.json
echo '{
  "rules": [
    {
      "id": "@secretlint/secretlint-rule-preset-recommend"
    }
  ]
}' > .secretlintrc.json
# Run secretlint
./secretlint "**/*"
```

## Changelog

See [Releases page](https://github.com/secretlint/secretlint/releases).

## Development

```bash
# build secretlint using Node.js
yarn install
yarn run build
# build binary using bun
cd publish/binary-compiler
bun run build-binary
./dist/secretlint-<version>-<platform>-<arch> --help
```

## Running tests

Run --help and "**/*" check using current binary.

```sh
bun run test
```

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
