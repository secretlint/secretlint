# Configuration loading

[日本語](requirements.ja.md)

## About this document

Secretlint reads the configuration file of a repository and decides which rules run, with which options.
This document describes how Secretlint finds the configuration file, which rules run when there is none, and how the rule ids listed in the configuration become the rules that run.
The parent Product is [Secretlint](../../product.md).

### Scope

- Finding the configuration file, and the `--secretlintrc` and `--secretlintrcJSON` options
- The default configuration, used when no configuration is found
- Resolving each rule id in the configuration file to a built-in rule, or to a rule or a preset of an installed package
- The short form of a rule id
- What happens when a rule id cannot be resolved

### Out of scope

This document does not yet describe the following parts of Configuration loading:

- Validating the configuration file, and the messages about deprecated settings
- `sharedOptions`

The rules and presets themselves are described in [Rules and rule presets](../rules-and-presets/requirements.md).

## User stories

### Use the configuration of the repository

As a developer, I want Secretlint to find the configuration file of the repository without options, so that the same command uses the same rules in every directory of the repository.

**Acceptance criteria:**

Scenario: When the current directory has a configuration file, it is used

- Given: The current directory has `.secretlintrc.json`.
- When: The developer runs `secretlint "**/*"`.
- Then: The rules of `.secretlintrc.json` run.

Scenario: When a parent directory has the configuration file, it is used

- Given: Only the root directory of the repository has `.secretlintrc.json`, and the developer is in a subdirectory.
- When: The developer runs `secretlint "**/*"` in the subdirectory.
- Then: The rules of the `.secretlintrc.json` in the root directory run.

Scenario: When `package.json` has the `secretlint` field, it is used as the configuration

- Given: The current directory has no `.secretlintrc*` file, and `package.json` has a `secretlint` field.
- When: The developer runs Secretlint.
- Then: The rules of the `secretlint` field run.

Scenario: When a configuration has no rules, the default configuration is not added

- Given: `.secretlintrc.json` is `{ "rules": [] }`.
- When: The developer runs Secretlint.
- Then: No secret is reported, and the result has the `EMPTY_RULES` warning for `.secretlintrc.json`. The recommend preset does not run.

### Run Secretlint without a configuration file

As a developer, a CI maintainer, or an AI agent, I want Secretlint to check for secrets with the recommended rules when there is no configuration, so that I can run it once in any directory without creating a configuration file first.

**Acceptance criteria:**

Scenario: When no configuration is found, the recommend preset runs

- Given: No `.secretlintrc*` file and no `secretlint` field of `package.json` exist in the current directory or its parent directories, no option gives a configuration, and `token.txt` has a GitHub token.
- When: The developer runs `secretlint "**/*"`.
- Then: The result has a message of the GitHub rule of `@secretlint/secretlint-rule-preset-recommend`, and the exit status is 1. Nothing is written to stderr.

Scenario: When the default configuration is used and no secret is found, Secretlint succeeds

- Given: No configuration is found, and no file has a secret.
- When: The developer runs `secretlint "**/*"`.
- Then: No message is reported, and the exit status is 0.

Scenario: Rules outside the recommend preset do not run by default

- Given: No configuration is found, and a directory has a `.env` file.
- When: The developer runs `secretlint "**/*"`.
- Then: No message of `@secretlint/secretlint-rule-no-dotenv` is reported, because that rule is not in the recommend preset.

### Choose the configuration in the command

As a developer or a CI maintainer, I want to give the configuration in the command, so that I can use a configuration that is not in the repository.

**Acceptance criteria:**

Scenario: When `--secretlintrc` gives a file, that file is used

- Given: `config/secretlint.json` has a configuration.
- When: The developer runs `secretlint "**/*" --secretlintrc config/secretlint.json`.
- Then: The rules of `config/secretlint.json` run, and the `.secretlintrc*` files of the directories are not read.

Scenario: When `--secretlintrcJSON` gives a JSON string, it is used

- When: The developer runs `secretlint "**/*" --secretlintrcJSON '{"rules":[{"id":"@secretlint/secretlint-rule-preset-recommend"}]}'`.
- Then: The recommend preset runs, and no configuration file is read.

Scenario: When `--secretlintrc` names a file in a parent directory, it is not found

- Given: The parent directory has `rc.json`, and the current directory does not.
- When: The developer runs `secretlint "**/*" --secretlintrc rc.json`.
- Then: Secretlint stops with an error that names `rc.json`, and the exit status is 2. The `rc.json` of the parent directory is not used.

