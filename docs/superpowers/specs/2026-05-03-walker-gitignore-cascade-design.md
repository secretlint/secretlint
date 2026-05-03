# `@secretlint/walker`: Nested `.gitignore` cascade walker

- Status: Draft
- Date: 2026-05-03
- Owner: azu

## Summary

Replace the current `globby`-based file search in `packages/secretlint/src/search.ts` with a custom walker that respects nested `.gitignore` files using Git-compatible cascade semantics. Extract the walker into a new package `@secretlint/walker` so it can be reused and shipped independently.

The walker is built on `Promise.all` + `fs.readdir({ withFileTypes: true })` + the `ignore` (node-ignore) library, with subtree pruning when a directory is ignored. Glob matching uses Node.js 22+ built-in `path.matchesGlob`, so the only runtime dependency is `ignore`.

This is a breaking change in user-visible behavior (files newly excluded by `.gitignore` will no longer be scanned). It will ship as `secretlint v13`.

## Goals

1. **Git-compatible cascade**: nested `.gitignore` files apply additively from root to leaf, matching Git's documented behavior.
2. **Performance parity or better with `globby`**: large directories ignored by `.gitignore` (e.g. `node_modules/`) are pruned without `readdir` calls.
3. **Reusable package**: `@secretlint/walker` exposes a stable API independent of secretlint's internals, so the JavaScript ecosystem has a Promise-based walker with cascade support.
4. **Backwards-compatible API surface**: `searchFiles(patterns, options)` keeps its signature; only an optional `respectGitignore` field is added.

## Non-goals

- Full Git compatibility (`.git/info/exclude`, `core.excludesFile`/global `.gitignore`, `.ignore` files).
- Glob pattern syntax extensions beyond what `path.matchesGlob` supports (no extglob, no negative globs at the input level — use `.gitignore`/`.secretlintignore`).
- Following symbolic links. Git's default is not to follow them; we match that.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ packages/secretlint/src/search.ts                                │
│ ─ Thin wrapper over @secretlint/walker                           │
│ ─ Translates SearchFilesOptions to WalkOptions                   │
│ ─ Adds DEFAULT_IGNORE_PATTERNS and .secretlintignore             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ @secretlint/walker                                               │
│ ─ src/index.ts        public API: walk(options)                  │
│ ─ src/walk.ts         Promise.all + readdir recursion            │
│ ─ src/ignore-stack.ts node-ignore cascade per directory          │
│ ─ src/glob-root.ts    glob → walk-root + match-pattern           │
└──────────────────────────────────────────────────────────────────┘
```

### Package layout

```
packages/@secretlint/walker/
├── src/
│   ├── index.ts          # public API
│   ├── walk.ts           # walker core
│   ├── ignore-stack.ts   # cascade management
│   └── glob-root.ts      # glob root extraction
├── test/
│   ├── walk.test.ts
│   ├── glob-root.test.ts
│   ├── benchmark.test.ts # vitest bench
│   └── fixtures/         # nested .gitignore scenarios
└── package.json
```

### Public API

```ts
export type WalkOptions = {
    cwd: string;
    /**
     * Glob patterns and / or static paths (relative or absolute).
     * If omitted, walks the entire `cwd`.
     */
    patterns?: string[];
    /**
     * Names of ignore files to honour during traversal, in cascade order.
     * Each occurrence in a directory is added to the ignore stack for that
     * subtree.
     * Example: [".secretlintignore", ".gitignore"]
     */
    ignoreFiles?: string[];
    /**
     * Hard-coded ignore patterns added to the root ignore instance before any
     * file-based rules. Useful for things like `**\/.git/**`.
     */
    extraIgnorePatterns?: string[];
    /**
     * Treat all `patterns` as literal paths.
     */
    noGlob?: boolean;
};

export const walk: (options: WalkOptions) => Promise<string[]>;
```

`@secretlint/walker` is intentionally neutral: it does not know about `.gitignore` specifically. Cascade-by-name is the universal mechanism, and the consumer decides which file names participate.

### secretlint integration

`packages/secretlint/src/search.ts` becomes:

```ts
import { walk } from "@secretlint/walker";

const DEFAULT_IGNORE_PATTERNS = [
    "**/.git/**",
    "**/node_modules/**",
    "**/.secretlintrc/**",
    "**/.secretlintrc.{json,yaml,yml,js}/**",
    "**/.secretlintignore*/**",
];

export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
    noGlob?: boolean;
    respectGitignore?: boolean; // default true
};

export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoreFiles: string[] = [];
    if (options.ignoreFilePath) ignoreFiles.push(options.ignoreFilePath);
    if (options.respectGitignore !== false) ignoreFiles.push(".gitignore");

    const items = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles,
        extraIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
        noGlob: options.noGlob,
    });

    if (items.length > 0) return { ok: true, items };

    // Preserve existing "empty due to ignoring" detection
    const itemsNoIgnore = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles: [],
        extraIgnorePatterns: [],
        noGlob: options.noGlob,
    });
    return { ok: itemsNoIgnore.length > 0, items: [] };
};
```

The `globby` dependency is removed.

### CLI flag

A new flag is added in `packages/secretlint/src/cli.ts`:

```
--no-gitignore   disable .gitignore cascade respect; .gitignore is respected
                 by default (since v13).
