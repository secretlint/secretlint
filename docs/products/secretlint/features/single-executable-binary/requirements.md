# Single-executable binary

[日本語](requirements.ja.md)

## About this document

The single-executable binary runs Secretlint without Node.js and without installing packages.
It has the built-in rules of Secretlint and the SARIF formatter, so a repository can lint with the recommended rules by downloading one file.
The parent Product is [Secretlint](../../product.md).

### Scope

- The platforms of the binary and where it is published
- The rules and formatters that the binary has
- `--init` and `--version` of the binary

### Out of scope

The other options of the command, which are the same as those of the `secretlint` npm package and are not written yet.
How the rule ids of the configuration file are resolved: [Configuration loading](../config-loading/requirements.md).

## User stories

### Lint without Node.js

As a CI and repository maintainer, I want to download one file and lint a repository with the recommended rules, so that I do not need to install Node.js or npm packages.

**Acceptance criteria:**

Scenario: When the binary creates a configuration, it lists the built-in rules

- Given: A directory without a configuration file, and the binary for the platform.
- When: The maintainer runs `secretlint --init`.
- Then: `.secretlintrc.json` is created with `@secretlint/secretlint-rule-preset-recommend` and `@secretlint/secretlint-rule-pattern`, and the command prints the path of the file.

Scenario: When a configuration file already exists, `--init` does not overwrite it

- Given: The directory has a file whose name starts with `.secretlintrc`.
- When: The maintainer runs `secretlint --init`.
- Then: The command prints that the configuration file already exists, exits with status 1, and the file is not changed.

Scenario: When the configuration uses the built-in rules, the binary lints with them

- Given: `.secretlintrc.json` lists `@secretlint/secretlint-rule-preset-recommend`, and no `node_modules` directory exists.
- When: The maintainer runs `secretlint "**/*"` on files that contain a secret.
- Then: The binary reports the secret and exits with status 1.

Scenario: When the configuration lists a built-in rule by its own id, the binary uses it

- Given: `.secretlintrc.json` lists `@secretlint/secretlint-rule-preset-canary` or `@secretlint/secretlint-rule-aws`, and no `node_modules` directory exists.
- When: The maintainer runs `secretlint "**/*"` on a file that contains an AWS access key.
- Then: The binary reports the key with `@secretlint/secretlint-rule-aws`.

Scenario: When the configuration uses a custom rule, loading fails

- Given: `.secretlintrc.json` lists the custom rule `@secretlint/secretlint-rule-no-dotenv`, and it is not installed.
- When: The maintainer runs the binary.
- Then: The binary stops with an error that the rule module is not found.

### Output SARIF

As a CI and repository maintainer, I want to output SARIF from the binary, so that code scanning tools can read the result.

**Acceptance criteria:**

Scenario: When the SARIF formatter is chosen, the binary outputs SARIF

- Given: A configuration with the built-in rules.
- When: The maintainer runs the binary with `--format @secretlint/secretlint-formatter-sarif`.
- Then: The output is a SARIF document.

## KPIs

None. No metric has been defined for the binary.

## Functional requirements

### Built-in rules and formatters

**Overview:** The binary has all built-in rules and presets, and the SARIF formatter, and uses them when the configuration or the options name them.

**Input:** The rule ids of the configuration file, and the `--format` option.

**Output:** The same results as the npm package of the same version.

#### Applicable conditions

##### Built-in rules

The binary has every built-in rule and preset of the Secretlint version it was built from: the recommended preset, the canary preset, each rule of them by its own id, `@secretlint/secretlint-rule-pattern`, and `@secretlint/secretlint-rule-azure`.
The short forms of these ids, such as `@secretlint/preset-recommend`, also use them.

##### Built-in formatter

The binary contains `@secretlint/secretlint-formatter-sarif` in the version of the binary.

##### Other packages

Custom rules, such as `@secretlint/secretlint-rule-no-dotenv` and third-party rules, are not in the binary.

##### Platforms

The binary is published on the GitHub Releases page for Linux x64 and arm64, Windows x64, and macOS x64 and arm64, with a SHA-256 checksum file.

##### Version

`secretlint --version` prints the version of Secretlint that the binary was built from.

## Data requirements

### Required data

None beyond the configuration file and the files to lint.

### Relationships

None.

### Personal information

None.

## External service dependencies

- **GitHub Releases**
  - **Related user stories:** Lint without Node.js
  - **Reason for dependency:** The binaries are downloaded from the release page of the repository.
  - **Contractual and usage decisions:** Public releases of an open source repository, free of charge.

## Security considerations

The binaries are not code-signed. A user checks a download with the checksum file.

## Open questions

None.
