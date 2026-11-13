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

Publishing a new npm package with trusted publishing takes manual steps: publish an empty package first, set up its trusted publisher on npm, and only then release the rule. Writing the code of a rule is not enough to publish it, so adding rules this way does not scale.
A built-in rule is a directory in `@secretlint/core`, so adding one needs no new package.

### Rule directories

A built-in rule lives in `packages/@secretlint/core/src/builtin/rules/<name>/`, and its main module exports `creator` and `messages`.
`creator.meta` has the rule id `@secretlint/secretlint-rule-<name>`, the type (`scanner` or `filter`), `recommended`, `supportedContentTypes`, and `docs.url`, which points to the README of the rule in the repository.
`@secretlint/core` adds the message ID to `docs.url` to make the link of each message.

A rule that finds secrets with regular expressions declares `patterns`, and `@secretlint/core` runs them.
Other rules, such as the pattern rule and the GCP rule, implement `create()` and report with `context.report()`.

The built-in rules do not import Node.js modules at the top level, so that `@secretlint/core` loads in a browser.
A small `basename` helper replaces `node:path`.
The GCP rule checks a `.p12` file from `contentBytes` of the source, without reading the file. For the MAC of the file, it imports `node:crypto` only when it is available, and uses Web Crypto otherwise.
The pattern rule matches file paths with `picomatch` in the way `micromatch` did, so `micromatch` is no longer a dependency.

### Patterns that an option turns on or off

A pattern has the optional property `when`, the condition for the pattern to be a part of the lint.
`when: "name"` is true when the option `name` of the rule is `true`, and `when: "!name"` is true unless the option is `true`.
For example, the AWS rule has `when: "enableIDScanRule"` on its patterns of the access key ID and the account ID. The keywords of the account ID are common words such as `account`, so running the pattern only to discard its matches in `report()` took a large part of the lint of a repository that has the word in many files.

When `@secretlint/core` makes the lint plan of a configuration, it reads the options of each rule and leaves out the patterns whose `when` is false:

- A pattern without `when` is in the plan.
- `when` must match `!` (optional) and a name of letters, digits, `_`, and `$` that does not start with a digit. For any other value, making the plan throws an error with the rule id and the value. So a string with an operator that a newer core supports, such as `a && b`, is never read as the name of an option.
- The value of the option is read from the own property of the options of that name. A property that the options object inherits, such as `constructor`, is not an option. An option that is not set is `false`.
- If the value is set and is not a boolean, making the plan throws an error with the rule id and the name of the option. The core does not convert a value to a boolean.

The plan is made once for a configuration, so the option is read once, not for each file.
A pattern that is not in the plan has no entry in the keyword matcher, so its keywords do not make the core read a file as a string, and its regular expression never runs.
`report()` of a pattern does not check the option again.

The type of the property is `SecretLintRulePatternWhen<Options>` of `@secretlint/types`: the names of the properties of `Options` whose value is a boolean (`SecretLintRulePatternBooleanOptionName<Options>`), and the same names after `!`, as a template literal type. A name of another option, or a name that is not an option, is a type error. If `Options` has no property, such as the default `{}` and `unknown`, the type is `string`.
The strings are the second type parameter of `SecretLintRulePattern`, `SecretLintRulePatternCreator`, and `SecretLintRuleCreator`, and its default is computed from `Options`, so a rule does not pass it. If the type of the property used `Options` directly, a rule creator with its own `Options` would not be assignable to `SecretLintRuleCreator<unknown>`, because TypeScript does not accept a type that uses the names of the properties of `Options` in place of the one of `unknown`. As a type parameter of its own, the strings of a rule are assignable to `string`, the strings of `SecretLintRuleCreator<unknown>`. So a list of rules with different options, such as `rules` of a preset creator and `builtinRules`, stays `SecretLintRuleCreator<unknown>[]`.

`when` is one of the properties of a pattern that the core knows, and the core throws on an unknown property. The runner `@secretlint/core/testing` keeps `when` when it removes the keywords and the scope for its comparison, because the property decides what the rule reports and is not an optimization.

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

