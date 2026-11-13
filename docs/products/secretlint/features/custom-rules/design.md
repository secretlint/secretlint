# Custom rules design

[日本語](design.ja.md)

## About this document

This document describes how a custom rule package is laid out and how `@secretlint/tester` runs the snapshot tests of [Custom rules](requirements.md).
The parent Product is [Secretlint](../../product.md).

### Audience

People and agents who write or test a rule, or change `@secretlint/tester`.

### Prerequisites

The rule interface of `@secretlint/types`, and the Node.js test runner (`node:test`).

### Outside this document

The configuration loader that the tester uses for the configuration of a case, and `@secretlint/core`, which runs the rule.

## Implementation approach

A custom rule is a package with its tests next to its code, and `@secretlint/tester` turns each directory of its snapshot directory into one test.

### Layout of a custom rule package

```text
packages/@secretlint/secretlint-rule-<name>/
  README.md
  package.json        # name is the rule id; @secretlint/tester is a devDependency
  src/index.ts        # exports creator and messages
  test/
    index.test.ts     # calls snapshot() of @secretlint/tester
    snapshots/<case>/ # input*, output.json, optional .secretlintrc.json and options.*
```

The custom rules published by Secretlint have this layout.
The test script of the package runs `test/index.test.ts` with `node --import tsx --test`, and `updateSnapshot` runs it with `UPDATE_SNAPSHOT=1`.

### Running a test case

The checks of a case are in the runner `@secretlint/core/testing`, which the tests of the built-in rules also use. `@secretlint/tester` wraps it, and gives it the reading of the input file and the loading of the configuration file.

`snapshot(options)` reads the snapshot directory and returns an object whose `forEach(handler)` calls the handler with the name of each case and a function that runs it.
The test file passes the function to `t.test()` and skips the test when it returns `"skip"`.

The function of a case does the following:

1. Load the options of the case (`options.js`, `options.json`, or `options.ts`) and choose the input file.
2. If the case has `.secretlintrc.json`, load it with `loadConfig()` of `@secretlint/config-loader`, passing the rules under test as `testReplaceDefinitions`. Otherwise use the default configuration.
3. Read the input file with `createRawSource()` of `@secretlint/source-creator`, which gives the bytes and the content type, and lint it with `lintSource()` of `@secretlint/core`.
4. Lint the content again as a string without the bytes, and again with a configuration in which each rule has no `meta.keywords` and each pattern has no keywords and the `file` scope. Compare both with the first result with `assert.deepStrictEqual`.
5. Add the content of the text source to the result as `sourceContent`, because the lint result does not have it. If `output.json` does not exist or the snapshots are updated, write the result with sorted keys and the `[SNAPSHOT]` path, and return `"skip"`. Otherwise compare the result with `output.json`.

Step 4 is how a wrong keyword or a `line` scope that needs other lines makes the test fail, because the unoptimized result reports a secret that the optimized result missed.

### Presets

A third-party preset can be tested with the same `snapshot()`, with one snapshot directory per rule of the preset. The built-in presets are tested in `@secretlint/core`, not with `@secretlint/tester`.

## Architecture and sequence diagrams

```mermaid
sequenceDiagram
    participant Test as test/index.test.ts
    participant Tester as @secretlint/tester
    participant Loader as config-loader
    participant Core as @secretlint/core
    Test->>Tester: snapshot(options).forEach(handler)
    loop each case
        Tester->>Loader: loadConfig(.secretlintrc.json, testReplaceDefinitions)
        Tester->>Core: createSnapshotTestCases() of @secretlint/core/testing
        Core->>Core: lintSource(bytes), lintSource(string), lintSource(unoptimized)
        Core->>Core: compare results and output.json
    end
```

## Data model and ER diagrams

- **SnapshotOptions:** `snapshotDirectory` (path or URL), `defaultConfig`, optional `testDefinitions`, and `updateSnapshot`.
- **SecretLintTestCaseOptions:** optional `inputFilePath`.

## APIs and interfaces

`@secretlint/tester` exports `snapshot()` and the types `SnapshotOptions` and `SecretLintTestCaseOptions`.
Its dependencies are `@secretlint/core`, `@secretlint/config-loader`, `@secretlint/source-creator`, and `@secretlint/types`.
The API is the same as before the runner moved to `@secretlint/core`, so the tests of a custom rule do not change.

## External service integration

None for testing. A custom rule of the Secretlint repository is published by the release workflow of the repository.

## Data handling

The tester reads the files of the snapshot directory and writes `output.json` only when the snapshot is missing or updated.

## Authentication and authorization notes

None.

## Security considerations

The repository runs Secretlint on its changed files in CI. The test inputs contain dummy secrets, and `.secretlintignore` of the repository excludes `**/packages/**/test/**` from that check.

## Deployment notes

The packages of the Secretlint repository are published with npm trusted publishing. To publish a new package, an empty package has to be published first and its trusted publisher set up on npm by hand before the first release, which is why a new rule of Secretlint is added as a built-in rule instead of a new custom rule package.

## Alternatives considered

There is no record of alternatives to snapshot tests with one directory per case.

## Open questions

None.
