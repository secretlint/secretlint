# Secretlint

[日本語](product.ja.md)

## Overview

Secretlint is a pluggable linting tool that finds credentials, such as tokens, private keys, and passwords, in files before they are committed or published.
Each kind of credential is detected by a rule, and a project chooses the rules it uses in a configuration file.
It runs in a project, in a pre-commit hook, and in CI, and is distributed as npm packages, a Docker image, and a single-executable binary.

## Background and problems

### Background

Tools that scan repositories for credentials already exist, such as git-secrets, Gitleaks, truffleHog, and detect-secrets.
The README describes why Secretlint was made in addition to them: git-secrets is mainly installed globally and is hard to set up per project, other scanners lack flexible customization such as ignore definitions and custom rules, and detect-secrets adopts an opt-out approach.
GitHub secret scanning works on the GitHub side, after a commit is made or pushed, while Secretlint works on the local machine and can prevent the commit itself.

### Problems to solve

- A developer commits a credential by mistake, and it remains in the history or is published.
- A credential found after the commit or push needs to be revoked and the history needs to be cleaned, which costs more than stopping it before the commit.
- A scanner that reports many errors by default produces false positives, which makes it hard to introduce to an existing project.
- A project has its own kinds of credentials or exceptions that a fixed set of detections does not cover.
- Lint results shown in CI logs, terminals, or AI agent tools can expose the credential they report.

## Target users

### Project developers

- **Characteristics:** Developers who commit to a repository and want to stop credentials from being committed.
- **Problems:** They commit a credential by mistake, and they get false positives that block their work.
- **Usage context:** They run Secretlint on the files of the project, in a pre-commit hook (for example with Husky and lint-staged, or pre-commit), or once with the quick start command.

### CI and repository maintainers

- **Characteristics:** People who set up checks for a repository or an organization.
- **Problems:** They need a check that fails the build when a credential is found and shows the result in their tools.
- **Usage context:** They run Secretlint in GitHub Actions or other CI with the Docker image or npm, and read the results as GitHub annotations, SARIF, or JSON.

### Rule authors

- **Characteristics:** Developers who add detection for a new kind of credential, either to the Secretlint repository or as their own npm package.
- **Problems:** They need to define a detection and its documentation, and test it without missing or over-reporting secrets.
- **Usage context:** They write a rule package and test it with snapshot tests.

### Tool integrators

- **Characteristics:** Developers who build other tools on Secretlint, such as Secretlint WebExtension and SecureClipboard.
- **Problems:** They need to scan content that is not a file in a project, such as HTTP traffic or the clipboard.
- **Usage context:** They call Secretlint from their own code as a library.

## Value provided

### Stop credentials before the commit

- **Recipient:** Project developers
- **Offering:** Secretlint reports credentials in files on the local machine, and a pre-commit hook can stop the commit.
- **Reason:** A credential is cheaper to handle before it is committed or published than after. GitHub secret scanning works after the commit or push.

### Per-project, opt-in configuration

- **Recipient:** Project developers and CI and repository maintainers
- **Offering:** A project chooses the rules, their options, allowed messages, and ignored files, and can add rules step by step.
- **Reason:** The README states that linting tools that report various errors by default are difficult to use, and that the opt-in approach helps to introduce Secretlint incrementally and to reduce false positives.

### Rules as documentation

- **Recipient:** Project developers and rule authors
- **Offering:** Each rule documents why it reports a value as a secret, and a message links to that documentation.
- **Reason:** The README states that a rule without documentation is just opinionated, and that describing the reason for an error leads to fewer false positives.

### Extensible detection

- **Recipient:** Rule authors and project developers
- **Offering:** A rule is an npm package, so anyone can create, publish, and install a rule for their own kind of credential.
- **Reason:** The README states that Secretlint needs custom rules by users, and that Node.js and its package managers make a pluggable rule system possible.

### Results that do not expose secrets

- **Recipient:** Project developers and CI and repository maintainers
- **Offering:** Secret values in results are masked by default, and a file can be output with its secrets masked.
- **Reason:** The README states that masking prevents accidental secret exposure in CI logs, terminal output, or AI agent tools.

## Key concepts