Scenario: When the file of `--secretlintrc` is not found, Secretlint stops

- Given: `missing.json` does not exist in the current directory.
- When: The developer runs `secretlint "**/*" --secretlintrc missing.json`.
- Then: Secretlint stops with an error that names `missing.json`, no file is linted, and the exit status is 2. The default configuration is not used.

Scenario: When the found configuration file is broken, Secretlint stops

- Given: `.secretlintrc.json` has a syntax error.
- When: The developer runs Secretlint.
- Then: Secretlint stops with an error that names `.secretlintrc.json`, and the exit status is 2. The default configuration is not used.

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

### Finding the configuration file

**Overview:** Secretlint decides the configuration from the options of the command, or finds the configuration file from the current directory.

**Input:** The current directory, and the `--secretlintrc` or `--secretlintrcJSON` option.

**Output:** The configuration, and the path of the file it was read from, or the default configuration without a path.

#### Applicable conditions

##### Without options

In the current directory, Secretlint looks for these, in this order, and uses the first one that it can read:

1. `.secretlintrc.cjs`, `.secretlintrc.js`, `.secretlintrc.json`, `.secretlintrc.yaml`, `.secretlintrc.yml`
2. `.secretlintrc`, read as JSON, YAML, or JavaScript
3. The `secretlint` field of `package.json`

If none is found, it looks in the parent directory in the same way, up to the root of the file system.
Configurations of different directories are not merged.

##### `--secretlintrc`

The option names exactly one file. A relative path is resolved from the current directory, and the file is read as it is named.
No parent directory is searched, no extension is appended, and the `secretlint` field of `package.json` is not looked for.
Before this change, the option replaced the file name `.secretlintrc` in the search above, so a relative path was also looked for in the parent directories with the extensions appended. The new behavior is released in a major version, because a command that relied on the search fails.

##### `--secretlintrcJSON`

The option gives the configuration as a JSON string. No file is looked for, and messages about the configuration are not reported, because there is no file to report them for.

##### Default configuration

When no option gives a configuration and the search finds nothing up to the root, Secretlint uses the default configuration: the recommend preset `@secretlint/secretlint-rule-preset-recommend` with its default options.
It is the same configuration that `secretlint --init` writes, so creating the file with `--init` does not change the results.
Secretlint writes no notice about the default configuration, like other linters that run default rules. The output is the same as with the file that `--init` writes. The `--debug` log says that the default configuration is used.
The same applies to every distribution that uses the Node.js engine: the npm package, the Docker image, and the single-executable binary.

The reason for the default is that the recommend preset is part of Secretlint itself, not a separate package to install, and it is designed to report far fewer false positives than secret scanners in general.
Requiring a configuration file before the first run makes the recommended rules harder to use, and few users would find a downside in running them by default.
Rules outside the recommend preset, rule options, and allowed messages still need a configuration file.

#### Exceptional behavior

##### The file of `--secretlintrc` is not found

Secretlint stops with an error that names the given path, and no file is linted. The exit status is 2. The default configuration is not used, because the developer asked for a specific file.

##### The configuration file cannot be read

When a found file has a syntax error, Secretlint stops with an error that names the file, and no file is linted. The exit status is 2.

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

- **Configuration:** The `rules` list and the other settings, read from a configuration file, the `secretlint` field of `package.json`, or the `--secretlintrcJSON` option.
- **Rule entry:** The `id` of a rule or a preset, and its `options`, `severity`, `allowMessageIds`, `disabled`, and for a preset its `rules`.

### Relationships

One configuration is used for a run, and it has the rule entries. Each rule entry is resolved to one rule or one preset.

### Personal information

None.

## External service dependencies

None. Built-in rules are part of `@secretlint/core`. Packages are read from the local file system; installing them is done by the user's package manager.

## Security considerations

The default configuration runs only built-in rules, so running Secretlint in a directory without a configuration does not import any package.
Secret values in the results are masked by default, as with a configuration file.
A rule id names a built-in rule, or a package that is imported and run with the permissions of Secretlint, so only built-in rules and packages that the user installed are run.
A built-in rule cannot be replaced by installing a package of the same name.

## Open questions

- **The quick start command:** With the default configuration, `@secretlint/quick-start` has no role left (azu, 2026-11-14). Deprecating it is a follow-up of this change.

Decided in the review (azu, 2026-11-14): `--secretlintrc` names exactly one file, and the Docker image is still needed.
