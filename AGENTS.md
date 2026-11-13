# secretlint Development Guide

This file provides guidance for AI assistants working on the secretlint codebase.

## Project Overview

secretlint is a pluggable linting tool that prevents committing secrets/credentials. It is a TypeScript monorepo managed with pnpm workspaces and Turborepo.

## Architecture Overview

Core data flow:

```
CLI (secretlint) → SecretLintEngine (@secretlint/node) → config-loader → core (lintSource) → rules → formatter → output
```

1. **CLI** (`packages/secretlint/src/cli.ts`) parses arguments, calls `runSecretLint()`
2. **SecretLintEngine** (`packages/@secretlint/node`) loads config, discovers files via glob, lints files one by one
3. **config-loader** searches for `.secretlintrc.*`, validates with AJV schema, resolves each rule id from the built-in rules of core (`@secretlint/core/builtin`) first, and dynamically imports rule modules only for other ids
4. **core** (`packages/@secretlint/core/src/index.ts` - `lintSource()`) builds a lint plan per config (`LintPlan.ts`), scans the content once for the keywords of all rules, runs the matching `patterns` and rules, collects messages
5. **RuleContext** (`packages/@secretlint/core/src/RuleContext.ts`) provides `report()`, `ignore()`, `createTranslator()` to each rule
6. **formatter** converts results to textlint-compatible format, applies selected formatter (stylish, json, sarif, table, mask-result)

### Key Package Dependencies

```
secretlint (CLI)
  └→ @secretlint/node (engine)
       ├→ @secretlint/config-loader (config resolution + validation)
       │    └→ @secretlint/resolver (dynamic imports)
       ├→ @secretlint/core (linting engine)
       │    └→ @secretlint/types (shared type definitions)
       ├→ @secretlint/source-creator (file → SecretLintRawSource)
       ├→ @secretlint/formatter (output formatting)
       └→ @secretlint/profiler (performance tracking)
```

### Dependency Catalog

pnpm catalog (`pnpm-workspace.yaml` with `strictCatalog: true`) manages shared dependency versions. When adding or updating dependencies used across packages, update the catalog entry rather than individual package.json files.

## Quick Reference

- **Package manager**: pnpm (pinned version in `package.json` `packageManager` field)
- **Node.js version**: See `.node-version`
- **Build**: `pnpm run build` (uses Turborepo)
- **Test**: `pnpm test` (all packages) or `cd packages/PACKAGE && pnpm test` (single package)
- **Update snapshots**: `UPDATE_SNAPSHOT=1 pnpm test`
- **Format**: `pnpm format` (Prettier)
- **Lint**: `pnpm lint` (runs secretlint itself)
- **CI check**: `pnpm run ci` (build + test + lint)
- **Browser test**: `pnpm turbo run build --filter=@secretlint/e2e-browser... && cd e2e/core-browser && pnpm exec playwright install chromium && pnpm run test:browser` (bundles `@secretlint/core` + the recommend preset without Node.js polyfills and runs them in Chromium)
- **Generate new rule**: `pnpm run gen:rule`

## Monorepo Structure

```
packages/
  secretlint/              # CLI package
  @secretlint/
    types/                 # Core TypeScript type definitions
    core/                  # Linting engine
      src/builtin/rules/<name>/  # Built-in rules (code of the official rules)
      src/builtin/index.ts       # Built-in table: rule id -> rule, and the rules of the presets
      src/testing/               # Snapshot test runner (`@secretlint/core/testing`)
      test/builtin/rules/<name>/snapshots/      # Snapshot tests of each built-in rule
    tester/                # Snapshot testing for rules outside core (wraps `@secretlint/core/testing`)
    config-loader/         # .secretlintrc loader
    node/                  # Node.js integration
    secretlint-rule-*/     # Compatibility packages that re-export a built-in rule (no tests),
                           # and the rules that are not built in (no-dotenv, no-homedir, no-k8s-kind-secret, secp256k1-privatekey)
    secretlint-rule-preset-recommend/  # Stable preset (re-exports the built-in preset)
    secretlint-rule-preset-canary/     # Experimental preset (re-exports the built-in preset)
e2e/core-browser/          # Browser test of core + recommend preset (Playwright)
docs/                      # Documentation
examples/                  # Example projects
.scaffdog/                 # Template for generating new rules
```