- **Secret (credential):** A raw value that gives access to a service, such as a token, a password, or a private key. The README and messages use both "secret" and "credential".
- **Rule:** A package that detects one group of secrets, or that filters the reports of other rules. A rule that reports secrets is a scanner rule, and a rule that suppresses reports is a filter rule.
- **Rule preset:** A rule that groups other rules, such as `@secretlint/secretlint-rule-preset-recommend` and `@secretlint/secretlint-rule-preset-canary`.
- **Configuration file (`.secretlintrc`):** The file that lists the rules a project uses, with their options.
- **Rule options:** Settings of each rule, such as `allows`, a list of values that the rule does not report.
- **Message ID:** The identifier of a kind of message that a rule reports. `allowMessageIds` suppresses messages by their ID.
- **Severity:** The level of a reported message: error, warning, or info. Only errors make the command fail.
- **Ignore file (`.secretlintignore`):** A file that excludes files from linting, with the same syntax as `.gitignore`. `.gitignore` files are also respected by default.
- **Disable comment:** A comment such as `secretlint-disable` that suppresses reports in a range of a file.
- **Formatter:** The output format of results, such as `stylish`, `json`, `github`, `mask-result`, and SARIF.
- **Mask:** Replacing a secret value with characters that hide it, in results or in the output of a file.

## Feature list

| Feature | Description | Specification |
| --- | --- | --- |
| Secret scanning | Lint files, globs, or STDIN content with the configured rules and report the secrets found | Not written |
| File selection | Choose the files to lint from globs and paths, honoring `.gitignore`, `.secretlintignore`, and built-in ignores | Not written |
| Configuration loading | Find and validate the configuration file and decide the rules, options, severities, and allowed messages | Not written |
| Configuration creation | Create a `.secretlintrc.json` with `--init` | Not written |
| Rules and rule presets | Detect each kind of credential, and group rules into the recommended and canary presets | Not written |
| Ignoring by comment | Suppress reports in a range of a file with disable comments | Not written |
| Secret masking in results | Mask secret values in reported messages by default | Not written |
| Result output | Show results with a chosen formatter, write them to a file, and set the exit status | Not written |
| File masking | Output the content of a file with its secrets masked (`mask-result`) | Not written |
| Message localization | Show messages in a chosen locale (`--locale`, experimental) | Not written |
| Custom rules | Create, test, and publish a rule as an npm package | Not written |
| Node.js API | Lint content from other programs with `@secretlint/node` | Not written |
| Distribution | Provide npm packages, the quick start command, a Docker image, and a single-executable binary | Not written |
| Performance profile | Show where time is spent with `--profile` | Not written |

## Definition of success

Not decided yet. See [Open questions](#open-questions).

## Development principles

- **Reduce false positives.** A rule reports a value only when it is likely to be a secret, and validates matches when possible.
- **Opt-in instead of opt-out.** A project enables the rules it needs.
- **Integrate with the development workflow.** Secretlint works in a project, in a pre-commit hook, and in CI.
- **Empower users to contribute.** Users can write their own rules and documentation.
- **Rule as documentation.** Each rule documents why it reports a value.
- **Semantic Versioning.** Releases follow Semantic Versioning, except for `@secretlint/secretlint-rule-preset-canary`. A change that makes Secretlint report more errors by default, such as adding a rule to a preset, is a major release.
- **Keep the meaning of the pattern format.** A new property of a rule's declarative pattern gets a new name, and the meaning of an existing property does not change, so an older Secretlint never runs a newer rule with a different result.

## SLA, SLI, and SLO

### SLA

None. Secretlint is open source software provided under the MIT License, and it does not guarantee service levels to its users.

### SLI and SLO

Not decided yet. See [Open questions](#open-questions).

## Open questions

- **Purpose:** Is the motivation in the README (per-project setup, opt-in configuration, custom rules, and stopping credentials before the commit) still the current purpose? Decided by the maintainer.
- **Target users:** Are the four user groups above correct, and are AI agent tools a target usage context? Decided by the maintainer.
- **Terms:** Which of "secret" and "credential" is the base term? Decided by the maintainer.
- **Definition of success:** Not decided. Decided by the maintainer.
- **SLI and SLO:** Whether to set targets, for example for false positives or scan time, is not decided. Benchmarks exist, but no target is recorded. Decided by the maintainer.
- **Text encodings:** Secretlint leans toward reading text as UTF-8 only. How to handle files in other encodings is not decided.
