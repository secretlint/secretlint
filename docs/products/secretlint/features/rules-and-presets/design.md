# Rules and rule presets design

[日本語](design.ja.md)

## About this document

This document describes how the built-in rules and presets of [Rules and rule presets](requirements.md) are built, tested, and distributed.
The parent Product is [Secretlint](../../product.md).

### Audience

People and agents who add or change a built-in rule or a built-in preset.

### Prerequisites

The rule interface of `@secretlint/types` (`SecretLintRuleCreator` and `SecretLintRulePresetCreator`), and the pnpm workspace of this repository.

### Outside this document

- How the configuration loader finds a rule from its rule id: [Configuration loading](../config-loading/requirements.md)
- How a custom rule is created and tested: [Custom rules](../custom-rules/requirements.md)
- How `@secretlint/core` runs rules (the lint plan and the scan of keywords)

## Implementation approach

The built-in rules and presets are part of `@secretlint/core`, together with the engine that runs them and their tests.
`@secretlint/core` has a table from rule id to rule, and the configuration loader looks up this table before it looks for a package.
The packages of the same names stay as thin packages that re-export the rules from `@secretlint/core`.

Publishing a new npm package with trusted publishing takes manual steps: publish an empty package first, set up its trusted publisher on npm, and only then release the rule. Writing the code of a rule is not enough to publish it, so adding rules this way does not scale.
A built-in rule is a directory in `@secretlint/core`, so adding one needs no new package.

### Rule directories

A built-in rule lives in `packages/@secretlint/core/src/builtin/rules/<name>/`, and its main module exports `creator` and `messages`.
`creator.meta` has the rule id `@secretlint/secretlint-rule-<name>`, the type (`scanner` or `filter`), `recommended`, `supportedContentTypes`, and `docs.url`, which points to the README of the rule in the repository.
`@secretlint/core` adds the message ID to `docs.url` to make the link of each message.