## Code Conventions

- **Language**: TypeScript (strict mode)
- **Module system**: ESM (`"type": "module"`)
- **Formatter**: Prettier (printWidth: 120, tabWidth: 4, singleQuote: false, trailingComma: none)
- **Test framework**: vitest for `@secretlint/core` (including the built-in rules) and `@secretlint/node`; Node.js native `test` module + `@secretlint/tester` for the rules outside core
- **Single package test**: `pnpm test --filter="@secretlint/core"`; one built-in rule: `cd packages/@secretlint/core && npx vitest run test/builtin/rules.test.ts -t "secretlint-rule-<name>"`
- **Commit messages**: Angular Convention (`type(component): description`)
  - Types: `feat`, `fix`, `docs`, `style`, `perf`, `test`, `chore`, `refactor`

## Creating a New Rule

### Step 1: Scaffold

```sh
pnpm run gen:rule
```

This uses scaffdog (`.scaffdog/new-rule.md`) to generate a built-in rule:

- `packages/@secretlint/core/src/builtin/rules/<name>/index.ts` and `README.md`
- `packages/@secretlint/core/test/builtin/rules/<name>/snapshots/` (snapshot tests)

**Do not add a new npm package for a rule.** Official rules are built into `@secretlint/core`, and a new package needs a manual npm trusted publishing setup.
The rule id stays `@secretlint/secretlint-rule-<name>`, and the config loader resolves it from core without a package.

Then register the rule in `packages/@secretlint/core/src/builtin/index.ts`: import it, and add it to `builtinRules` and `canaryRules`.

### Step 2: Implement the Rule

Every rule must export a `creator` object and `messages`.
A rule that finds secrets with regular expressions is defined with `patterns`, and it has no `create()`. The canonical structure:

```typescript
import type { SecretLintRuleCreator } from "@secretlint/types";

// 1. Define messages with at least `en` locale (ja is recommended)
export const messages = {
    MESSAGE_ID: {
        en: (props: { ID: string }) => `found secret: ${props.ID}`,
        ja: (props: { ID: string }) => `secret: ${props.ID} がみつかりました`,
    },
};

// 2. Define options type (always include `allows`)
export type Options = {
    allows?: string[];
};

// 3. Export creator
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-<name>",
        recommended: true,
        type: "scanner",                // "scanner" or "filter"
        supportedContentTypes: ["text"], // "text", "binary", or "all"
        docs: {
            url: "https://github.com/secretlint/secretlint/blob/master/packages/%40secretlint/secretlint-rule-<name>/README.md",
        },
    },
    patterns: [
        {
            pattern: /(?<!\p{L})YOUR_PREFIX_[A-Za-z0-9]{20,60}(?![A-Za-z0-9])/gu,
            keywords: ["YOUR_PREFIX_"], // every match contains one of them
            scope: "line",              // a match never includes a line break
            report(match, context) {
                // Check allows list using @textlint/regexp-string-matcher with context.options.allows
                const t = context.createTranslator(messages);
                context.report({
                    message: t("MESSAGE_ID", { ID: match.text }),
                    range: match.range,
                });
            },
        },
    ],
};
```

The core scans the content once for the keywords of all rules (as UTF-8 bytes if the source has `contentBytes`),
runs `pattern` only where its keywords are found, and calls `report()` for each match.
A rule that needs code other than regular expressions (e.g. checks the file name or parses a binary) defines `create(context, options)` that returns `{ file(source) {} }` instead of `patterns`.

### Key Rules for Rule Implementation

