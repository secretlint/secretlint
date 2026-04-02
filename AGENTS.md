# AGENTS.md

Agent-specific guidance for working on the secretlint codebase.

## Agent: Rule Creator

When asked to create a new secretlint rule, follow this workflow:

### Prerequisites

- Run `pnpm run gen:rule` to scaffold, OR manually create the package under `packages/@secretlint/secretlint-rule-<name>/`
- Reference existing rules for patterns (e.g., `secretlint-rule-aws`, `secretlint-rule-github`)

### Checklist

1. **`src/index.ts`**: Export `creator` (SecretLintRuleCreator) and `messages`
2. **Messages**: Include `en` and `ja` locales
3. **Options**: Define `Options` type with at least `allows?: string[]`
4. **meta.id**: Must exactly match the package name `@secretlint/secretlint-rule-<name>`
5. **meta.type**: Use `"scanner"` (detection) or `"filter"` (suppression)
6. **Detection**: Use `matchAll` with global regex, report via `context.report({ message, range })`
7. **Allow list**: Integrate `@textlint/regexp-string-matcher` to check `options.allows`
8. **Tests**: Create `test/snapshots/` with `ng.*` (error cases) and `ok.*` (valid cases) directories
9. **Snapshot generation**: Run `UPDATE_SNAPSHOT=1 pnpm test` to generate `output.json`
10. **README.md**: Document the rule's purpose, detected patterns, and options

### Validation

```sh
cd packages/@secretlint/secretlint-rule-<name>
pnpm run build
pnpm test
```

### Common Pitfalls

- Regex must use the `g` flag for `matchAll`
- Range is `[startIndex, startIndex + match.length]` (not inclusive end)
- Do not hardcode English strings in `context.report()`; always use the translator (`context.createTranslator(messages)`)
- Avoid ReDoS-vulnerable patterns; limit repetition quantifiers (e.g., `{1,1000}` instead of `+`)
- Test both positive detection (`ng.*`) and negative/safe content (`ok.*`)

## Agent: Bug Fixer

When investigating bugs in secretlint:

1. **Reproduce**: Create a minimal `input.txt` in the relevant rule's `test/snapshots/` directory
2. **Debug**: Run the single package test: `cd packages/@secretlint/secretlint-rule-<name> && pnpm test`
3. **Fix**: Modify `src/index.ts`, update snapshots if output changes
4. **Verify**: Run `pnpm test` from root to ensure no regressions across packages

## Agent: Code Reviewer

When reviewing changes:

- Verify regex patterns are not vulnerable to ReDoS
- Check that `allows` option is properly supported
- Ensure messages have both `en` and `ja` locales
- Confirm test cases cover both detection and non-detection scenarios
- Verify `meta.id` matches the package name
- Check that Prettier formatting is applied (printWidth: 120, tabWidth: 4)

## Build & Test Commands

| Scope | Build | Test | Update Snapshots |
|-------|-------|------|-----------------|
| All packages | `pnpm run build` | `pnpm test` | `pnpm run updateSnapshot` |
| Single package | `cd packages/PACKAGE && pnpm run build` | `cd packages/PACKAGE && pnpm test` | `cd packages/PACKAGE && UPDATE_SNAPSHOT=1 pnpm test` |
| CI (full) | `pnpm run ci` | - | - |
