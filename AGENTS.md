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
3. **config-loader** searches for `.secretlintrc.*`, validates with AJV schema, dynamically imports rule modules
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
- **Generate new rule**: `pnpm run gen:rule`

## Monorepo Structure

```
packages/
  secretlint/              # CLI package
  @secretlint/
    types/                 # Core TypeScript type definitions
    core/                  # Linting engine
    tester/                # Snapshot testing utilities
    config-loader/         # .secretlintrc loader
    node/                  # Node.js integration
    secretlint-rule-*/     # Individual rule packages (30+)
    secretlint-rule-preset-recommend/  # Stable preset
    secretlint-rule-preset-canary/     # Experimental preset
docs/                      # Documentation
examples/                  # Example projects
.scaffdog/                 # Template for generating new rules
```

## Code Conventions

- **Language**: TypeScript (strict mode)
- **Module system**: ESM (`"type": "module"`)
- **Formatter**: Prettier (printWidth: 120, tabWidth: 4, singleQuote: false, trailingComma: none)
- **Test framework**: Node.js native `test` module + `@secretlint/tester` for snapshots (`@secretlint/core` and `@secretlint/node` use vitest)
- **Single package test**: `pnpm test --filter="@secretlint/secretlint-rule-<name>"`
- **Commit messages**: Angular Convention (`type(component): description`)
  - Types: `feat`, `fix`, `docs`, `style`, `perf`, `test`, `chore`, `refactor`

## Creating a New Rule

### Step 1: Scaffold

```sh
pnpm run gen:rule
```

This uses scaffdog (`.scaffdog/new-rule.md`) to generate the rule package structure.

### Step 2: Implement the Rule

Every rule must export a `creator` object and `messages`.
A rule that finds secrets with regular expressions is defined with `defineRule()` of `@secretlint/define-rule`. The canonical structure:

```typescript
import { defineRule } from "@secretlint/define-rule";

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
export const creator = defineRule<Options>({
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
});
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
- **`@secretlint/tester` checks `keywords` and `scope`**: for each snapshot it compares the result with the result of running the patterns on the whole content, and fails if they differ
- **`meta.keywords`** (optional, for rules with `create()`) skips the rule if the text content contains none of the keywords. Keywords are not checked for binary content. `defineRule()` sets it from the patterns
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

Tests use snapshot testing with `@secretlint/tester`:

```
test/
  index.test.ts
  snapshots/
    ng.secret-found/       # Test case expecting errors
      input.txt            # Input content
      output.json          # Expected output (auto-generated)
    ok.valid-content/      # Test case expecting no errors
      input.txt
      output.json
```

- **Naming convention**: `ok.*` for valid (no errors), `ng.*` for invalid (errors expected)
- **Generate snapshots**: `UPDATE_SNAPSHOT=1 pnpm test`
- **Optional files**: `options.json` or `options.ts` for per-case rule options

Test file pattern:

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

- Add dependency to `secretlint-rule-preset-canary/package.json`
- Import and register in `secretlint-rule-preset-canary/src/index.ts`
- Run: `pnpm run -r --filter "@secretlint/secretlint-rule-preset-canary" import-test`

> **Note**: Syncing to the **recommend** preset is a separate task done at major release time.
> Run: `pnpm run -r --filter "@secretlint/secretlint-rule-preset-recommend" sync-canary`

## Agent Workflows

### Rule Creator

When creating a new rule, verify every item:

1. `src/index.ts` exports `creator` (SecretLintRuleCreator) and `messages`
2. Messages include `en` and `ja` locales
3. Options type has `allows?: string[]`
4. `meta.id` exactly matches package name `@secretlint/secretlint-rule-<name>`
5. `meta.type` is `"scanner"` (detection) or `"filter"` (suppression)
6. `meta.keywords` (if set) is contained in every string the rule reports
7. Detection uses `matchAll` with global regex, reports via `context.report({ message, range })`
8. Allow list integrates `@textlint/regexp-string-matcher`
9. Tests have `ng.*` (error cases) and `ok.*` (valid cases) in `test/snapshots/`
10. Snapshots generated with `UPDATE_SNAPSHOT=1 pnpm test`
11. README.md documents the rule's purpose, detected patterns, and options

**Common pitfalls:**
- Regex must use the `g` flag for `matchAll`
- Range is `[startIndex, startIndex + match.length]` (exclusive end)
- Never hardcode English in `context.report()`; always use the translator
- Avoid ReDoS: limit repetition quantifiers (e.g., `{1,1000}` instead of unbounded `+`)

### Bug Fixer

1. **Reproduce**: Create a minimal `input.txt` in the relevant rule's `test/snapshots/`
2. **Debug**: Run single package test: `cd packages/@secretlint/secretlint-rule-<name> && pnpm test`
3. **Fix**: Modify `src/index.ts`, update snapshots if output changes
4. **Verify**: Run `pnpm test` from root to check for regressions

### Code Reviewer

- Verify regex patterns are not vulnerable to ReDoS
- Check that `allows` option is properly supported
- Ensure messages have both `en` and `ja` locales
- Confirm test cases cover both detection and non-detection scenarios
- Verify `meta.id` matches the package name
- Check Prettier formatting (printWidth: 120, tabWidth: 4)

## Important Notes

- Do NOT manually modify `version` fields in `package.json` files; versioning is handled by CI
- Releases use OIDC trusted publishing (no npm tokens)
- Pre-commit hooks run Prettier via `lint-staged`
- The project uses its own tool (`secretlint`) to lint itself