A rule that finds secrets with regular expressions declares `patterns`, and `@secretlint/core` runs them.
Other rules, such as the GCP rule, implement `create()` and report with `context.report()`. The patterns of the pattern rule come from its options; see [User-defined patterns](#user-defined-patterns).

The built-in rules do not import Node.js modules at the top level, so that `@secretlint/core` loads in a browser.
A small `basename` helper replaces `node:path`.
The GCP rule checks a `.p12` file from `contentBytes` of the source, without reading the file. For the MAC of the file, it imports `node:crypto` only when it is available, and uses Web Crypto otherwise.
The pattern rule matches file paths with `picomatch` in the way `micromatch` did, so `micromatch` is no longer a dependency.

### Patterns that an option turns on or off

A pattern has the optional property `when`, the condition for the pattern to be a part of the lint.
`when: "options.name"` is true when the option `name` of the rule is `true`, and `when: "!options.name"` is true unless the option is `true`.
The prefix `options.` says that the value is an option of the rule, as a rule reads `context.options`. A condition on another value, such as the shared options, can be added later with another prefix.
For example, the AWS rule has `when: "options.enableIDScanRule"` on its patterns of the access key ID and the account ID. The keywords of the account ID are common words such as `account`, so running the pattern only to discard its matches in `report()` took a large part of the lint of a repository that has the word in many files.

When `@secretlint/core` makes the lint plan of a configuration, it reads the options of each rule and leaves out the patterns whose `when` is false:

- A pattern without `when` is in the plan.
- `when` must match `!` (optional), `options.`, and a name of letters, digits, `_`, and `$` that does not start with a digit. For any other value, making the plan throws an error with the rule id and the value. So a string that a newer core supports, such as `options.a && options.b` or a reference with another prefix, is never read in another way.
- The value of the option is read from the own property of the options of that name. A property that the options object inherits, such as `constructor`, is not an option. An option that is not set is `false`.
- If the value is set and is not a boolean, making the plan throws an error with the rule id and the name of the option. The core does not convert a value to a boolean.

The plan is made once for a configuration, so the option is read once, not for each file.
A pattern that is not in the plan has no entry in the keyword matcher, so its keywords do not make the core read a file as a string, and its regular expression never runs.
`report()` of a pattern does not check the option again.

The type of the property is `SecretLintRulePatternWhen<Options>` of `@secretlint/types`: the names of the properties of `Options` whose value is a boolean (`SecretLintRulePatternBooleanOptionName<Options>`), after `options.`, with or without `!` before it, as a template literal type (`` `options.${Name}` | `!options.${Name}` ``). A name of another option, or a name that is not an option, is a type error. If `Options` has no property, such as the default `{}` and `unknown`, any name is accepted after `options.`.
The strings are the second type parameter of `SecretLintRulePattern`, `SecretLintRulePatternCreator`, and `SecretLintRuleCreator`, and its default is computed from `Options`, so a rule does not pass it. If the type of the property used `Options` directly, a rule creator with its own `Options` would not be assignable to `SecretLintRuleCreator<unknown>`, because TypeScript does not accept a type that uses the names of the properties of `Options` in place of the one of `unknown`. As a type parameter of its own, the strings of a rule are assignable to the strings of `SecretLintRuleCreator<unknown>`, which accept any name. So a list of rules with different options, such as `rules` of a preset creator and `builtinRules`, stays `SecretLintRuleCreator<unknown>[]`.

`when` is one of the properties of a pattern that the core knows, and the core throws on an unknown property. The runner `@secretlint/core/testing` keeps `when` when it removes the keywords and the scope for its comparison, because the property decides what the rule reports and is not an optimization.

### User-defined patterns

`@secretlint/core` reads the options of `@secretlint/secretlint-rule-pattern` as patterns of the lint plan, in the same way as the `patterns` of the other built-in rules.
The creator of the rule has `patterns: []` and no `create()`. When the core makes the plan, it finds the rule by the creator object, not by the id, and compiles each entry of `options.patterns` with `compileUserPatterns()` of `src/builtin/rules/pattern/user-patterns.ts`:

- Each RegExp-like string of `patterns` (or `pattern`) becomes a plan pattern with the scope `file`. The string becomes a RegExp with `createRegExp()` of `@textlint/regexp-string-matcher`, which `matchPatterns()` used before, so a pattern matches the same text: `/source/flags` becomes `new RegExp(source, flags + "ug")`, and another string is escaped.
- The keywords of a plan pattern are `keywords` of the entry when it has them. Otherwise they are the result of `extractKeywords(regex)` of `src/helper/extract-keywords.ts`, or none. `keywords: []` means none: the pattern runs on every file, which is a way out when a found keyword is wrong.
- `report()` of a plan pattern checks the global `allows` and the `allows` of the entry, and reports the message `PATTERN` with the name of the entry, as the rule does today.
- `filePathGlobs` becomes a condition on the file path of a plan pattern. The core checks it before it runs the pattern, and a pattern whose glob does not match does not run, even when its keywords are found. A path is matched by `picomatch` in the same way as today.
- An entry with only `filePathGlobs` becomes a path pattern: when the path matches, it reports the file name with the range of the whole content. A path pattern does not need keywords, and the plan keeps the path patterns apart, so a file that matches no keyword and no path pattern runs no rule. The keyword scan of a worker thread does not check the path, so `requiresKeyword` of the keyword scan plan is false while a path pattern is enabled, and the workers hand every file to the main thread.
- When `options.patterns` is missing or empty, the plan has no pattern of the rule. So `secretlint --init`, which writes the rule without options, adds nothing to the lint.
- The checks of the options (both `patterns` and `pattern`, an entry without `patterns`, `pattern`, and `filePathGlobs`, and an invalid `keywords`) throw when the plan is made, before any file is linted.

The plan is made once for a configuration, so each string is parsed and each keyword is found once, not for each file.
The profile id of a plan pattern is `@secretlint/secretlint-rule-pattern#<index> <name>`, with ` (no keywords)` after the name when the pattern runs on every file.
The snapshot runner of `@secretlint/core/testing` compares the result with the result without keywords. For this rule, it passes the same creator with `keywords: []` on each entry, because the core finds the rule by the creator object.
`@secretlint/core` now imports the creator of the rule, `picomatch`, and `@textlint/regexp-string-matcher` from its main module, which were dependencies of the package already. The browser bundle of the core and the recommended preset grows from 209.75 kB to 218.21 kB (45.16 kB to 46.77 kB with gzip).

#### Finding keywords in a pattern

`extractKeywords(regex)` returns strings that every match of `regex` must contain, or `undefined`. It reads `regex.source` from the start and keeps runs of ASCII characters that every match consumes one after another:

- A literal character or an escaped punctuation character (such as `\.` or `\/`) adds to the current run. The flag `i` lower-cases it, because the keyword matcher is ASCII case-insensitive.
- A character class, `.`, `^`, `$`, `\d`, `\w`, `\s`, `\b`, an escape such as `\x41` or `\u0041`, a back reference, and a non-ASCII character end the current run.
- A character with `?`, `*`, or `{0,...}` is optional, so it is dropped and the run ends. A character with `+` or `{n,...}` (`n` >= 1) is kept, and the run ends.
- A group that every match passes (no quantifier, or a quantifier with a minimum of 1 or more) gives the union of the best run of each alternative, when every alternative has one. A positive lookahead and lookbehind count as groups, because their text must be in the content. A negative lookaround ends the run.
- `|` at the top level makes the result the union of the best run of each alternative, and `undefined` when one alternative has none.
- Any syntax that it does not know, such as the flag `v` or a group with modifiers, gives `undefined`.

A run shorter than 3 characters is not used, because a short keyword is found in most files and makes the scan report many positions.
Of the runs, the one whose shortest keyword is the longest is used.

A prototype was checked against the 38 patterns of the built-in rules: it found keywords for all of them, 24 were the same as the keywords that the rules declare, and the others were shorter (for example `http` for `http://`). On the 142 inputs of the snapshot tests, no match was in a file without one of the found keywords. 12,852 random patterns with random texts had no such match either. These checks do not prove it, so the extraction is conservative and is tested with the built-in rules.

### Keywords with a guard

An item of `keywords` of a pattern is a string or a keyword object `{ keyword, after }`, which is a guarded keyword.

```ts
{
    pattern: /(?<![A-Za-z0-9_-])00[A-Za-z0-9_-]{40}(?![A-Za-z0-9_-])/g,
    keywords: [{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }],
    scope: "line",
    report(match, context) { /* ... */ },
}
```

`keyword` is a keyword, with the same rules as an item that is a string: ASCII, no character has a special meaning, and it is matched without the case of ASCII letters.
`after` is the guard. It has two parts, in this order:

| Part  | Syntax                                                                                                                                  | Example                     |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Set   | `[` and `]` around ASCII characters and ranges such as `a-z`. `\` is written before `\` and `]`. A `-` as a character is the last item. | `[A-Za-z0-9_-]`, `[0-9a-f]` |
| Count | `{n,}`. `n` is from 1 to 255.                                                                                                           | `{40,}`, `{20,}`            |

The guard is met where at least `n` characters of the set follow the keyword.
`after` is a subset of the syntax of regular expressions, and it means what it says there: `[A-Za-z0-9_-]{40,}` is 40 or more characters of the set. A set and a least count is also all that the scan can check without going back.

The count has no `{n}` and no `{n,m}`. The guard checks only that `n` characters follow, and it does not check where the run ends: the key of the example has 40 characters, and the guard is also met in a run of 50.
So `{40}` in a guard would read as "40 characters" and mean "40 or more", and `{40,60}` would have a number that is not used. The maintainer decided that a guard must not read differently from what it checks, so the syntax has only the form that says "or more".
A rule author who copies `[A-Za-z0-9_-]{40}` from `pattern` adds the `,`, and the error for `{40}` says so.

The syntax is strict, by the decision of the maintainer: one guard has one way to write it, apart from the order of the items of the set.
So there is no `+` for `{1,}`, no `\w` and `\d` for the ranges, and no set without `[` and `]`. In the set, `\` is only before `\` and `]`, and a `-` that is a character of the set is the last item, as in `[A-Za-z0-9_-]`.
Fewer forms keep the parser small, make two guards easy to compare, and leave every other form free for a later meaning.

The pattern of the example is the reason for the guard. Its keyword `00` is in most files, so with `keywords: ["00"]` the lines of all these places are tested with the regular expression. With the guarded keyword, the scan drops these places by itself.

The guard is in `keywords`, and not in a property of its own, because it is a part of what a keyword is: where to look for the secret. One list also keeps the keywords of a pattern in one place.
It is an object, and not a new syntax in the string, because the meaning of a string of `keywords` must not change. A keyword such as `mongodb+srv://` of the database connection string rule has `+`, and it is a keyword as written.

