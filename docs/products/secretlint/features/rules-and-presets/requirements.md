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

### Turn on a part of a rule with an option

As a developer, I want a part of a rule that is off by default to cost nothing until I turn it on with an option, so that a check that I do not use does not make the lint slower.

**Acceptance criteria:**

Scenario: When the option is not set, the part of the rule is not a part of the lint

- Given: The configuration file has `{ "id": "@secretlint/secretlint-rule-aws" }` without options.
- When: The developer lints a file that contains an AWS access key ID and an AWS secret access key.
- Then: The result has the message of the secret access key and no message of the access key ID, and Secretlint does not search the file for the access key ID.

Scenario: When the option is true, the part of the rule reports

- Given: The configuration file has `{ "id": "@secretlint/secretlint-rule-aws", "options": { "enableIDScanRule": true } }`.
- When: The developer lints the same file.
- Then: The result has the message of the access key ID and the message of the secret access key.

Scenario: When the option is not a boolean, Secretlint stops

- Given: The configuration file has `{ "id": "@secretlint/secretlint-rule-aws", "options": { "enableIDScanRule": "true" } }`.
- When: The developer runs Secretlint.
- Then: Secretlint stops with an error that says the option `enableIDScanRule` of `@secretlint/secretlint-rule-aws` should be a boolean, and no file is linted.

### Write my own patterns without slowing down the lint

As a developer, I want to add patterns of my own secrets with `@secretlint/secretlint-rule-pattern`, and to have them cost no more than the patterns of the built-in rules, so that a pattern of my own, or an entry that `secretlint --init` added without patterns, does not make every file run.

**Acceptance criteria:**

Scenario: When the pattern rule has no patterns, it is not a part of the lint

- Given: The configuration file has the recommended preset and `{ "id": "@secretlint/secretlint-rule-pattern" }` without options, as `secretlint --init` writes it.
- When: The developer lints a repository where most files have no keyword of any rule.
- Then: The result is the same as with the recommended preset alone, and Secretlint does not read a file as a string only for the pattern rule.

Scenario: When a pattern has `keywords`, it runs only on files that contain one of them

- Given: The pattern rule has `{ "name": "internal token", "patterns": ["/itk_[a-z0-9]{32}/"], "keywords": ["itk_"] }`.
- When: The developer lints a file that contains `itk_` followed by 32 characters, and a file that does not contain `itk_`.
- Then: The first file has a message of the pattern rule, and the pattern does not run on the second file.

Scenario: When a pattern has no `keywords`, Secretlint finds them in the pattern

- Given: The pattern rule has `{ "name": "password", "patterns": ["/password\\s*=\\s*\\S+/i"] }` without `keywords`.
- When: The developer lints a file with `PASSWORD = hunter2` and a file without the word `password`.
- Then: The first file has a message of the pattern rule, and the pattern does not run on the second file.

Scenario: When no keyword can be found in a pattern, the pattern runs on every file

- Given: The pattern rule has `{ "name": "hex", "patterns": ["/[0-9a-f]{64}/"] }` without `keywords`.
- When: The developer lints the repository with `--profile`.
- Then: The pattern reports in the same way as before, and the profile shows the pattern as `hex (no keywords)`.

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

### Add a rule for a secret with a short prefix

As a rule author, I want to state what follows the keyword of my pattern, so that a rule for a key with a short or common prefix does not make the lint slow, and I do not need a keyword that is not a part of the key.

**Acceptance criteria:**

Scenario: When a pattern declares a guarded keyword, the rule reports the same secrets

- Given: A pattern has the regular expression `/00[A-Za-z0-9_-]{40}/` and the guarded keyword `{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }` in its keywords.
- When: A file that has such a key is linted.
- Then: The rule reports the key, the same as with the keyword `00`.

Scenario: When the guard of a guarded keyword is not supported, the lint stops with an error

