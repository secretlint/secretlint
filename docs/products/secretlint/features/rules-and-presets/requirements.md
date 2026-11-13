# Rules and rule presets

[日本語](requirements.ja.md)

## About this document

Secretlint detects each group of secrets with a rule, and groups rules into the recommended preset and the canary preset.
Secretlint itself has these rules as built-in rules, so a repository enables a rule or a preset by its rule id in the configuration file without installing a package.
This document describes the built-in rules and presets, how they are identified, how a preset passes options to its rules, and how a built-in rule is added.
The parent Product is [Secretlint](../../product.md).

### Scope

- The built-in rules and their rule ids
- Using the built-in rules without installing a package, and the packages of the same names
- The recommended preset and the canary preset: which rules they contain and how they register them
- Options, severities, allowed messages, and disabling of the rules in a preset
- The documentation of each rule
- Adding a built-in rule to the Secretlint repository, and testing the built-in rules

### Out of scope

- What each rule detects. Each rule's documentation describes it.
- How a rule id in the configuration file is resolved to a rule: [Configuration loading](../config-loading/requirements.md)
- Creating, testing, and using a rule as an npm package: [Custom rules](../custom-rules/requirements.md)
- Suppressing reports with comments (the behavior of `@secretlint/secretlint-rule-filter-comments`), which belongs to the Ignoring by comment feature. It is not written yet.

## User stories

### Enable the recommended rules with one id

As a developer, I want to enable the recommended rules with one entry in the configuration file, so that I do not have to list each rule.

**Acceptance criteria:**

Scenario: When the configuration file lists the recommended preset, all rules of the preset run

- Given: Only `secretlint` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-preset-recommend" }`.
- When: The developer lints a file that contains an AWS access key and a GitHub token.
- Then: The result has a message of `@secretlint/secretlint-rule-aws` and a message of `@secretlint/secretlint-rule-github`.

Scenario: When the configuration file lists one rule, only that rule runs

- Given: Only `secretlint` is installed, and the configuration file has only `{ "id": "@secretlint/secretlint-rule-aws" }`.
- When: The developer lints a file that contains an AWS access key and a GitHub token.
- Then: The result has a message of `@secretlint/secretlint-rule-aws` and no message of `@secretlint/secretlint-rule-github`.

### Keep a configuration that installs the rule packages

As a developer who installed the preset package as the documentation said, I want my configuration and `package.json` to keep working, so that I do not have to change anything when I update Secretlint.

**Acceptance criteria:**

Scenario: When an older preset package is installed, the built-in preset of Secretlint runs

- Given: `package.json` has `secretlint` and an older version of `@secretlint/secretlint-rule-preset-recommend`, and the configuration file has the recommended preset.
- When: The developer lints a file that contains a secret that a rule added in the newer Secretlint detects.
- Then: The result has the message of that rule, because the preset of the installed Secretlint runs, not the installed package.

Scenario: When code imports a rule from its package, it gets the built-in rule

- Given: A program imports `creator` from `@secretlint/secretlint-rule-aws` of the same version as `@secretlint/core`.
- When: The program passes the creator to `@secretlint/core` and lints a file with an AWS access key.
- Then: The result is the same as the result of the built-in rule `@secretlint/secretlint-rule-aws`.

### Configure a rule in a preset

As a developer, I want to set the options or the severity of a rule in a preset, or disable it, so that I can reduce false positives in my repository without leaving the preset.

**Acceptance criteria:**

Scenario: When a preset entry has options for one of its rules, the rule uses them

- Given: The configuration file has the recommended preset with `"rules": [{ "id": "@secretlint/secretlint-rule-aws", "options": { "allows": ["<the key>"] } }]`.
- When: The developer lints a file that contains that AWS access key.
- Then: The result has no message of `@secretlint/secretlint-rule-aws` for the key.

Scenario: When a preset entry sets the severity of one of its rules, the messages of the rule have that severity

- Given: The configuration file has the recommended preset with `"rules": [{ "id": "@secretlint/secretlint-rule-github", "severity": "warning" }]`.
- When: The developer lints a file that contains a GitHub token.
- Then: The message of `@secretlint/secretlint-rule-github` has the severity `warning`, and the command does not fail because of it.

