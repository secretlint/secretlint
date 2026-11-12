# Single-executable binary design

[日本語](design.ja.md)

## About this document

This document describes how the binary of [Single-executable binary](requirements.md) is built and how it provides its built-in rules and formatter.
The parent Product is [Secretlint](../../product.md).

### Audience

People and agents who change the binary, its built-in rules and formatter, or its release.

### Prerequisites

`bun build --compile`, and the resolver hooks of `@secretlint/resolver` described in [Configuration loading](../config-loading/requirements.md).

### Outside this document

The CLI itself (`secretlint/cli`), which the binary runs.

## Implementation approach

The binary is the `secretlint` CLI compiled by Bun into one executable, with resolver hooks that serve the SARIF formatter from the executable instead of `node_modules`. The built-in rules come with `@secretlint/core`, which Bun bundles as a part of the CLI.
The sources are in `publish/binary-compiler/`.

### Entry point

`src/entry.ts` first imports `src/secretlint-resolver-hooks.ts`, then handles `--init` and `--version` itself, and runs `run()` of `secretlint/cli` for everything else.

`--init` writes a fixed `.secretlintrc.json` with the recommended preset and the pattern rule, because the Node.js `--init` reads the rule packages of `package.json`, which a binary user does not have.
It keeps the `--cwd` handling and the existing-config check of the Node.js CLI, and writes with the `wx` flag so that a file created at the same moment is not overwritten.
`--version` prints `SECRETLINT_VERSION`, which `build-binary.sh` inlines at compile time.

### Built-in rules and formatter

The built-in rules need no hook: the configuration loader finds them in the built-in table of `@secretlint/core` before it resolves a package, and Bun bundles `@secretlint/core` with the CLI.
So every built-in rule and preset, and their short forms, work in the binary in the same way as in the npm package.

`src/secretlint-resolver-hooks.ts` imports `@secretlint/secretlint-formatter-sarif` statically, so Bun bundles it into the executable.
It registers a resolve hook that returns the package name itself as the URL for this name, and an import hook that returns the imported module for it.
The formatter loader resolves and imports names through `@secretlint/resolver`, so this name never reaches the file system. Other names fall through to the normal resolution.

### Build and release

`build-binary.sh` runs `bun build --compile` for each of `linux-x64`, `linux-arm64`, `windows-x64`, `darwin-x64`, and `darwin-arm64`, and writes `secretlint-<version>-sha256sum.txt`.
The `publish-binary` job of the release workflow builds and uploads them to the GitHub release after the npm packages are published.
`test.sh` checks `--init`, `--init` with an existing configuration and with `--cwd`, `--version`, `--help`, linting `**/*`, and that a large output of the `mask-result` formatter is written completely.

## Architecture and sequence diagrams

```mermaid
sequenceDiagram
    participant Entry as entry.ts
    participant Hooks as resolver hooks
    participant CLI as secretlint/cli
    participant Loader as config-loader
    Entry->>Hooks: register (sarif)
    Entry->>CLI: run()
    CLI->>Loader: loadConfig()
    Loader->>Loader: getBuiltinRule("@secretlint/secretlint-rule-preset-recommend")
    CLI->>Hooks: resolve "@secretlint/secretlint-formatter-sarif"
    Hooks-->>CLI: bundled module
```

## Data model and ER diagrams

None. The hooks map one package name, `@secretlint/secretlint-formatter-sarif`, to its module.

## APIs and interfaces

The interface is the command line of `secretlint`, plus `--init` and `--version` as described above.

## External service integration

GitHub Releases, through the release workflow.

## Data handling

Same as the CLI. `--init` writes one file in the working directory.

## Authentication and authorization notes

None.

## Security considerations

The binaries are not code-signed. The checksum file lets a user verify a download.

## Deployment notes

The version of `@secretlint/core` and the formatter is the version in the workspace at build time, so the binary and the npm packages of the same release have the same rules.

## Alternatives considered

Before the built-in rules moved into `@secretlint/core`, the binary served the recommended preset and the pattern rule with resolver hooks too. Only the packages in the hooks were available, so the canary preset and the rules by their own ids were not. Finding the rules in `@secretlint/core` removes that difference.

## Open questions

None.
