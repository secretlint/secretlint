# Configuration loading

[日本語](requirements.ja.md)

## About this document

Secretlint reads the configuration file of a repository and decides which rules run, with which options.
This document describes how the rule ids listed in the configuration file become the rules that run.
The parent Product is [Secretlint](../../product.md).

### Scope

- Resolving each rule id in the configuration file to a built-in rule, or to a rule or a preset of an installed package
- The short form of a rule id
- What happens when a rule id cannot be resolved

### Out of scope

This document does not yet describe the following parts of Configuration loading:

- Finding the configuration file, and the `--secretlintrc` option
- Validating the configuration file, and the messages about deprecated settings
- `sharedOptions`

The rules and presets themselves are described in [Rules and rule presets](../rules-and-presets/requirements.md).

## User stories

### Use a rule by its id

As a developer, I want to list a built-in rule by its rule id, and a custom rule by the name of its npm package, so that Secretlint runs the rule that I mean.

**Acceptance criteria:**

Scenario: When the rule id is the id of a built-in rule, the built-in rule runs

- Given: Only `secretlint` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-aws" }`.
- When: The developer lints a file that contains an AWS access key.
- Then: The result has a message whose `ruleId` is `@secretlint/secretlint-rule-aws`.

Scenario: When the rule id is the short form, the rule of the full id runs

- Given: Only `secretlint` is installed, and the configuration file has `{ "id": "@secretlint/aws" }`.
- When: The developer lints a file that contains an AWS access key.
- Then: The result has a message of the AWS rule, and its `ruleId` is `@secretlint/aws`, the id written in the configuration file.

Scenario: When a package of the same name as a built-in rule is installed, the built-in rule runs

- Given: An older version of `@secretlint/secretlint-rule-preset-recommend` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-preset-recommend" }`.
- When: The developer runs Secretlint.
- Then: The preset of the installed Secretlint runs, and the installed package is not imported.

Scenario: When a third-party rule is installed, it is used by its package name

- Given: A rule package `secretlint-rule-example` is installed, and the configuration file has `{ "id": "secretlint-rule-example" }` or `{ "id": "example" }`.
- When: The developer lints a file.
- Then: The rule of `secretlint-rule-example` runs.

### Know which rule is missing

As a developer, I want to know which rule id cannot be loaded, so that I can install the missing package.

**Acceptance criteria:**

Scenario: When a rule id is not installed, Secretlint stops with the id

- Given: The configuration file has `{ "id": "@secretlint/secretlint-rule-no-dotenv" }`, which is a custom rule, and the package is not installed.
- When: The developer runs Secretlint.
- Then: Secretlint stops with an error that says it failed to load `@secretlint/secretlint-rule-no-dotenv` because it is not found, and no file is linted.

## KPIs

None. This feature is a step of every lint, and no metric has been defined for it.

## Functional requirements

### Rule id resolution

**Overview:** Each rule id of the configuration file is resolved to a built-in rule or preset, or to the rule or preset exported by an npm package.

**Input:** The `rules` of the configuration file, and the directory to resolve packages from.

**Output:** The rules and presets to run, with the id, options, severity, allowed messages, and disabled setting of each entry.

#### Applicable conditions

##### Built-in rules

A rule id is first looked up in the built-in rules of `@secretlint/core`, as it is and then with the prefix `secretlint-rule-` added in the same way as a package name.
When it names a built-in rule or preset, that is used, and no package is resolved or imported, even if a package of the same name is installed.

##### Package names

For a rule id that is not built-in, the id is first read as the short form, and the prefix `secretlint-rule-` is added: `@scope/name` becomes `@scope/secretlint-rule-name`, and `name` becomes `secretlint-rule-name`.
An id that already has the prefix is used as it is.
If no package of that name is found, the id itself is tried as a package name.

##### Where packages are found

Packages are found in the same way as Node.js `require.resolve`, from the location where Secretlint is installed.
A program that uses the configuration loader can give another `node_modules` directory.
A program can also register hooks that resolve and import a package name before Node.js does. The single-executable binary uses them for its built-in formatter.

##### The exports of a package

The package must export `creator`. A creator whose type is `preset` is loaded as a preset, with the `rules` list of its entry.

##### The rule id in the results

The id written in the configuration file is kept as the rule id, so the messages of a rule loaded by the short form have the short form as `ruleId`.

#### Exceptional behavior

##### A package is not found

When a rule id cannot be resolved, loading fails with an error that names the id, the current directory, and the base directory. Errors of all entries are collected into one error, and no file is linted.

##### A package does not export `creator`

Loading fails with an error that says the rule must export `creator`.

## Data requirements

### Required data

- **Rule entry:** The `id` of a rule or a preset, and its `options`, `severity`, `allowMessageIds`, `disabled`, and for a preset its `rules`.

### Relationships

Each rule entry is resolved to one rule or one preset.

### Personal information

None.

## External service dependencies

None. Built-in rules are part of `@secretlint/core`. Packages are read from the local file system; installing them is done by the user's package manager.

## Security considerations

A rule id names a built-in rule, or a package that is imported and run with the permissions of Secretlint, so only built-in rules and packages that the user installed are run.
A built-in rule cannot be replaced by installing a package of the same name.

## Open questions

None.