- **Always export `creator` and `messages`** from `src/index.ts`
- **`meta.id`** must match the npm package name exactly
- **`meta.type`** is `"scanner"` for detection rules, `"filter"` for rules that suppress other rules' reports
- **`keywords`** of a pattern lists ASCII strings that every match of the pattern contains, such as a token prefix (ASCII case-insensitive). Every string the pattern can report must contain at least one keyword, or the rule misses it. Omit `keywords` if no such string exists; the pattern then runs for all content. Make keywords as specific as the pattern allows (`"http://"` instead of `"://"`), and set `caseSensitiveKeywords: true` if the pattern is case-sensitive and the keyword is common in another case (`"SG."` vs `"msg."`)
- **`scope: "line"`** runs the pattern only on the lines that contain a keyword. Use it only if a match never includes a line break and the result does not depend on other lines. Otherwise use `"file"` (default)
- **`when`** of a pattern is the condition for the pattern to be a part of the lint, written with a boolean option of the rule as `options.<name>`: `when: "options.enableIDScanRule"` enables the pattern only when the option is `true`, and `when: "!options.name"` enables it unless the option is `true`. Use it for a pattern that an option turns on or off instead of returning early in `report()`: a disabled pattern is not a part of the lint, so its keywords are not searched and the pattern never runs. Only these two forms are supported, and the core throws on any other string and on an option whose value is not a boolean. Write the condition as data; do not add a function that decides it
- **A pattern has only the properties that `SecretLintRulePattern` defines.** The core throws on an unknown property, so an older secretlint never runs a newer rule with a different result. When adding a property to the pattern format, add it with a new name and never change the meaning of an existing property
- **The snapshot test runner checks `keywords` and `scope`**: for each snapshot it compares the result with the result of running the patterns on the whole content, and fails if they differ
- **`meta.keywords`** (optional, for rules with `create()`) skips the rule if the text content contains none of the keywords. Keywords are not checked for binary content. A rule with `patterns` does not need it
- **Messages must have at least `en` locale**; `ja` is strongly recommended
- **Always support `allows` option** using `@textlint/regexp-string-matcher` for user-defined exclusions
- **Regex boundary conventions**:
  - Leading: use `(?<!\p{L})` to prevent matching mid-word
  - Trailing: add a negative lookahead matching the pattern's character class (e.g., `(?![A-Za-z0-9])` or `(?![a-f0-9])`). Without this, greedy quantifiers over-match into adjacent content, causing incorrect `range` and breaking `allows` list matching
  - Example: `/(?<!\p{L})prefix_[A-Za-z0-9]{20,60}(?![A-Za-z0-9])/gu`
- **Length ranges**: follow official documentation if available, otherwise align with gitleaks/TruffleHog empirical data. Keep ranges as narrow as possible to minimize false positives
- **Report with `context.report()`** providing `message` (from translator) and `range` (`[startIndex, endIndex]`)
- **Filter rules use `context.ignore()`** instead of `context.report()`
- **Avoid ReDoS**: be careful with regex complexity; use character class limits (e.g., `[A-Za-z0-9]{100,10000}`)
- **Validate matches** when possible (e.g., check Base64 validity, magic bytes, checksums)

### Step 3: Write Tests

The tests of the built-in rules are in `@secretlint/core`, like the rules (the same layout as oxlint and ESLint: the engine, the rules, and the test runner in one package).
`@secretlint/tester` depends on `@secretlint/core`, so core uses its own runner `@secretlint/core/testing`, and `@secretlint/tester` wraps it for the rules outside core.

`packages/@secretlint/core/test/builtin/rules.test.ts` runs the snapshot directory of each built-in rule:

```
packages/@secretlint/core/test/builtin/rules/<name>/
  snapshots/
    ng.secret-found/       # Test case expecting errors
      input.txt            # Input content
      output.json          # Expected output (auto-generated)
      .secretlintrc.json   # (optional) config of the case. Rule ids are resolved from the built-in rules
    ok.valid-content/      # Test case expecting no errors
      input.txt
      output.json
```

- **Naming convention**: `ok.*` for valid (no errors), `ng.*` for invalid (errors expected)
- **Generate snapshots**: `cd packages/@secretlint/core && npm run updateSnapshot`
- **Optional files**: `.secretlintrc.json` for per-case rule options, and `options.json` or `options.ts` for `{ inputFilePath }`
- **A rule that needs other rules in the test** (like `filter-comments`): add them to `additionalRules` in `rules.test.ts`
- **Preset tests**: `presets.test.ts` runs the cases of each rule in a preset through the preset, with the rule's options under the preset entry. The messages of the rule must equal the rule's `output.json` (with `ruleParentId`), and an `ok.*` case must have no message of any rule in the preset. The presets have no test case files of their own

Tests of a rule outside core use `@secretlint/tester`:

```typescript
import test from "node:test";
import { snapshot } from "@secretlint/tester";
import { creator as rule } from "../src/index.js";

test("@secretlint/secretlint-rule-<name>", async (t) => {
    await snapshot({
        defaultConfig: {
            rules: [{ id: "@secretlint/secretlint-rule-<name>", rule, options: {} }],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") context.skip();
        });
    });
});
```

