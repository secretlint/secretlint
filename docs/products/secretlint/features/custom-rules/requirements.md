# Custom rules

[日本語](requirements.ja.md)

## About this document

A rule author creates a rule for a kind of secret, tests it with snapshot tests, and publishes it as an npm package.
The same steps are used for a third-party rule and for a rule added to the Secretlint repository.
The parent Product is [Secretlint](../../product.md).

### Scope

- Creating a rule package, both a third-party rule and a rule of the Secretlint repository
- Testing a rule with snapshot tests (`@secretlint/tester`)
- Checking that the declared keywords and scope of a rule do not change its results

### Out of scope

- The rule interface itself, and how `@secretlint/core` runs a rule
- How a rule id is resolved to the package: [Configuration loading](../config-loading/requirements.md)
- Which rules Secretlint provides, and the presets: [Rules and rule presets](../rules-and-presets/requirements.md)
- Publishing a third-party rule, which is up to its author

## User stories

### Test a rule with input files and expected results

As a rule author, I want to write a test case as an input file and get the expected result written for me, so that I can see what the rule reports and notice when it changes.

**Acceptance criteria:**

Scenario: When a test case has no expected result, the result is written

- Given: The snapshot directory of the rule has `ng.secret/input.txt` and no `ng.secret/output.json`.
- When: The rule author runs the tests.
- Then: `ng.secret/output.json` is written with the result of the rule, and the test case is reported as skipped.

Scenario: When the result differs from the expected result, the test fails

- Given: `ng.secret/output.json` exists, and the rule now reports a different range.
- When: The rule author runs the tests.
- Then: The test case fails and shows the difference between the result and `output.json`. `output.json` is not changed.

Scenario: When the rule author updates the snapshots, the expected results are rewritten

- Given: The rule was changed on purpose.
- When: The rule author runs the tests with `UPDATE_SNAPSHOT=1`.
- Then: Every `output.json` of the snapshot directory is rewritten with the new result.

### Test a rule with options

As a rule author, I want a test case to have its own configuration or input file name, so that I can test options and file names such as `.npmrc`.

**Acceptance criteria:**

Scenario: When a test case has a configuration file, the case uses it

- Given: A test case has `.secretlintrc.json` that sets `allows` for the rule.
- When: The rule author runs the tests.
- Then: The case is linted with that configuration, and the rule id in it runs the rule under test, not an installed package.

Scenario: When a test case names its input file, that file is linted

- Given: A test case has `options.ts` with `inputFilePath: ".npmrc"`.
- When: The rule author runs the tests.
- Then: `.npmrc` of the case is linted.

### Notice wrong keywords or scope

As a rule author, I want the tests to fail when the keywords or the scope of my patterns make the rule miss a secret, so that the optimizations never change what the rule reports.

**Acceptance criteria:**

Scenario: When a match does not contain any keyword, the test fails

- Given: A pattern of the rule has a keyword that one input of the tests does not contain, and the pattern matches that input.
- When: The rule author runs the tests.
- Then: The test case fails with a message that the result with `patterns` and `meta.keywords` differs from the result of the whole content, and asks to check the keywords and scope.

### Add a rule to the Secretlint repository

As a rule author, I want to generate the files of a new rule in the Secretlint repository, so that it follows the conventions of the other rules.

**Acceptance criteria:**

Scenario: When the rule author generates a rule, a new rule package is created

- Given: The rule author is in the Secretlint repository.
- When: The rule author runs `pnpm run gen:rule` and enters the name `example`.
- Then: `packages/@secretlint/secretlint-rule-example/` is created with its README, LICENSE, `package.json`, `tsconfig.json`, `src/index.ts`, `test/index.test.ts`, and the test cases `ng.secret` and `ok.valid`.

## KPIs

None. No metric has been defined for rule authoring.

## Functional requirements

### Snapshot testing

**Overview:** `@secretlint/tester` lints each test case of a snapshot directory with the rule and compares the result with `output.json`.

**Input:** The snapshot directory, the default configuration with the rule under test, and whether to update the snapshots.

**Output:** One test per test case directory, which passes, fails with a difference, or is skipped after writing `output.json`.

#### Applicable conditions

##### Test cases

Each directory of the snapshot directory whose name does not start with `.` is a test case.
The case is linted from its file whose name starts with `input`, or from `inputFilePath` of `options.js`, `options.json`, or `options.ts`.
A case without `.secretlintrc.json` uses the default configuration.

##### Rules in the configuration of a case

The rule ids of the default configuration, or the `testDefinitions` that the test gives, replace the installed packages of the same ids.

##### Checks of every case

Each case is also linted from the content as a string and with the patterns run on the whole content without keywords and scope. Both results must equal the first result.

##### Paths in the results

The path of the snapshot directory in `filePath` is replaced with `[SNAPSHOT]`, and path separators are `/`, so the results are the same on every OS.

#### Exceptional behavior

##### A case has no input file

The test case fails with an error that names the case directory.

### Rule package

**Overview:** A rule is an npm package that exports `creator` and `messages`, and a README that documents it.

**Input:** The name of the rule and the kind of secret.

**Output:** A package whose name is the rule id.

#### Applicable conditions

##### Rules of the Secretlint repository

A rule of the repository is a package `@secretlint/secretlint-rule-<name>` with its own tests. Adding it to the canary preset is a separate step.

## Data requirements

### Required data

- **Test case:** An input file, an optional configuration, an optional input file name, and the expected result.

### Relationships

A snapshot directory belongs to one rule or preset, and has many test cases.

### Personal information

None. Test inputs contain dummy secrets, not real ones.

## External service dependencies

- **npm registry**
  - **Related user stories:** Add a rule to the Secretlint repository
  - **Reason for dependency:** A rule is published as an npm package.
  - **Contractual and usage decisions:** Public packages, free of charge.

## Security considerations

Test inputs must not contain real secrets.

## Open questions

None.
