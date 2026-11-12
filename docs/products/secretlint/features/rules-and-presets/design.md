# Rules and rule presets design

[日本語](design.ja.md)

## About this document

This document describes how the built-in rules and presets of [Rules and rule presets](requirements.md) are built, tested, and distributed.
The parent Product is [Secretlint](../../product.md).

### Audience

People and agents who add or change a built-in rule or a built-in preset.

### Prerequisites

The rule interface of `@secretlint/types` (`SecretLintRuleCreator` and `SecretLintRulePresetCreator`), and the pnpm workspace of this repository.

### Outside this document

- How the configuration loader finds a rule from its rule id: [Configuration loading](../config-loading/requirements.md)
- How a custom rule is created and tested: [Custom rules](../custom-rules/requirements.md)
- How `@secretlint/core` runs rules (the lint plan and the scan of keywords)

## Implementation approach

The built-in rules and presets are part of `@secretlint/core`, together with the engine that runs them and their tests.
`@secretlint/core` has a table from rule id to rule, and the configuration loader looks up this table before it looks for a package.
The packages of the same names stay as thin packages that re-export the rules from `@secretlint/core`.

Adding a rule as a new npm package needs a manual setup of the package on npm, such as its trusted publisher, before the first release.
A built-in rule is a directory in `@secretlint/core`, so adding one needs no new package.

### Rule directories

A built-in rule lives in `packages/@secretlint/core/src/builtin/rules/<name>/`, and its main module exports `creator` and `messages`.
`creator.meta` has the rule id `@secretlint/secretlint-rule-<name>`, the type (`scanner` or `filter`), `recommended`, `supportedContentTypes`, and `docs.url`, which points to the README of the rule in the repository.
`@secretlint/core` adds the message ID to `docs.url` to make the link of each message.

A rule that finds secrets with regular expressions declares `patterns`, and `@secretlint/core` runs them.
Other rules, such as the pattern rule and the GCP rule, implement `create()` and report with `context.report()`.

The built-in rules do not import Node.js modules at the top level, so that `@secretlint/core` loads in a browser.
A small `basename` helper replaces `node:path`.
The GCP rule imports `node:fs` and `node:crypto` only when it checks a `.p12` file, and uses Web Crypto when `node:crypto` is not available.
The pattern rule matches file paths with `picomatch` in the way `micromatch` did, so `micromatch` is no longer a dependency.

### The built-in table and the presets

`@secretlint/core/builtin` exports the lists `builtinRules`, `recommendedRules`, and `canaryRules`, the presets `presetRecommend` and `presetCanary`, and `getBuiltinRule(id)`, which returns the rule or preset for a full rule id, or `undefined`.

Both presets are made by one `createPreset(id, rules)`. A preset has `meta.type: "preset"`, its list of rules as `rules`, and a `create()` that calls `context.registerRule()` for each rule in order.
`@secretlint/core` matches each registered rule with the `rules` entries of the preset entry by rule id, and applies its `options`, `severity`, and `allowMessageIds`.
A rule whose entry has `disabled: true` is not registered, in the same way as a top-level entry with `disabled: true`.

`canaryRules` is the source of the rule list. A new rule is added to `canaryRules` first, and to `recommendedRules` in a major release.
Currently `canaryRules` is a copy of `recommendedRules`.

### Packages of the same names

Each package `@secretlint/secretlint-rule-<name>` of a built-in rule re-exports `@secretlint/core/builtin/rules/<name>`.
The preset packages export `creator` and `rules` from `@secretlint/core/builtin`.
These packages depend on `@secretlint/core` of the same version, and have no tests of their own.

### Tests

The snapshot test cases are in `packages/@secretlint/core/test/builtin/rules/<name>/snapshots/` and `packages/@secretlint/core/test/builtin/presets/{recommend,canary}/snapshots/`.
They run with the runner `@secretlint/core/testing`, which checks each case in the same way as `@secretlint/tester`: the results of the bytes source, the string source, and the rule without its keywords optimization must be the same.
The runner is in `@secretlint/core` because `@secretlint/tester` depends on `@secretlint/core`, so the tests of `@secretlint/core` cannot use `@secretlint/tester` without a cycle in the workspace.
`@secretlint/tester` wraps the runner, and adds the loading of the configuration file through the configuration loader.

In the tests of `@secretlint/core`, the configuration files of the test cases name rule ids, and the runner looks them up with `getBuiltinRule`.
A test fails when a rule directory has no snapshot directory.
The `sync-preset-snapshots` script copies the test cases of each rule into the preset snapshots.

`pnpm run gen:rule` creates the rule directory, its README, and the test cases `ng.secret` and `ok.valid` in `@secretlint/core`.

## Architecture and sequence diagrams

No diagram is needed: a preset is a list of rules, and its only interaction is `registerRule()` during the setup of a lint.

## Data model and ER diagrams

- **Rule creator:** `meta` (id, type, recommended, supportedContentTypes, docs.url, optional keywords), `messages`, and either `patterns` or `create()`.
- **Preset creator:** `meta` (id, type `preset`), `rules` (rule creators), and `create(context, options)`.
- **Preset entry of the configuration:** `id`, `options`, and `rules`, a list of entries with `id`, `options`, `severity`, `allowMessageIds`, and `disabled`.

## APIs and interfaces

- `@secretlint/core/builtin`: `builtinRules`, `recommendedRules`, `canaryRules`, `presetRecommend`, `presetCanary`, `getBuiltinRule(id)`, and `builtinRuleIds`.
- `@secretlint/core/builtin/rules/<name>`: `creator` and `messages` of one rule.
- `@secretlint/core/testing`: `createSnapshotTestCases(options)`, which returns the test cases of a snapshot directory.
- The packages of the same names export the same `creator` and `messages`, or `creator` and `rules` for a preset.

## External service integration

`@secretlint/core` and the packages of the same names are published to the npm registry from the release workflow of the repository.

## Data handling

Rules receive the content of one file from `@secretlint/core` and return messages. They do not store or send content.

## Authentication and authorization notes

None. Rules run with the permissions of the process that runs Secretlint.

## Security considerations

A regular expression of a rule limits its repetition so that a crafted file does not make the scan take too long.

## Deployment notes

The packages of the same names are still published, so a configuration or a `package.json` that names them keeps working. Deprecating them is a separate change.
The `--init` of the npm package writes the rules that it finds in `package.json`. Until it writes the recommended preset without them, the documentation still tells users to install the preset package.

## Alternatives considered

- **One package per rule, with the rules bundled into the presets:** This was the design before the change. Each new rule needed a new npm package and its manual setup on npm.
- **One separate package for the built-in rules:** The rules and their tests would be in a package next to `@secretlint/core`, as Biome keeps its rules in a crate separate from its engine. It was not chosen. The rules, the engine, and the tests are in one package, as oxlint and ESLint do.

## Open questions

None.
