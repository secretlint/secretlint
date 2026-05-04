# @secretlint/walker

Promise-based file system walker with nested `.gitignore` cascade support.

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
| `noGlob` | `boolean` | `false` | Treat all `patterns` as literal paths. |
| `followSymlinks` | `boolean` | `true` | Descend into directory symlinks during search. Cascade ignore rules still see the symlink path, never the resolved target. Cycles are broken via `realpath`. |

Returns absolute paths with POSIX-form separators.

## Pattern syntax

Two pattern languages are in play, and they are intentionally different:

- **Include patterns (`patterns`)** are compiled with [picomatch](https://github.com/micromatch/picomatch) using `{ dot: true }`. They support brace expansion (`**/*.{ts,js}`), `**` segments, character classes, and `?` — the same dialect as globby/micromatch.
- **Ignore patterns (`extraIgnorePatterns` and the contents of `ignoreFiles`)** are compiled with [node-ignore](https://github.com/kaelzhang/node-ignore) and follow `.gitignore` semantics. Brace expansion is **not** supported here; spell out alternatives explicitly. Trailing `/**` matches contents only — write `**/node_modules` (no `/**`) when you want to prune the directory entry itself.

If a literal `patterns` entry resolves to a real on-disk path the walker treats it literally even when the name contains glob metacharacters, so callers don't need `noGlob: true` for filenames like `input-[group].md`. Pass `noGlob: true` to force literal handling for every entry — for example when the file does not exist yet on disk.

## Semantics

- Cascade ignore: each directory's ignore-file rules are layered on top of the parent's, with negation rules evaluated against the chain root → leaf. Modeled after BurntSushi/ripgrep's `ignore` crate.
- When a directory matches an ignore rule, the walker does not call `readdir` on it (subtree pruning).
- Directory symlinks are followed by default (`followSymlinks: true`). The symlink's path — not the resolved target — drives ignore matching, and `realpath` is used to detect cycles.
- `ENOENT` / `EACCES` during `readdir` / `stat` / ignore-file reads are tolerated; other I/O errors are thrown.

## License

MIT © azu