The snapshot test cases are in `packages/@secretlint/core/test/builtin/rules/<name>/snapshots/`.
They run with the runner `@secretlint/core/testing`, which checks each case in the same way as `@secretlint/tester`: the results of the bytes source, the string source, and the rule without its keywords optimization must be the same.
The runner is in `@secretlint/core` because `@secretlint/tester` depends on `@secretlint/core`, so the tests of `@secretlint/core` cannot use `@secretlint/tester` without a cycle in the workspace.
`@secretlint/tester` wraps the runner, and adds the loading of the configuration file through the configuration loader.

In the tests of `@secretlint/core`, the configuration files of the test cases name rule ids, and the runner looks them up with `getBuiltinRule`.
A test fails when a rule directory has no snapshot directory.
The presets have no test cases of their own. Their test runs each test case of each rule in the preset through the preset, with the options of the rule under the preset entry, and checks two things: the messages of the rule are the same as the `output.json` of the rule, with `ruleParentId` of the preset, and an `ok.*` case has no message of any rule in the preset. The second check finds a rule of the preset that reports a value that another rule treats as valid.
Before, the test cases of the rules were copied into a snapshot directory of each preset by a script. The copies had the same content except `ruleParentId`, and had to be copied again when a rule changed, so the test reads the cases of the rules instead.

`pnpm run gen:rule` creates the rule directory, its README, and the test cases `ng.secret` and `ok.valid` in `@secretlint/core`.

## Architecture and sequence diagrams

No diagram is needed: a preset is a list of rules, and its only interaction is `registerRule()` during the setup of a lint.

## Data model and ER diagrams

- **Rule creator:** `meta` (id, type, recommended, supportedContentTypes, docs.url, optional keywords), `messages`, and either `patterns` or `create()`.
- **Pattern:** `pattern`, optional `keywords`, `caseSensitiveKeywords`, `scope`, and `when`, and `report()`.
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

- **One package per rule, with the rules bundled into the presets:** This was the design before the change. Each new rule needed a new npm package, and publishing it took the manual steps of trusted publishing described above.
- **One separate package for the built-in rules:** The rules and their tests would be in a package next to `@secretlint/core`, as Biome keeps its rules in a crate separate from its engine. It was not chosen, because the rules and the engine must have the same version. `@secretlint/core` runs the `patterns` that the rules declare, and a new rule on an older engine is not supported, so a separate package could be installed in a version that does not match `@secretlint/core`. With one package, the rules always come with the engine that runs them, and only one package has to be published and installed. The rules, the engine, and the tests are in one package, as oxlint and ESLint do.
- **A function `enabled(options)` on a pattern:** The pattern would have a function that returns whether it is enabled. It can express any condition, but it was not chosen. A rule states what it finds as data and `@secretlint/core` runs it, and a function hides from the core which option it reads. Each rule would also write its own condition, so the same value of an option, such as the string `"true"`, could enable a pattern in one rule and not in another. With `when`, the condition is in one place in the core, the name is checked by the type, and the data can be listed or passed to another thread.
- **Two properties, `enabledByOption` and `disabledByOption`:** Each would have the name of an option. It was not chosen, because a pair of properties for one condition grows with each new kind of condition, and a pattern could have both. One condition with `!` writes both, as the `when` clause of VS Code and CEL do.
- **An expression language such as CEL:** The condition would be any expression of the options. It was not chosen: an evaluator adds a dependency and size to `@secretlint/core`, which also runs in browsers, a free expression can not be checked by the type of the options, and the only use today is one boolean option. `when` is written so that it reads as a subset of such a language, and the core rejects what it does not support, so operators can be added later.
- **Reading a truthy value as true:** The string `"true"` enabled the patterns of the AWS rule when the rule checked the option in `report()`. It was not kept, because `when` is a new property with no behavior to keep, and a condition on a boolean should not depend on how each value converts. A configuration with such a value stops with an error instead of changing its result silently.
- **Returning early in `report()` when the option is not set:** This was the design before the change. The result is the same, but the keywords of the pattern were searched, the file was read as a string, and the pattern ran on it, only to discard every match.

## Open questions

None.
