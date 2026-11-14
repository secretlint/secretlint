# Secretlint

[日本語](product.ja.md)

## Overview

Secretlint is a pluggable linting tool that finds secrets, such as tokens, private keys, and passwords, in files before they are committed or published.
Each kind of secret is detected by a rule, and each repository chooses the rules it uses in a configuration file.
It runs on the developer's machine, in a pre-commit hook, in CI, and as a command run by AI agents, and is distributed as npm packages, a Docker image, and a single-executable binary.

## Background and problems

### Background

Tools that scan repositories for secrets already exist, such as git-secrets, Gitleaks, truffleHog, and detect-secrets.
git-secrets is mainly installed globally and is hard to set up per repository.
Other scanners lack flexible customization such as ignore definitions and custom rules.
detect-secrets adopts an opt-out approach.
GitHub secret scanning works on the GitHub side, after a commit is made or pushed, while Secretlint works on the local machine and can prevent the commit itself.

### Problems to solve

- A developer commits a secret by mistake, and it remains in the history or is published.
- A secret found after the commit or push needs to be revoked and the history needs to be cleaned, which costs more than stopping it before the commit.
- A scanner that reports many errors by default produces false positives, which makes it hard to introduce to an existing repository.
- A repository has its own kinds of secrets or exceptions that a fixed set of detections does not cover.
- Lint results shown in CI logs, terminals, or passed to AI agents can expose the secret they report.

## Target users

### Developers

- **Characteristics:** Developers who commit to a repository and want to stop secrets from being committed.
- **Problems:** They commit a secret by mistake, and they get false positives that block their work.
- **Usage context:** They run Secretlint on the files of a repository on their machine, in a pre-commit hook (for example with Husky and lint-staged, or pre-commit), or once with the quick start command.

### CI and repository maintainers

- **Characteristics:** People who set up checks for a repository or an organization.
- **Problems:** They need a check that fails the build when a secret is found and shows the result in their tools.
- **Usage context:** They run Secretlint in GitHub Actions or other CI with the Docker image or npm, and read the results as GitHub annotations, SARIF, or JSON.

### AI agents

- **Characteristics:** AI agents that run commands for a developer and continue their work by reading the output.
- **Problems:** They need to notice a secret before committing it. If a lint result includes the secret value, the value is passed into the agent's input and logs.
- **Usage context:** They run Secretlint before a commit or after changing files, and read the masked results.

### Rule authors

- **Characteristics:** Developers who add detection for a new kind of secret, either to the Secretlint repository or as their own npm package.
- **Problems:** They need to define a detection and its documentation, and test it without missing or over-reporting secrets.
- **Usage context:** They add a built-in rule to the Secretlint repository, or write a custom rule as an npm package, and test it with snapshot tests.

### Tool integrators

- **Characteristics:** Developers who build other tools on Secretlint, such as Secretlint WebExtension and SecureClipboard.
- **Problems:** They need to scan content that is not a file in a repository, such as HTTP traffic or the clipboard.
- **Usage context:** They call Secretlint from their own code as a library, in Node.js or in a browser.

## Value provided

### Stop secrets before the commit

- **Recipient:** Developers and AI agents
- **Offering:** Secretlint reports secrets in files on the local machine, and a pre-commit hook can stop the commit.
- **Reason:** A secret is cheaper to handle before it is committed or published than after. GitHub secret scanning works after the commit or push.

### Per-repository, opt-in configuration

- **Recipient:** Developers and CI and repository maintainers
- **Offering:** Each repository chooses the rules, their options, allowed messages, and ignored files, and can add rules step by step.
- **Reason:** Linting tools that report various errors by default are difficult to use. The opt-in approach lets a repository introduce Secretlint incrementally and reduce false positives by configuration.

### Rules as documentation

- **Recipient:** Developers and rule authors
- **Offering:** Each rule documents why it reports a value as a secret, and a message links to that documentation.
- **Reason:** A rule without documentation is just opinionated. Describing the reason for an error leads to fewer false positives.

### Extensible detection

- **Recipient:** Rule authors and developers
- **Offering:** A custom rule is an npm package, so anyone can create, publish, and install a rule for their own kind of secret. A value that a user considers secret can also be defined with a pattern and detected.
- **Reason:** Each repository has its own secrets. Node.js and its package managers make a pluggable rule system possible.

### Results that do not expose secrets

- **Recipient:** Developers, CI and repository maintainers, and AI agents
- **Offering:** Secret values in results are masked by default, and a file can be output with its secrets masked.
- **Reason:** Masking prevents accidental exposure of secrets in CI logs, terminal output, and results passed to AI agents.

## Key concepts

- **Secret:** A value that must not be published. It includes credentials and values that a user defines as secret, for example with a pattern.
- **Credential:** A value that gives access to a service, such as a token, a password, or a private key, in a generally defined format. Most rules that Secretlint provides detect credentials.
- **Rule:** A unit that detects one group of secrets, or that filters the reports of other rules. A rule is a built-in rule or a custom rule. A rule that reports secrets is a scanner rule, and a rule that suppresses reports is a filter rule.
- **Rule preset:** A rule that groups other rules, such as `@secretlint/secretlint-rule-preset-recommend` and `@secretlint/secretlint-rule-preset-canary`.
- **Configuration file (`.secretlintrc`):** The file that lists the rules to use, with their options.
- **Rule options:** Settings of each rule, such as `allows`, a list of values that the rule does not report.
- **Message ID:** The identifier of a kind of message that a rule reports. `allowMessageIds` suppresses messages by their ID.
- **Severity:** The level of a reported message: error, warning, or info. Only errors make the command fail.
- **Ignore file (`.secretlintignore`):** A file that excludes files from linting, with the same syntax as `.gitignore`. `.gitignore` files are also respected by default.
- **Disable comment:** A comment such as `secretlint-disable` that suppresses reports in a range of a file.
- **Formatter:** The output format of results, such as `stylish`, `json`, `github`, `mask-result`, and SARIF.
- **Built-in rules:** The rules and rule presets that Secretlint itself has. They are used by their rule ids without installing a package, in the same way with npm, the Docker image, the single-executable binary, and the quick start command.
- **Custom rules:** Rules that are created and installed as npm packages, by third parties or users. Secretlint also publishes some rules as custom rules, such as `@secretlint/secretlint-rule-no-dotenv`.
- **Mask:** Replacing a secret value with characters that hide it, in results or in the output of a file.

