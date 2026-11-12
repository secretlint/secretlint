# Rules and rule presets

[日本語](requirements.ja.md)

## About this document

Secretlint detects each group of secrets with a rule, and groups rules into the recommended preset and the canary preset.
A repository enables a rule or a preset by its rule id in the configuration file.
This document describes the rules and presets that Secretlint provides, how they are identified, and how a preset passes options to its rules.
The parent Product is [Secretlint](../../product.md).

### Scope

- The rules provided by Secretlint and their rule ids
- The recommended preset and the canary preset: which rules they contain and how they register them
- Options, severities, allowed messages, and disabling of the rules in a preset
- The documentation of each rule

### Out of scope

- What each rule detects. Each rule's documentation describes it.
- How a rule id in the configuration file is resolved to a rule: [Configuration loading](../config-loading/requirements.md)
- Creating and testing a rule: [Custom rules](../custom-rules/requirements.md)
- The rules available in the single-executable binary: [Single-executable binary](../single-executable-binary/requirements.md)
- Suppressing reports with comments (the behavior of `@secretlint/secretlint-rule-filter-comments`), which belongs to the Ignoring by comment feature. It is not written yet.

## User stories

### Enable the recommended rules with one id

As a developer, I want to enable the recommended rules with one entry in the configuration file, so that I do not have to list each rule.

**Acceptance criteria:**

Scenario: When the configuration file lists the recommended preset, all rules of the preset run

- Given: `@secretlint/secretlint-rule-preset-recommend` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-preset-recommend" }`.
- When: The developer lints a file that contains an AWS access key and a GitHub token.
- Then: The result has a message of `@secretlint/secretlint-rule-aws` and a message of `@secretlint/secretlint-rule-github`.

Scenario: When the configuration file lists one rule, only that rule runs

- Given: `@secretlint/secretlint-rule-aws` is installed, and the configuration file has only `{ "id": "@secretlint/secretlint-rule-aws" }`.
- When: The developer lints a file that contains an AWS access key and a GitHub token.
- Then: The result has a message of `@secretlint/secretlint-rule-aws` and no message of `@secretlint/secretlint-rule-github`.

### Configure a rule in a preset

As a developer, I want to set the options or the severity of a rule in a preset, so that I can reduce false positives in my repository without leaving the preset.

**Acceptance criteria:**

Scenario: When a preset entry has options for one of its rules, the rule uses them

- Given: The configuration file has the recommended preset with `"rules": [{ "id": "@secretlint/secretlint-rule-aws", "options": { "allows": ["<the key>"] } }]`.
- When: The developer lints a file that contains that AWS access key.
- Then: The result has no message of `@secretlint/secretlint-rule-aws` for the key.

Scenario: When a preset entry sets the severity of one of its rules, the messages of the rule have that severity

- Given: The configuration file has the recommended preset with `"rules": [{ "id": "@secretlint/secretlint-rule-github", "severity": "warning" }]`.
- When: The developer lints a file that contains a GitHub token.
- Then: The message of `@secretlint/secretlint-rule-github` has the severity `warning`, and the command does not fail because of it.

Scenario: When a rule is listed both in a preset and on its own, loading fails

- Given: The configuration file has the recommended preset and `{ "id": "@secretlint/secretlint-rule-aws" }`.
- When: The developer runs Secretlint.
- Then: Secretlint stops with an error that says `@secretlint/secretlint-rule-aws` is already registered, and no file is linted.

### Try new rules early

As a developer, I want to use the rules that may be added to the recommended preset in the next major release, so that I can check them on my repository before they become recommended.

**Acceptance criteria:**

Scenario: When the configuration file lists the canary preset, the rules of the canary preset run

- Given: `@secretlint/secretlint-rule-preset-canary` is installed, and the configuration file has `{ "id": "@secretlint/secretlint-rule-preset-canary" }`.
- When: The developer lints a file that contains a secret that a rule of the canary preset detects.
- Then: The result has a message of that rule.

### Read why a value is reported

As a developer, I want to read why a rule reports a value, so that I can decide whether it is a secret or a false positive.

**Acceptance criteria:**

Scenario: When a rule reports a message, the message links to the documentation of the rule

- Given: A rule that has documentation reports a message.
- When: The developer reads the result.
- Then: The message has a URL to the documentation of the rule and the message ID.

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

Each rule provided by Secretlint has the rule id `@secretlint/secretlint-rule-<name>`, which is the name of its npm package.
The rule id is used in the configuration file and as `ruleId` of the messages.

##### Provided rules

Secretlint provides the rules of the recommended preset, and the following rules that are not in any preset:
`@secretlint/secretlint-rule-pattern` (user-defined patterns), `@secretlint/secretlint-rule-azure`, `@secretlint/secretlint-rule-no-dotenv`, `@secretlint/secretlint-rule-no-homedir`, `@secretlint/secretlint-rule-no-k8s-kind-secret`, and `@secretlint/secretlint-rule-secp256k1-privatekey`.
A rule that is not in a preset is used by listing its rule id.

##### Installation

A rule or a preset is used after its npm package is installed where Secretlint can resolve it.

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
It can set `options`, `severity`, and `allowMessageIds` of that rule.
A rule without an entry runs with its default options.
`disabled` in an entry does not disable the rule now. See [Open questions](#open-questions).

#### Exceptional behavior

##### The same rule id registered twice

When a rule id is registered twice, for example by a preset and by its own entry, Secretlint stops with an error that names the rule id.

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
  - **Related user stories:** Enable the recommended rules with one id, Try new rules early
  - **Reason for dependency:** Rules and presets are distributed as npm packages.
  - **Contractual and usage decisions:** Public packages on the npm registry, free of charge.

## Security considerations

The provided rules read only the content that Secretlint passes to them, and do not use the network.

## Open questions

- **`disabled` of a rule in a preset:** The configuration document says that `disabled: true` disables a rule, but `disabled` in the `rules` list of a preset entry does not disable that rule now: the rule still reports. Which is the intended behavior is to be decided by the maintainer. Until then, a rule of a preset is suppressed with `allowMessageIds` or `allows`.