- Given: A pattern has the guarded keyword `{ keyword: "00", after: "[^ ]{40,}" }`, which uses a syntax that Secretlint does not support.
- When: A developer lints with the rule.
- Then: Secretlint stops with an error that names the rule and the guarded keyword, and no file is linted.

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

##### Patterns that an option turns on or off

A rule can have a pattern that reports only when an option of the rule is set, such as a pattern for an ID that is not a secret by itself.
The rule states this as data: the pattern has a condition that refers to the option. The rule does not decide it with its own code.
Secretlint reads the option and decides whether the pattern is a part of the lint. So the decision is made before any file is read, it is the same for every rule, and Secretlint can tell which option turns which pattern on or off.

- The condition refers to a boolean option of the rule as `options.<name>`, with or without `!` before it. With `options.<name>`, the pattern is a part of the lint only when the option is `true`. With `!options.<name>`, the pattern is a part of the lint unless the option is `true`.
- The condition says where the value comes from (`options.`), so that a condition can refer to a value other than the options of the rule later, without changing the meaning of the existing conditions.
- An option that is not set is `false`.
- A pattern that is not a part of the lint costs nothing: Secretlint does not search for its keywords, and does not run it.
- A pattern without a condition is always a part of the lint.
- The condition is one way to write "on" and "off". There is no second property for a pattern that an option turns off.
- The option must be a boolean option of the rule. In TypeScript, a name that is not a boolean option of the rule is a type error.
- The condition is a small subset of an expression language such as CEL: a reference to an option, and `!`. Other operators, such as `&&`, `||`, and `==`, are not supported. If one is needed, it is added to the condition, and a Secretlint that does not know it stops with an error instead of reading the condition in another way.

##### User-defined patterns

`@secretlint/secretlint-rule-pattern` reports the matches of the patterns that the configuration file defines in its options.
Secretlint reads these options as patterns, in the same way as the patterns that the built-in rules declare: the patterns are data, and Secretlint runs them.

- An entry without `patterns`, `pattern`, and `filePathGlobs` is not allowed, as before. When the options have no entry, the rule is not a part of the lint: it adds no keyword, and no file runs it.
- An entry may have `keywords`, a list of ASCII strings. The pattern runs only on a file that contains one of them, matched ASCII case-insensitively. Every match of the pattern must contain one of the keywords; a match without one is not reported. A non-ASCII or empty keyword is an error. `keywords: []` runs the pattern on every file.
- When an entry has no `keywords`, Secretlint finds strings that every match of a pattern must contain, and uses them as the keywords of that pattern. It only uses a string when it is sure: when a pattern has a part that it does not understand, the pattern has no keywords and runs on every file, as before.
- The keywords are found only in the ASCII letters of a pattern. A pattern with the flag `i` also matches some non-ASCII letters that fold to an ASCII letter, such as the Kelvin sign (U+212A) for `k`. Such a match is not reported when the file has no keyword in ASCII. Secretlint is a linter and prefers no false positive to no false negative, so this is accepted.
- An entry with only `filePathGlobs` reports a file whose path matches, without keywords and without matching its content.
- The rule id, the message ID `PATTERN`, the message, `allows`, and `filePathGlobs` of an entry keep their meaning.
- `--profile` shows each pattern of the rule by its name, and ` (no keywords)` after the name of a pattern that runs on every file.

##### Keywords with a guard

A pattern can declare guarded keywords: a keyword with a guard, a condition on the characters that follow it. Why Secretlint has guards, and what they keep, is in [Secret scanning](../secret-scanning/requirements.md).
The rule states the guard as data, as it states keywords, and Secretlint checks it.

