# @secretlint/walker

File system walker with nested `.gitignore` cascade support.

## Install

    npm install @secretlint/walker

Requires Node.js >= 22.

## Usage

```ts
import { walk } from "@secretlint/walker";

const files = await walk({
    cwd: process.cwd(),
    patterns: ["**/*.{ts,js}"],
    ignoreFiles: [".gitignore"],
    extraIgnorePatterns: ["**/.git", "**/node_modules"],
});
```

## API

### `walk(options): Promise<string[]>`

| Option | Type | Default | Description |
|---|---|---|---|
| `cwd` | `string` | (required) | Absolute or relative starting directory |
| `patterns` | `string[]` | `undefined` | Glob patterns and/or static paths. Omit to walk all of `cwd`. |
| `ignoreFiles` | `string[]` | `[]` | Names of ignore files honoured per directory in cascade order (e.g. `[".gitignore"]`). |
| `extraIgnorePatterns` | `string[]` | `[]` | Hard-coded ignore patterns added at the cascade root, before any file-based rules. |
| `ignoreCase` | `boolean` | `false` | Match ignore rules without regard to the case of A-Z, like Git with `core.ignoreCase=true` (the setting of Git on a case-insensitive file system). |
| `noGlob` | `boolean` | `false` | Treat all `patterns` as literal paths. |
| `followSymlinks` | `boolean` | `true` | Descend into directory symlinks during search. Cascade ignore rules still see the symlink path, never the resolved target. Cycles are broken via `realpath`. |
| `listSymlinks` | `boolean` | `false` | Only when `followSymlinks` is `false`: return symlink entries by their own path, like regular files, without resolving or reading the target. |

Returns absolute paths with POSIX-form separators.

### `walkSync(options): string[]`

Synchronous version of `walk()`. It takes the same options.

`walk()` runs the same synchronous walk internally and returns the result as a promise, because reading directories with the promise-based `fs` API is much slower when walking many files. I/O errors are reported as a rejected promise.

## Pattern syntax

Two pattern languages are in play, and they are intentionally different:

- **Include patterns (`patterns`)** are compiled with [picomatch](https://github.com/micromatch/picomatch) using `{ dot: true }`. They support brace expansion (`**/*.{ts,js}`), `**` segments, character classes, and `?` — the same dialect as globby/micromatch.
- **Ignore patterns (`extraIgnorePatterns` and the contents of `ignoreFiles`)** have the meaning of a `.gitignore` of Git ([PATTERN FORMAT](https://git-scm.com/docs/gitignore#_pattern_format)): comments, `!` negation, a trailing `/` for directories, `*`, `?`, `[...]` with ranges and POSIX classes, `\` escapes, and `**`. They are matched by this package without a dependency, and the tests compare the results with `git check-ignore` and `git ls-files`. Brace expansion is **not** supported here, as in Git; spell out alternatives explicitly. Trailing `/**` matches contents only — write `**/node_modules` (no `/**`) when you want to prune the directory entry itself.

If a literal `patterns` entry resolves to a real on-disk path the walker treats it literally even when the name contains glob metacharacters, so callers don't need `noGlob: true` for filenames like `input-[group].md`. Pass `noGlob: true` to force literal handling for every entry — for example when the file does not exist yet on disk.

## Semantics

- Cascade ignore: each directory's ignore-file rules are layered on top of the parent's. The rules of a deeper ignore file are stronger, and the last matching rule of a file decides, as in Git.
- A path in an ignored directory is ignored, and a rule can not include it again, as in Git.
- A rule that Git can not parse, such as an unclosed `[`, matches nothing.
- When a directory matches an ignore rule, the walker does not call `readdir` on it (subtree pruning).
- Directory symlinks are followed by default (`followSymlinks: true`). The symlink's path — not the resolved target — drives ignore matching, and `realpath` is used to detect cycles.
- `ENOENT` / `EACCES` during `readdir` / `stat` / ignore-file reads are tolerated; other I/O errors are thrown.

## Tests against Git

`test/git-compat/git-check-ignore.json` has the results of `git check-ignore` for many rules and paths, and `test/gitignore.test.ts` compares the matcher with them. Create the file again with `node test/git-compat/generate-fixtures.mjs` (it needs Git) after adding rules to the script.
`test/walk-git-compat.test.ts` compares `walkSync()` with `git ls-files` for random trees, and it is skipped where Git is not installed.

## License

MIT © azu
