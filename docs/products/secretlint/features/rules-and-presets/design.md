# Rules and rule presets design

[日本語](design.ja.md)

## About this document

This document describes how the rules and presets of [Rules and rule presets](requirements.md) are built and distributed.
The parent Product is [Secretlint](../../product.md).

### Audience

People and agents who add or change a rule or a preset provided by Secretlint.

### Prerequisites

The rule interface of `@secretlint/types` (`SecretLintRuleCreator` and `SecretLintRulePresetCreator`), and the pnpm workspace of this repository.

### Outside this document

- How the configuration loader finds a rule from its rule id: [Configuration loading](../config-loading/requirements.md)
- How a rule is tested: [Custom rules](../custom-rules/requirements.md)
- How `@secretlint/core` runs rules (the lint plan and the scan of keywords)

## Implementation approach

Each rule provided by Secretlint is its own npm package, and each preset is an npm package that bundles the code of its rules.
The rule id is the package name, so the configuration loader can find a rule by installing and importing the package of the same name.

### Rule packages

A rule lives in `packages/@secretlint/secretlint-rule-<name>/` and is published as `@secretlint/secretlint-rule-<name>`.
Its main module exports `creator` and `messages`.
`creator.meta` has the rule id, the type (`scanner` or `filter`), `recommended`, `supportedContentTypes`, and `docs.url`, which points to the README of the package.
`@secretlint/core` adds the message ID to `docs.url` to make the link of each message.

A rule that finds secrets with regular expressions declares `patterns`, and `@secretlint/core` runs them.
Other rules, such as the pattern rule and the GCP rule, implement `create()` and report with `context.report()`.

### Preset packages

A preset exports `creator` with `meta.type: "preset"`, its list of rules as `rules`, and a `create()` that calls `context.registerRule()` for each rule in order.
`@secretlint/core` matches each registered rule with the `rules` entries of the preset entry by rule id, and applies its `options`, `severity`, and `allowMessageIds`.
A rule whose entry has `disabled: true` is not registered, in the same way as a top-level entry with `disabled: true`.

The preset packages depend on their rule packages only as devDependencies, and are built with Rollup into one module that contains the code of all their rules.
So installing a preset does not install the rule packages, and the version of each rule is the one bundled in the preset.
Bundling reduces the cost of loading the rules.

The canary preset is the source of the rule list.
The `sync-canary` script of the recommended preset copies the source and the tests of the canary preset into the recommended preset, replacing the preset id, when the rules are promoted in a major release.

## Architecture and sequence diagrams

No diagram is needed: a preset is a list of rules, and its only interaction is `registerRule()` during the setup of a lint.

## Data model and ER diagrams

- **Rule creator:** `meta` (id, type, recommended, supportedContentTypes, docs.url, optional keywords), `messages`, and either `patterns` or `create()`.
- **Preset creator:** `meta` (id, type `preset`), `rules` (rule creators), and `create(context, options)`.
- **Preset entry of the configuration:** `id`, `options`, and `rules`, a list of entries with `id`, `options`, `severity`, `allowMessageIds`, and `disabled`.

## APIs and interfaces

The public interface of a rule package is its exports, `creator` and `messages`, and of a preset package `creator` and `rules`.
Code that imports `creator` from a rule package can pass it to `@secretlint/core` directly.

## External service integration

The packages are published to the npm registry from the release workflow of the repository.

## Data handling

Rules receive the content of one file from `@secretlint/core` and return messages. They do not store or send content.

## Authentication and authorization notes

None. Rules run with the permissions of the process that runs Secretlint.

## Security considerations

A regular expression of a rule limits its repetition so that a crafted file does not make the scan take too long.

## Deployment notes

None.

## Alternatives considered

There is no record of alternatives to one package per rule, or to bundling the rules into the presets.

## Open questions

None.
