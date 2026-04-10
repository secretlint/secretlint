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
2. **SecretLintEngine** (`packages/@secretlint/node`) loads config, discovers files via glob, processes files in parallel with `p-map`
3. **config-loader** searches for `.secretlintrc.*`, validates with AJV schema, dynamically imports rule modules
4. **core** (`packages/@secretlint/core/src/index.ts` - `lintSource()`) creates `SecretLintSourceCode`, registers scanner/filter rules, runs them, collects messages
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

Every rule must export a `creator` object and `messages`. The canonical structure:

```typescript
import type { SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";

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
    create(context, options) {
        const t = context.createTranslator(messages);
        const normalizedOptions = {
            allows: options.allows || [],
        };
        return {
            file(source: SecretLintSourceCode) {
                const pattern = /YOUR_PATTERN/g;
                const matches = source.content.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index || 0;
                    const matchString = match[0] || "";
                    const range = [index, index + matchString.length] as const;
                    // Check allows list using @textlint/regexp-string-matcher
                    context.report({
                        message: t("MESSAGE_ID", { ID: matchString }),
                        range,
                    });
                }
            },
        };
    },
};
```

### Key Rules for Rule Implementation

- **Always export `creator` and `messages`** from `src/index.ts`
- **`meta.id`** must match the npm package name exactly
- **`meta.type`** is `"scanner"` for detection rules, `"filter"` for rules that suppress other rules' reports
- **Messages must have at least `en` locale**; `ja` is strongly recommended
- **Always support `allows` option** using `@textlint/regexp-string-matcher` for user-defined exclusions
- **Use `matchAll` with global regex** for pattern scanning
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
6. Detection uses `matchAll` with global regex, reports via `context.report({ message, range })`
7. Allow list integrates `@textlint/regexp-string-matcher`
8. Tests have `ng.*` (error cases) and `ok.*` (valid cases) in `test/snapshots/`
9. Snapshots generated with `UPDATE_SNAPSHOT=1 pnpm test`
10. README.md documents the rule's purpose, detected patterns, and options

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