Scenario: When a preset entry disables one of its rules, the other rules still run

- Given: The configuration file has the recommended preset with `"rules": [{ "id": "@secretlint/secretlint-rule-github", "disabled": true }]`.
- When: The developer lints a file that contains an AWS access key and a GitHub token.
- Then: The result has a message of `@secretlint/secretlint-rule-aws` and no message of `@secretlint/secretlint-rule-github`.

Scenario: When a rule is listed both in a preset and on its own, loading fails

- Given: The configuration file has the recommended preset and `{ "id": "@secretlint/secretlint-rule-aws" }`.
- When: The developer runs Secretlint.
- Then: Secretlint stops with an error that says `@secretlint/secretlint-rule-aws` is already registered, and no file is linted.

### Try new rules early

As a developer, I want to use the rules that may be added to the recommended preset in the next major release, so that I can check them on my repository before they become recommended.

**Acceptance criteria:**

Scenario: When the configuration file lists the canary preset, the rules of the canary preset run

- Given: Only `secretlint` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-preset-canary" }`.
- When: The developer lints a file that contains a secret that a rule of the canary preset detects.
- Then: The result has a message of that rule.

### Read why a value is reported

As a developer, I want to read why a rule reports a value, so that I can decide whether it is a secret or a false positive.

**Acceptance criteria:**

Scenario: When a rule reports a message, the message links to the documentation of the rule

- Given: A rule that has documentation reports a message.
- When: The developer reads the result.
- Then: The message has a URL to the documentation of the rule and the message ID.

### Add a built-in rule to the Secretlint repository

As a rule author, I want to add a rule for a new kind of secret to Secretlint without creating an npm package, so that the rule can be released without setting up a new package on npm.

**Acceptance criteria:**

Scenario: When the rule author generates a rule, the files of a built-in rule are created

- Given: The rule author is in the Secretlint repository.
- When: The rule author runs `pnpm run gen:rule` and enters the name `example`.
- Then: The code and README of the rule, and the test cases `ng.secret` and `ok.valid`, are created in `@secretlint/core`, and no new package directory is created.

Scenario: When a built-in rule is registered, it is used by its rule id

- Given: The rule `example` is registered as a built-in rule and added to the canary preset.
- When: A developer lints with `{ "id": "@secretlint/secretlint-rule-example" }` or with the canary preset, without installing a package.
- Then: The rule `@secretlint/secretlint-rule-example` runs.

Scenario: When the tests of Secretlint run, the snapshot tests of every built-in rule run

- Given: Each built-in rule has a directory of snapshot test cases in `@secretlint/core`.
- When: The rule author runs the tests of `@secretlint/core`.
- Then: Each test case is checked in the same way as `@secretlint/tester` checks a custom rule, including the check of keywords and scope, and a built-in rule without a snapshot directory makes the tests fail.

## KPIs

### False positives of the recommended preset