## Feature list

| Feature | Description | Specification |
| --- | --- | --- |
| Secret scanning | Lint files, globs, or STDIN content with the configured rules and report the secrets found | [Requirements](features/secret-scanning/requirements.md) |
| File selection | Choose the files to lint from globs and paths, honoring `.gitignore`, `.secretlintignore`, and built-in ignores | [Requirements](features/file-selection/requirements.md) |
| Configuration loading | Find and validate the configuration file and decide the rules, options, severities, and allowed messages | [Requirements](features/config-loading/requirements.md) |
| Configuration creation | Create a `.secretlintrc.json` with `--init` | Not written |
| Rules and rule presets | Detect each kind of secret with the built-in rules, and group them into the recommended and canary presets | [Requirements](features/rules-and-presets/requirements.md) |
| Ignoring by comment | Suppress reports in a range of a file with disable comments | Not written |
| Secret masking in results | Mask secret values in reported messages by default | Not written |
| Result output | Show results with a chosen formatter, write them to a file, and set the exit status | [Requirements](features/result-output/requirements.md) |
| mask-result formatter | Output the content of a file with its secrets masked (`mask-result`) | [Requirements](features/mask-result-formatter/requirements.md) |
| Message localization | Show messages in a chosen locale (`--locale`, experimental) | Not written |
| Custom rules | Create, test, publish, and use a rule as an npm package | [Requirements](features/custom-rules/requirements.md) |
| Node.js API | Lint content from other programs with `@secretlint/node` | Not written |
| npm packages | Install the CLI, rules, and formatters as npm packages and run them with Node.js | Not written |
| Quick start | Run once with `npx @secretlint/quick-start` and the recommended preset, without a configuration file | Not written |
| Docker image | Run `secretlint/secretlint` without Node.js or configuration, with the built-in rules and the SARIF formatter | Not written |
| Single-executable binary | Run a binary from GitHub Releases for Linux, macOS, and Windows without Node.js, with the built-in rules and the SARIF formatter | [Requirements](features/single-executable-binary/requirements.md) |
| Performance profile | Show where time is spent with `--profile` | [Requirements](features/performance-profile/requirements.md) |
| Change comparison | Compare the base and the head of a change on fixed repositories: pattern work, findings, and run time | [Requirements](features/change-comparison/requirements.md) |

## Definition of success

Not decided yet. See [Open questions](#open-questions).

## Development principles

- **Reduce false positives.** A rule reports a value only when it is likely to be a secret, and validates matches when possible. Secretlint is a linting tool that developers keep running, not a scanner that lists every candidate: when reporting less and finding more conflict, it chooses fewer false positives. A report in a file that the user excluded is also a false positive, so when an ignore rule can be read in two ways, the reading that ignores more files is taken.
- **Ignore rules mean the same as in Git.** A user writes `.gitignore` for Git, and `.secretlintignore` has the same syntax. The reference is what Git itself does with a rule, not what a library does. Where this differs from reducing false positives, reducing false positives wins.
- **Opt-in instead of opt-out.** Only the rules that are needed are enabled.
- **Integrate with the development workflow.** Secretlint works on the developer's machine, in a pre-commit hook, in CI, and as a command run by AI agents.
- **Empower users to contribute.** Users can write their own rules and documentation.
- **Rule as documentation.** Each rule documents why it reports a value.
- **Semantic Versioning.** Releases follow Semantic Versioning, except for `@secretlint/secretlint-rule-preset-canary`. A change that makes Secretlint report more errors by default, such as adding a rule to a preset, is a major release.
- **Keep the meaning of the pattern format.** A new property of a rule's declarative pattern gets a new name, and the meaning of an existing property does not change, so an older Secretlint never runs a newer rule with a different result.
- **Run `@secretlint/core` and its built-in rules in browsers.** They do not depend on Node.js, so that tools such as Secretlint WebExtension can use them. File access and configuration loading belong to the Node.js packages.
- **Read text as UTF-8 only.** Supporting other encodings is desirable, but Secretlint currently limits text to UTF-8 because of the realistic cost of supporting them.

## SLA, SLI, and SLO

### SLA

None. Secretlint is open source software provided under the MIT License, and it does not guarantee service levels to its users.

### SLI and SLO

- **SLI:** False positives of `@secretlint/secretlint-rule-preset-recommend` with its default settings.
- **SLO:** No false positives, except for special cases. A false positive that does occur can be suppressed with the ignore settings.
- **Measurement:** Not decided yet. See [Open questions](#open-questions).

## Open questions

- **Target users:** AI agents are included. Whether the other four user groups are correct is to be confirmed by the maintainer.
- **Definition of success:** Not decided. Decided by the maintainer.
- **Measuring false positives:** How to count false positives of the recommended preset is not decided. Decided by the maintainer.