`@secretlint/core` reads the items when it makes the lint plan, and reads `after` with a small parser of its own (`src/helper/keyword-guard.ts`). The parser has no dependency, because the core also runs in browsers.

- The parser returns the characters of the set and `n`. The characters are sorted, so `[a-z0-9]{32,}` and `[0-9a-z]{32,}` are the same guard, and two patterns that declare them for the same keyword share one entry of the keyword matcher.
- For an object that is not a guarded keyword, making the plan throws an error with the rule id and the item: `keyword` or `after` is not a string, the object has another property, a character is not ASCII, the set starts with `^`, the count is `{n}`, `{n,m}`, `+`, `*`, `?`, 0, or over 255, the set has `\w` or `\d`, or `after` has anything else. The error for a form that has a supported form with the same meaning, such as `{40}`, `+`, and `\d`, gives that form. So a guard that a newer core supports is never read in another way, and a condition such as what is before the keyword can be added later as a property with a new name.
- A keyword is lower-cased and matched without the case of ASCII letters, as a string and as `keyword` of an object. The keyword matcher has no case-sensitive keyword any more. gitleaks, Betterleaks, and TruffleHog also lower-case their keywords and the content, and have no option for it ([gitleaks detect.go](https://raw.githubusercontent.com/gitleaks/gitleaks/master/detect/detect.go), [TruffleHog ahocorasickcore.go](https://raw.githubusercontent.com/trufflesecurity/trufflehog/main/pkg/engine/ahocorasick/ahocorasickcore.go)).
- The parser returns the set as written, and the scan compares the content with it as it is: `[a-f0-9]` is not met by `A`. A rule whose regular expression has the `i` flag writes both cases in the set, as `[A-Fa-f0-9]`. A set that is too narrow fails the tests when a test case has such a key.
- `after` is required. `{ keyword: "SG." }` is an error, because it would be a second way to write `"SG."`.
- The property `caseSensitiveKeywords` of a pattern is removed, by the decision of the maintainer, and nothing replaces it. It stated the case for all keywords of a pattern, and its only use was to keep a pattern from running for a common word in another case: `SG.` of the SendGrid rule, and the prefixes `AKIA` and others and `ACCOUNT` of the AWS rule. Declarative patterns have not been released, so no released rule has the property, and a core that gets the property throws on it as on any unknown property. The results of the rules do not change, because a keyword only selects where the regular expression runs. What can change is how many lines the regular expression is tested on:
    - The prefixes of the AWS access key ID become guarded keywords, such as `{ keyword: "AKIA", after: "[A-Z0-9]{16,}" }`. The set is checked as written, so `asia-northeast1` does not meet it.
    - The AWS account ID declared `ACCOUNT`, `account`, and `Account`. It declares `account` once, and almost nothing changes.
    - `SG.` of the SendGrid rule is also found in `msg.`, and its regular expression has `\w{1,128}` after `SG.`, so no guard can drop these places. The rule runs on more lines until its regular expression states the lengths of the parts of the key. That changes what the rule reports, so it is not a part of this design.
- A pattern is selected for a source if one of its keywords is found, and for a guarded keyword only where its guard is met. `scope: "line"` needs valid keywords, and a guarded keyword is one.
- `when` works as before: a pattern that is not in the plan has no entry in the matcher.

The type of an item is `SecretLintRulePatternKeyword` of `@secretlint/types`: `string | { keyword: string; after: string }`, and `keywords` of a pattern is a list of it. `meta.keywords` stays a list of strings.
Code that reads `keywords` of a pattern as strings has to handle an object. In the Secretlint repository, this is the lint plan and the runner of the tests.

Declarative patterns have not been released, so keyword objects are a part of their first release, and no released core reads `keywords` of a pattern in another way.

How the scan checks a guard is in the Design of [Secret scanning](../secret-scanning/requirements.md). How the tests check it is in the Design of [Custom rules](../custom-rules/requirements.md).

No built-in rule declares a guarded keyword at first. The keywords of the built-in rules are long, and a guard changed nothing for them in the measurement. The first use is a rule for a key with a short prefix.

`keywords` of an entry of the options of `@secretlint/secretlint-rule-pattern` gets the same items, for the patterns that a user writes. `src/builtin/rules/pattern/user-patterns.ts` passes them to the patterns of the plan, so they are read by the same code. When an entry has no `keywords`, the keywords that `extractKeywords()` takes from the regular expression have no guard. It does not use a run shorter than 3 characters, so a pattern with a short prefix gets a keyword only if the user writes one.

### The built-in table and the presets

`@secretlint/core/builtin` exports the lists `builtinRules`, `recommendedRules`, and `canaryRules`, the presets `presetRecommend` and `presetCanary`, and `getBuiltinRule(id)`, which returns the rule or preset for a full rule id, or `undefined`.

Both presets are made by one `createPreset(id, rules)`. A preset has `meta.type: "preset"`, its list of rules as `rules`, and a `create()` that calls `context.registerRule()` for each rule in order.
`@secretlint/core` matches each registered rule with the `rules` entries of the preset entry by rule id, and applies its `options`, `severity`, and `allowMessageIds`.
A rule whose entry has `disabled: true` is not registered, in the same way as a top-level entry with `disabled: true`.

`canaryRules` is the source of the rule list. A new rule is added to `canaryRules` first, and to `recommendedRules` in a major release.
Currently `canaryRules` is a copy of `recommendedRules`.

### Packages of the same names

Each package `@secretlint/secretlint-rule-<name>` of a built-in rule re-exports `@secretlint/core/builtin/rules/<name>`.
The preset packages export `creator` and `rules` from `@secretlint/core/builtin`.
These packages depend on `@secretlint/core` of the same version, and have no tests of their own.

### Tests

The snapshot test cases are in `packages/@secretlint/core/test/builtin/rules/<name>/snapshots/`.
They run with the runner `@secretlint/core/testing`, which checks each case in the same way as `@secretlint/tester`: the results of the bytes source, the string source, and the rule without its keywords optimization must be the same.
The runner is in `@secretlint/core` because `@secretlint/tester` depends on `@secretlint/core`, so the tests of `@secretlint/core` cannot use `@secretlint/tester` without a cycle in the workspace.
`@secretlint/tester` wraps the runner, and adds the loading of the configuration file through the configuration loader.

In the tests of `@secretlint/core`, the configuration files of the test cases name rule ids, and the runner looks them up with `getBuiltinRule`.
A test fails when a rule directory has no snapshot directory.
The presets have no test cases of their own. Their test runs each test case of each rule in the preset through the preset, with the options of the rule under the preset entry, and checks two things: the messages of the rule are the same as the `output.json` of the rule, with `ruleParentId` of the preset, and an `ok.*` case has no message of any rule in the preset. The second check finds a rule of the preset that reports a value that another rule treats as valid.
Before, the test cases of the rules were copied into a snapshot directory of each preset by a script. The copies had the same content except `ruleParentId`, and had to be copied again when a rule changed, so the test reads the cases of the rules instead.

`pnpm run gen:rule` creates the rule directory, its README, and the test cases `ng.secret` and `ok.valid` in `@secretlint/core`.

## Architecture and sequence diagrams

No diagram is needed: a preset is a list of rules, and its only interaction is `registerRule()` during the setup of a lint.

## Data model and ER diagrams

- **Rule creator:** `meta` (id, type, recommended, supportedContentTypes, docs.url, optional keywords), `messages`, and either `patterns` or `create()`.
- **Pattern:** `pattern`, optional `keywords` (strings, or keyword objects `{ keyword, after }`), `scope`, and `when`, and `report()`.
- **Preset creator:** `meta` (id, type `preset`), `rules` (rule creators), and `create(context, options)`.
- **Preset entry of the configuration:** `id`, `options`, and `rules`, a list of entries with `id`, `options`, `severity`, `allowMessageIds`, and `disabled`.

## APIs and interfaces

- `@secretlint/core/builtin`: `builtinRules`, `recommendedRules`, `canaryRules`, `presetRecommend`, `presetCanary`, `getBuiltinRule(id)`, and `builtinRuleIds`.
- `@secretlint/core/builtin/rules/<name>`: `creator` and `messages` of one rule.
- `@secretlint/core/testing`: `createSnapshotTestCases(options)`, which returns the test cases of a snapshot directory.
- The packages of the same names export the same `creator` and `messages`, or `creator` and `rules` for a preset.

## External service integration

`@secretlint/core` and the packages of the same names are published to the npm registry from the release workflow of the repository.

## Data handling

Rules receive the content of one file from `@secretlint/core` and return messages. They do not store or send content.

## Authentication and authorization notes

None. Rules run with the permissions of the process that runs Secretlint.

## Security considerations

A regular expression of a rule limits its repetition so that a crafted file does not make the scan take too long.

## Deployment notes

The packages of the same names are still published, so a configuration or a `package.json` that names them keeps working. Deprecating them is a separate change.
The `--init` of the npm package writes the rules that it finds in `package.json`. Until it writes the recommended preset without them, the documentation still tells users to install the preset package.

## Alternatives considered

- **One package per rule, with the rules bundled into the presets:** This was the design before the change. Each new rule needed a new npm package, and publishing it took the manual steps of trusted publishing described above.
- **One separate package for the built-in rules:** The rules and their tests would be in a package next to `@secretlint/core`, as Biome keeps its rules in a crate separate from its engine. It was not chosen, because the rules and the engine must have the same version. `@secretlint/core` runs the `patterns` that the rules declare, and a new rule on an older engine is not supported, so a separate package could be installed in a version that does not match `@secretlint/core`. With one package, the rules always come with the engine that runs them, and only one package has to be published and installed. The rules, the engine, and the tests are in one package, as oxlint and ESLint do.
- **A function `enabled(options)` on a pattern:** The pattern would have a function that returns whether it is enabled. It can express any condition, but it was not chosen. A rule states what it finds as data and `@secretlint/core` runs it, and a function hides from the core which option it reads. Each rule would also write its own condition, so the same value of an option, such as the string `"true"`, could enable a pattern in one rule and not in another. With `when`, the condition is in one place in the core, the name is checked by the type, and the data can be listed or passed to another thread.
- **Two properties, `enabledByOption` and `disabledByOption`:** Each would have the name of an option. It was not chosen, because a pair of properties for one condition grows with each new kind of condition, and a pattern could have both. One condition with `!` writes both, as the `when` clause of VS Code and CEL do.
- **The name of the option without `options.`:** `when: "enableIDScanRule"` is shorter. It was not chosen, because a bare name can only mean an option of the rule. With the prefix, a condition on another value can be added later with another prefix, and the existing conditions keep their meaning.
- **An expression language such as CEL:** The condition would be any expression of the options. It was not chosen: an evaluator adds a dependency and size to `@secretlint/core`, which also runs in browsers, a free expression can not be checked by the type of the options, and the only use today is one boolean option. `when` is written so that it reads as a subset of such a language, and the core rejects what it does not support, so operators can be added later.
- **Reading a truthy value as true:** The string `"true"` enabled the patterns of the AWS rule when the rule checked the option in `report()`. It was not kept, because `when` is a new property with no behavior to keep, and a condition on a boolean should not depend on how each value converts. A configuration with such a value stops with an error instead of changing its result silently.
- **Returning early in `report()` when the option is not set:** This was the design before the change. The result is the same, but the keywords of the pattern were searched, the file was read as a string, and the pattern ran on it, only to discard every match.
- **Finding the pattern rule by its id:** The core would skip `@secretlint/secretlint-rule-pattern` without patterns by its id. It was tried (#1825) and not chosen: it adds an exception for one rule to the plan and to the cache of the plan, a rule of another package with the same id would be skipped, and a rule without keywords still runs on every file when it has patterns.
- **Patterns from a function of the rule:** The rule would return its patterns from a function of the options. It was not chosen, because a rule states what it finds as data and the core runs it. The pattern rule is the only rule whose patterns come from the configuration, so the core owns this one conversion.
- **A new property of the configuration file for user-defined patterns:** Patterns could be written at the top level of the configuration file instead of the options of a rule. It was not chosen now, because existing configurations name the rule, and the messages have its rule id. It can be added later on top of the same conversion.
- **Only the keywords that the user writes:** The core would not find keywords in a pattern. It was not chosen, because the existing configurations have no `keywords`, and they would still run on every file.
- **Keywords for the non-ASCII letters that fold to an ASCII letter:** With the flag `i`, the core could add the Kelvin sign and the long s to the keywords that have `k` or `s`. It was not chosen: the keyword matcher is ASCII only, the number of keywords would grow with each `k` and `s`, and Secretlint prefers no false positive to no false negative.

- **A guard that the core takes from the regular expression of the pattern:** The rule would declare only keywords, and the core would read what follows the keyword from `pattern`. Betterleaks infers its guard from the regular expression in this way ([assignment_guard.go](https://raw.githubusercontent.com/betterleaks/betterleaks/main/scan/assignment_guard.go)). A prototype did this for the measurement. It was not chosen by the maintainer: whether a guard is found depends on how the regular expression is written, such as a lookbehind before the keyword or a group after it, and the prototype found no guard for 21 keywords of the built-in rules for this reason. The rule author also can not see which guard is used. A guard that the rule states is data that can be read, tested, and shown in the profile.
- **A new syntax in the strings of `keywords`:** A string of `keywords` with a set and a count, such as `00[A-Za-z0-9_-]{40}`, would be read as a guarded keyword. It was not chosen, because it changes the meaning of an existing property: a keyword such as `mongodb+srv://` or `[default]` is a valid keyword today, and it would need an escape.
- **A property of its own, `guardedKeywords`, with one string for the keyword and the guard:** This was the first proposal. It was not chosen by the maintainer: a guard is an extension of a keyword, so it is in `keywords`. One string would also need `\` before the characters of the keyword that have a meaning in a regular expression, such as `pk\.`, while `keyword` of the object is written as it is.
- **An object without a syntax, such as `{ keyword: "00", chars: "A-Za-z0-9_-", min: 40 }`:** It needs no parser for the count. It was not chosen, because the set still needs a syntax for ranges, and it can not be copied from the regular expression.
- **A keyword that is not a part of the secret:** The pattern would use the name of the service as its keyword, and report the value near it. It was not chosen by the maintainer: Secretlint does not add a rule that reports a value because of a word near it. A rule finds a secret by the format of the secret.
- **Short forms such as `+`, `\w`, and `\d`:** They are common in regular expressions, and the first proposal had them. They were not chosen by the maintainer: each is a second way to write a guard that the syntax can already state.
- **A count with a most that is not used:** `{n}` and `{n,m}` would be accepted and mean `{n,}`, so that the start of `pattern` can be copied as it is. A regular expression that is tested at one place also matches the start of a longer run. It was not chosen by the maintainer: `{40}` reads as "40 characters", and the guard would mean something else than it reads.
- **More syntax: a most of the count that is checked, what follows the run, what is before the keyword, and a set with `^`:** A regular expression can state these, and they can drop more places. They were not added. A most and an end are true only if the regular expression of the pattern also states an end, so they are easy to write wrong. A set with `^` has characters that are not ASCII, and then the bytes and the string count differently. The core rejects all of them now, so each can be added later without changing the meaning of an existing string.
- **A case-sensitive keyword:** An option would say if a keyword is case-sensitive, as `caseSensitive` of the keyword object or `caseSensitiveKeywords` of the pattern, or a keyword object would always be matched as written. Earlier versions of this design had each of them. They were not chosen by the maintainer: a rule that always matches without the case is simpler to write, and the cost is only that the regular expression can be tested on more lines. A guard, which is checked as written, takes that cost away where the secret has a fixed case.
- **Keywords that follow the `i` flag of the regular expression:** A keyword would be case-sensitive when the regular expression of its pattern has no `i` flag. It was not chosen: no other tool that was looked at does this, and a missing `i` flag is often not a decision of the rule author.

## Open questions

- The open questions of the Requirements: guards for `meta.keywords`, and the first rule that uses a guarded keyword.