- A guarded keyword is an item of the keywords of a pattern. An item is a string, as before, or a keyword object: an object that has the keyword and what the rule states about it. A string means what it meant before: no string is read in a new way.
- A keyword object has the keyword, and it can have a guard: what comes after the keyword, as a set of characters and a count. For example, `{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }` is the keyword `00` and 40 or more characters of letters, digits, `_`, and `-` after it.
- The keyword of the object is written as a keyword of a string is, with no special characters.
- What comes after is written in the syntax of regular expressions, and it means what it says: `[A-Za-z0-9_-]{40,}` is 40 or more of these characters.
- Its syntax is a small subset of the syntax of regular expressions: one set of ASCII characters and one count. The set is written with `[` and `]`, and the count is `{n,}`: it says how many characters follow at least, and a guard states nothing more. A count that reads as a most or as an exact number, such as `{32,40}` or `{40}`, is not supported, because the guard would not check what the count says.
- The syntax is strict: one thing has one way to write it. A short form that means the same as another form, such as `+` for `{1,}` or `\d` for `0-9`, is not supported.
- Other syntax, such as a set with `^`, a group, or a second set, is not supported, and the object has no other property. If more is needed, it is added to the syntax or as a property with a new name, and a Secretlint that does not know it does not read the guard in another way.
- A keyword object is matched as written: its keyword and its set are case-sensitive. `{ keyword: "SG." }` is found in `SG.x` and not in `msg.x`, and the set `[a-f0-9]` does not have `A`.
- A keyword that is a string is matched without the case of ASCII letters, as before. So a string is the loose way to write a keyword, and a keyword object is the exact way. A pattern has no option for the case of its keywords.
- A keyword object without a guard is the keyword as written, and nothing more.
- Every match of the pattern must contain one of its keywords, and for a guarded keyword also the characters that meet the guard. This is the same duty as for keywords, and the tests of the rule check it. See [Custom rules](../custom-rules/requirements.md).
- A pattern can have strings and objects together in its keywords. The pattern runs where one of them is found.
- A guarded keyword counts as a keyword for the "line" scope.
- A guard is for a pattern. `meta.keywords` of a rule without patterns has no guard.
- A user can write a guarded keyword. The object is data, so it can be in a configuration file: `keywords` of an entry of `@secretlint/secretlint-rule-pattern` has the same items. See "User-defined patterns".

##### Documentation

Each rule has a README that describes why it reports values, its messages, and its options.

#### Exceptional behavior

##### The condition of a pattern is not supported

When the condition of a pattern is not a string, or is a string other than `options.<name>` or `!options.<name>`, Secretlint stops with an error that names the rule and the condition, and no file is linted.

##### The value of the option of a condition is not a boolean

When the value of the option that a condition names is set and is not `true` or `false`, such as the string `"true"`, Secretlint stops with an error that names the rule and the option, and no file is linted. Secretlint does not read another value as `true` or `false`.

##### A keyword of a user-defined pattern is not valid

When `keywords` of an entry of `@secretlint/secretlint-rule-pattern` is not a list of non-empty ASCII strings and guarded keywords, Secretlint stops with an error that names the entry, and no file is linted.

##### A guarded keyword is not supported

When an item of the keywords is an object, and it does not have a keyword as a string, has a guard that is not a string, has another property, has a character that is not ASCII, or has a guard that the syntax does not support, Secretlint stops with an error that names the rule and the item, and no file is linted.
A count that the guard does not check as written, such as `{40}` or `{32,40}`, is an error, and the message says to write `{40,}` or `{32,}`.
A second way to write the same guard, such as `+` or `\d`, is an error, and the message gives the supported form.
A count that makes the guard always true, such as `*`, `?`, or `{0,}`, is also an error.
Secretlint does not run the pattern without the guard instead, so a mistake in the guard is found at the first lint and not as a slow lint.

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
- **Condition of a pattern:** A reference to a boolean option of the rule (`options.<name>`), with or without `!` before it, that decides whether a pattern of the rule is a part of the lint.

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

- Should `meta.keywords` of a rule without patterns also have guards? No rule needs it today.
- Which rule uses a guarded keyword first? The keywords of the recommended preset are long, and a guard changes nothing for them.