### Step 4: Add to Canary Preset

- Add the rule to `canaryRules` in `packages/@secretlint/core/src/builtin/index.ts` (done in Step 1)

> **Note**: Adding the rule to the **recommend** preset (`recommendedRules`) is a separate task done at major release time.

## Agent Workflows

### Rule Creator

When creating a new rule, verify every item:

1. `core/src/builtin/rules/<name>/index.ts` exports `creator` (SecretLintRuleCreator) and `messages`, and is registered in `core/src/builtin/index.ts`
2. Messages include `en` and `ja` locales
3. Options type has `allows?: string[]`
4. `meta.id` is exactly `@secretlint/secretlint-rule-<name>` (`<name>` is the directory name)
5. `meta.type` is `"scanner"` (detection) or `"filter"` (suppression)
6. `meta.keywords` (if set) is contained in every string the rule reports
7. Detection uses `matchAll` with global regex, reports via `context.report({ message, range })`
8. Allow list integrates `@textlint/regexp-string-matcher`
9. Tests have `ng.*` (error cases) and `ok.*` (valid cases) in the snapshot directory
10. Snapshots generated with `UPDATE_SNAPSHOT=1 pnpm test`
11. README.md documents the rule's purpose, detected patterns, and options

**Common pitfalls:**
- Regex must use the `g` flag for `matchAll`
- Range is `[startIndex, startIndex + match.length]` (exclusive end)
- Never hardcode English in `context.report()`; always use the translator
- Avoid ReDoS: limit repetition quantifiers (e.g., `{1,1000}` instead of unbounded `+`)

### Bug Fixer

1. **Reproduce**: Create a minimal `input.txt` in the rule's snapshot directory (`packages/@secretlint/core/test/builtin/rules/<name>/snapshots/` for a built-in rule)
2. **Debug**: Run the tests of the rule: `cd packages/@secretlint/core && npx vitest run test/builtin/rules.test.ts -t "secretlint-rule-<name>"` (a rule outside core: `cd packages/@secretlint/secretlint-rule-<name> && pnpm test`)
3. **Fix**: Modify the rule (`packages/@secretlint/core/src/builtin/rules/<name>/` for a built-in rule), update snapshots if output changes
4. **Verify**: Run `pnpm test` from root to check for regressions

### Code Reviewer

- Verify regex patterns are not vulnerable to ReDoS
- Check that `allows` option is properly supported
- Ensure messages have both `en` and `ja` locales
- Confirm test cases cover both detection and non-detection scenarios
- Verify `meta.id` is `@secretlint/secretlint-rule-<name>` and matches the directory name
- Check Prettier formatting (printWidth: 120, tabWidth: 4)

## Important Notes

- Do NOT manually modify `version` fields in `package.json` files; versioning is handled by CI
- Releases use OIDC trusted publishing (no npm tokens)
- Pre-commit hooks run Prettier via `lint-staged`
- The project uses its own tool (`secretlint`) to lint itself

<!-- sdev:begin -->
## Specifications-first development

Before creating or changing specifications, design, implementation, or verification, run `./bin/sdev help` and choose the guide for the task.
Tasks include defining product purpose, specifying feature requirements, designing an implementation, and updating documents.

Treat an idea such as 'I want to build this' as a starting point for discussing purpose and scope, rather than permission to implement.
When only a document is requested, present the document and its key points, then stop. When implementation is requested, present requirement and design decisions along the way.
Ask the user about unresolved decisions affecting purpose, scope, or observable behavior.
Ask instead of inventing purposes or constraints; prefer available question tools and follow up according to the answers.
Read `./bin/sdev help workflow` for the full workflow.

Prioritize the consuming project's instructions, conventions, and existing specifications.
If no template is designated for a new document, choose one from `./bin/sdev template`. Respect an existing document's structure when editing it.

Use this project's Product, Requirements, and Design. Without another placement rule, put specifications under `docs/products/`.
Use the default language and translations configured in sdev.toml. Default-language documents use `.md`; other language versions use `.<language>.md`.
Keep language versions equivalent and update them in the same change.
<!-- sdev:end -->