```

Usage: `secretlint --no-gitignore "**/*"` restores pre-v13 behaviour.

## Walker algorithm

```
walk({ cwd, patterns, ignoreFiles, extraIgnorePatterns, noGlob }):
  1. Build root ignore stack:
       rootIg = ignore().add(extraIgnorePatterns)
       for each f in ignoreFiles, if cwd/f exists, rootIg.add(content)
  2. Classify patterns:
       - noGlob → literal path
       - dynamic (contains *, ?, [, {) → { rootDir, matchPattern }
       - static → literal path
  3. For each input:
       - literal file path → add to results (after ignore check)
       - literal directory → walkDir(dir, "**")
       - dynamic glob     → walkDir(rootDir, matchPattern)
  4. Deduplicate results via Set<absolutePath>.

walkDir(absDir, parentIg, matchers, root, results):
  1. Load any ignoreFiles in absDir → ig = ignore().add(parentIg).add(content)
  2. entries = await readdir(absDir, { withFileTypes: true })
  3. await Promise.all(entries.map(async entry => {
       full   = path.join(absDir, entry.name)
       rel    = path.relative(root, full)
       relP   = (win32 ? rel.replaceAll("\\", "/") : rel)
       target = entry.isDirectory() ? `${relP}/` : relP
       if (ig.ignores(target)) return                 // subtree cut
       if (entry.isDirectory()) {
           // Dirent.isDirectory() is false for symlinks (even those pointing
           // to directories) since readdir does not resolve them, so this
           // branch is reached only for real directories.
           await walkDir(full, ig, matchers, root, results)
       } else {
           if (matchers.length === 0 ||
               matchers.some(m => path.matchesGlob(relP, m))) {
               results.add(full)
           }
       }
   }))
```

### Key correctness points

1. **Per-directory `ig` instance.** A new `ignore()` is built per directory by `add(parentIg).add(content)`. Mutating the parent would leak rules across siblings.
2. **Trailing slash for directory checks.** `node-ignore` distinguishes `foo` from `foo/`. We use `Dirent.isDirectory()` to decide.
3. **Subtree cut.** When `ig.ignores(target)` is true on a directory, we return before calling `readdir` on it. This is the optimisation that keeps `node_modules/` cheap.
4. **Symlink handling.** `readdir({ withFileTypes: true })` does not resolve symlinks, so `Dirent.isDirectory()` returns `false` for symlinks even when their target is a directory. We descend only when `isDirectory()` is true, which naturally skips symlinks and prevents loops.
5. **Path normalisation.** All paths fed to `node-ignore` and `path.matchesGlob` are POSIX (`/` separators). On Windows, replace `\` with `/` after `path.relative`.
6. **Error handling.** Wrap `readdir`/`readFile` in try/catch; ignore `ENOENT` (race) and `EACCES` (permissions) with a debug log; rethrow others.

### Performance characteristics

- Parallelism: `Promise.all` over `Dirent` arrays; I/O is bounded by Node's libuv thread pool (default 4).
- I/O budget per directory: 1 `readFile` for any matched ignoreFile + 1 `readdir`.
- Memory: results held as a `Set<string>`; ignore stacks live for the lifetime of their subtree's promise chain and are released when it resolves.
- For deep trees, recursion depth = directory depth. Real-world repos are typically < 50, well within Node's default stack.

## Behaviour contract (vs. OxLint / `oxlint`)

| Setting | OxLint default | `@secretlint/walker` |
|---|---|---|
| `git_ignore` (respect `.gitignore`) | true | **true (configurable via `respectGitignore`)** |
| `git_global` (global `~/.gitignore`) | false | **false** |
| `.ignore` files | false | **false** (secretlint uses `.secretlintignore`) |
| `follow_links` | true | **false** (Git default) |
| `hidden` (include dotfiles) | true | **true** |
| `require_git` | false | **false** (`.gitignore` works without `.git`) |
| Skip `.git` directory | yes | **yes** (via `extraIgnorePatterns`) |
| Stop `.gitignore` inheritance at `.git` boundary | n/a | **yes** (submodule safety, matches `ignore` crate's `stops_at_git_dir`) |

## Test plan

### Unit tests in `@secretlint/walker`

Test fixtures under `packages/@secretlint/walker/test/fixtures/` cover the scenarios below. Names mirror tests from `BurntSushi/ripgrep`'s `ignore` crate where applicable, so reviewers familiar with the reference implementation can map them quickly.

| # | Case | Reference | Expectation |
|---|---|---|---|
| 1 | Parent `.gitignore` inherited into child directory | ripgrep `gitignore_parent` | Child files excluded by parent rule |
| 2 | Rooted pattern (`/a/b`) hits nested file | ripgrep `r829_original` | Subtree excluded |
| 3 | Child negation `!foo` overrides parent `foo` | ripgrep `ignore_over_gitignore` | File reappears |
| 4 | `build/` ignored, `!/some_dir/build/foo` whitelist | ripgrep `r829_2731` | Specific file resurrected |
| 5 | `/parent/*.txt` does not prune `parent/subdir` | ripgrep `r829_2778` | `parent/subdir/x.txt` is found |
| 6 | Subtree cut: ignored directory's `readdir` not called | n/a | `readdir` spy count = 0 |
| 7 | Symlinks not followed | ripgrep `symlinks` | `z/foo` (where `z -> a/b`) absent |
| 8 | Symlink loop (`a → b`, `b → a`) | ripgrep | Walk completes |
| 9 | Subdirectory `.gitignore` only | oxfmt `should respect .gitignore in subdirectory` | Local rule applies |
| 10 | `.gitignore` works without `.git` directory | oxlint `test_gitignore_without_git_repo` | `require_git(false)` semantics |
| 11 | `.git/` always excluded | oxlint | Always pruned via `extraIgnorePatterns` |
| 12 | Precedence: `extraIgnorePatterns` < `.secretlintignore` < `.gitignore` cascade | ripgrep precedence tests | Later `add()` wins |
| 13 | Whitelist via cascading `!pattern` | oxlint `ignore_patterns_whitelist` | Negation works across levels |
| 14 | Windows path normalisation (`\` → `/`) | secretlint #816 | Same result on all platforms |
| 15 | `noGlob: true` with literal paths containing `(group)`, `[param]` | secretlint #1057 | Treated as literal |
| 16 | `ENOENT` (file removed mid-walk) / `EACCES` | n/a | Warn and continue |
| 17 | Empty directory / empty `.gitignore` | n/a | Does not crash |
| 18 | Glob `"src/**/*.ini"` | secretlint | Only `src/` walked, `.ini` only |
| 19 | `respectGitignore: false` | n/a | `.gitignore` ignored |
| 20 | 10k-file fixture | n/a | Completes; no stack overflow |

### Integration tests in `packages/secretlint`

- Add fixtures under `packages/secretlint/test/snapshots/` exercising:
  - `.gitignore` excluding a `.env` file by default.
  - `--no-gitignore` overriding it.
  - `.secretlintignore` + `.gitignore` co-existing.

### Benchmark (`bench/walker.bench.ts`)

Light-weight, local-only (not in CI). Targets in `examples/benchmark/targets/`:

- Current `globby`-based `searchFiles` (baseline)
- New `@secretlint/walker`-based `searchFiles`
- Reference: `fdir` + `node-ignore` two-pass collection (for context)

Recorded as a "baseline" in the design doc for future regression detection. Pass/fail criterion: new implementation is no slower than `globby` for medium-sized trees and noticeably faster when `node_modules/` exists at the root.

## Compatibility and migration

| Item | Compatibility |
|---|---|
| `searchFiles` signature | Compatible (added optional field) |
| `--secretlintignore` | Unchanged |
| `DEFAULT_IGNORE_PATTERNS` | Preserved as `extraIgnorePatterns` |
| Scan results | **Breaking** when a `.gitignore` exists |
| Node.js engine | Already `>=22.0.0` (uses `path.matchesGlob`) |

### v13 release notes draft

```markdown
## Breaking change: .gitignore is now respected by default

Previously, secretlint scanned all files matching glob patterns, with hard-coded
ignores for .git, node_modules, and .secretlintrc only.

Now, secretlint also respects nested .gitignore files in the same way Git does.

To restore the previous behaviour, pass --no-gitignore:

    secretlint --no-gitignore "**/*"

Use --no-gitignore when you want to scan files that are gitignored, e.g.,
secret detection on .env in projects where .env is gitignored.
```

## Roll-out

| PR | Scope |
|---|---|
| #1 | Add `@secretlint/walker` package: implementation, unit tests, fixtures, benchmark |
| #2 | Migrate `packages/secretlint/src/search.ts` to use `@secretlint/walker`; add `--no-gitignore` CLI flag; remove `globby` dependency |
| #3 | (optional) Documentation and migration guide updates |

Released together as secretlint v13 via the existing release workflow.

## Open questions

None. All design questions resolved during brainstorming on 2026-05-03.

## References

- BurntSushi/ripgrep `ignore` crate: <https://docs.rs/ignore/>
- kaelzhang/node-ignore: <https://github.com/kaelzhang/node-ignore>
- npm/ignore-walk: <https://github.com/npm/ignore-walk>
- thecodrr/fdir: <https://github.com/thecodrr/fdir>
- oxc-project/oxc `apps/oxlint/src/walk.rs`
- oxc-project/oxc `apps/oxfmt/src/cli/walk.rs`
- Node.js `path.matchesGlob`: <https://nodejs.org/api/path.html#pathmatchesglobpath-pattern>
