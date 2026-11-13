# Configuration loading design

[日本語](design.ja.md)

## About this document

This document describes how `@secretlint/config-loader` resolves the rule ids of [Configuration loading](requirements.md) to rules.
The parent Product is [Secretlint](../../product.md).
Like the Requirements, it covers only the resolution of rule ids.

### Audience

People and agents who change how rules are found and loaded.

### Prerequisites

Node.js module resolution, and the exports of rule packages described in [Rules and rule presets](../rules-and-presets/requirements.md).

### Outside this document

Finding and validating the configuration file, and running the loaded rules in `@secretlint/core`.

## Implementation approach

`loadConfig()` reads the configuration file into a configuration descriptor, and `loadPackagesFromConfigDescriptor()` turns each rule entry of the descriptor into an entry with a rule creator.
The result is the configuration of `@secretlint/core`, which runs the creators without knowing where they came from.

For each rule entry, the loader takes the creator from the first of these that applies:

1. `testReplaceDefinitions`: a list of `{ id, rule }` that a caller passes to replace a rule id with a creator. `@secretlint/tester` uses it so that a test runs the rule under development instead of an installed package.
2. The built-in table of `@secretlint/core`. `resolveBuiltinRule()` imports `@secretlint/core/builtin` with `await import()`, and calls `getBuiltinRule()` with the id, and then with `createFullPackageName("secretlint-rule-", id)`.
3. The npm package of the rule id. `SecretLintModuleResolver.resolveRulePackageName()` makes the full package name with `createFullPackageName("secretlint-rule-", id)`, and tries it and then the id itself with `tryResolve()` of `@secretlint/resolver`. `dynamicImport()` of `@secretlint/resolver` imports the module, and the loader takes its `creator` export.

A creator with `meta.type: "preset"` becomes a preset entry with the `rules` of its descriptor entry. Other creators become rule entries with `options`, `severity`, `disabled`, and `allowMessageIds`.
The `id` of the descriptor entry is copied to the result, which is why the messages keep the id written in the configuration file.

### Resolver hooks

`@secretlint/resolver` runs the resolve hooks and the import hooks that a program registered before it falls back to `require.resolve()` and `import()`.
A hook can return a fixed URL for a package name, and the import hook can return the exports of a module that is already loaded.
This lets a bundled program, such as the single-executable binary, provide packages that are not in a `node_modules` directory. Built-in rules do not need hooks, because they are found before the resolver runs.

### Failures

An error of one entry is collected, and the loader continues with the other entries. After all entries, the loader throws an `AggregationError` with all errors, each prefixed with `Failed to load rule module: <id>`.
After loading, the configuration is validated together with the creators, because `allowMessageIds` needs the messages of the rule.

## Architecture and sequence diagrams

```mermaid
sequenceDiagram
    participant CLI as secretlint (CLI)
    participant Loader as config-loader
    participant Resolver as @secretlint/resolver
    participant Core as @secretlint/core
    CLI->>Loader: loadConfig()
    loop each rule entry
        Loader->>Loader: testReplaceDefinitions?
        Loader->>Core: getBuiltinRule(id, then full id)
        Loader->>Resolver: tryResolve(full package name, then id)
        Resolver-->>Loader: path or URL (hooks first)
        Loader->>Resolver: dynamicImport()
        Resolver-->>Loader: exports.creator
    end
    Loader-->>CLI: configuration with creators
    CLI->>Core: lintSource(config)
```

## Data model and ER diagrams

- **Configuration descriptor:** the parsed configuration file. A rule entry has `id`, `options`, `severity`, `disabled`, `allowMessageIds`, and for a preset `rules`.
- **Core configuration:** the same entries with `rule`, the creator, added.

## APIs and interfaces

- `loadConfig({ cwd, configFilePath, node_moduleDir, testReplaceDefinitions })` returns `{ ok, config, configDescriptor, configFilePath, messages }`.
- `loadPackagesFromConfigDescriptor({ configDescriptor, node_moduleDir, testReplaceDefinitions })` does the same from a descriptor that is already read.
- `node_moduleDir` is the base directory that `SecretLintModuleResolver` joins with the package name.

## External service integration

None.

## Data handling

The loader reads the configuration file and the modules of the packages. It does not write files.

## Authentication and authorization notes

None. Packages are imported with the permissions of the process.

## Security considerations

Importing a package runs its code, so the loader imports only the package names that the configuration file lists.

## Deployment notes

None.

## Alternatives considered

- **Resolve built-in rules with resolver hooks:** The binary did this for its packages. It was not chosen, because every program would have to register the hooks, and the npm package would still need the packages installed.
- **Let an installed package win over the built-in rule:** It was not chosen, so that the rules always have the version of the installed Secretlint, and an older preset package does not hide new rules.

## Open questions

None.