- **Current value:** Not measured.
- **Target value:** The SLO of the [Product](../../product.md#sli-and-slo).
- **Measurement method:** Not decided. See the Open questions of the Product.
- **Measurement period:** Not decided.

## Functional requirements

### Rules

**Overview:** Each rule detects one group of secrets, or filters the reports of other rules.

**Input:** The content of a file, and the options of the rule.

**Output:** Messages with the rule id, the message ID, the range, the severity, and a link to the documentation.

#### Applicable conditions

##### Rule ids

Each built-in rule has the rule id `@secretlint/secretlint-rule-<name>`, which is also the name of its npm package.
The rule id is used in the configuration file and as `ruleId` of the messages.
The short form, such as `@secretlint/aws`, also names the built-in rule.

##### Provided rules

The built-in rules are the rules of the recommended preset, `@secretlint/secretlint-rule-pattern` (user-defined patterns), and `@secretlint/secretlint-rule-azure`.
The built-in presets are the recommended preset and the canary preset.
A rule that is not in a preset is used by listing its rule id.

Secretlint also publishes `@secretlint/secretlint-rule-no-dotenv`, `@secretlint/secretlint-rule-no-homedir`, `@secretlint/secretlint-rule-no-k8s-kind-secret`, and `@secretlint/secretlint-rule-secp256k1-privatekey` as custom rules. They are installed as packages, as described in [Custom rules](../custom-rules/requirements.md).

##### Installation

A built-in rule or preset is used without installing a package, with every way of running Secretlint: npm, the Docker image, the single-executable binary, and the quick start command.
When a package of the same name is installed, the built-in rule is used and the package is not loaded, so the rule always has the version of the installed Secretlint.

##### Packages of the same names

The packages `@secretlint/secretlint-rule-<name>` of the built-in rules, and the packages of the two presets, are still published. Each exports the same rule as the built-in rule of the same version, so code that imports `creator` from them keeps working.
Deprecating these packages is a separate change.

##### Browsers

The built-in rules can be loaded and run in a browser without Node.js modules. A rule that checks binary content, such as the GCP rule for a `.p12` file, uses the bytes that the caller passes with the source, and does not read the file.

##### Documentation

Each rule has a README that describes why it reports values, its messages, and its options.

### Rule presets

**Overview:** A preset is a rule that registers a fixed list of rules.

**Input:** The preset entry of the configuration file, with its `rules` list of options for its rules.

**Output:** The rules of the preset run as if each was listed, with the options from the preset entry.

#### Applicable conditions

##### Recommended preset

`@secretlint/secretlint-rule-preset-recommend` contains 28 rules, including `@secretlint/secretlint-rule-filter-comments`.
Adding a rule to the recommended preset makes Secretlint report more errors by default, so it is done in a major release.

##### Canary preset

`@secretlint/secretlint-rule-preset-canary` contains the rules that are planned for the recommended preset.
It does not follow Semantic Versioning: a rule can be added in a minor release.
Currently it has the same rules as the recommended preset.

##### Rules in a preset

An entry of the `rules` list of a preset entry is matched by rule id.
It can set `options`, `severity`, `allowMessageIds`, and `disabled` of that rule, in the same way as an entry of a rule that is not in a preset.
A rule whose entry has `disabled: true` does not run.
A rule without an entry runs with its default options.

#### Exceptional behavior

##### The same rule id registered twice

When a rule id is registered twice, for example by a preset and by its own entry, Secretlint stops with an error that names the rule id.

### Adding a built-in rule

**Overview:** A built-in rule is added as files of Secretlint, not as a new npm package.

**Input:** The name of the rule, its code, its README, and its snapshot test cases.

**Output:** A rule that is used by `@secretlint/secretlint-rule-<name>` without installing a package.

#### Applicable conditions

##### Registration

A new built-in rule is registered as a built-in rule and added to the canary preset. Adding it to the recommended preset is done in a major release.

##### Tests

The snapshot test cases of the built-in rules are in `@secretlint/core`, and the tests of `@secretlint/core` run them. The tests of the presets run the test cases of their rules through the preset, and an `ok.*` case must not be reported by any rule of the preset.
The test cases have the same layout as the test cases of `@secretlint/tester`, and the rule ids in their configuration files name the built-in rules.

## Data requirements

### Required data

- **Rule id:** The name that identifies a rule or a preset in the configuration file and in the messages.
- **Rule list of a preset:** The rules that a preset registers, in a fixed order.

### Relationships

A preset contains rules. A message refers to the rule that reported it by rule id.

### Personal information

None. Rules read file content, and the reported values can be secrets; masking them belongs to the Secret masking in results feature.

## External service dependencies

- **npm registry**
  - **Related user stories:** Enable the recommended rules with one id, Keep a configuration that installs the rule packages, Try new rules early
  - **Reason for dependency:** Secretlint, which has the built-in rules, and the packages of the same names are distributed as npm packages.
  - **Contractual and usage decisions:** Public packages on the npm registry, free of charge.

## Security considerations

The provided rules read only the content that Secretlint passes to them, and do not use the network.

## Open questions

None.
