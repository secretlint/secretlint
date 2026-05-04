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
    patterns: ["src/**/*.ts"],
    ignoreFiles: [".secretlintignore", ".gitignore"],
    extraIgnorePatterns: ["**/.git", "**/node_modules"],
});
```

## API

### `walk(options): Promise<string[]>`

| Option | Type | Description |
|---|---|---|
| `cwd` | `string` | Absolute or relative starting directory |
| `patterns` | `string[]` (optional) | Glob patterns and/or static paths. Omit to walk all of `cwd`. |
| `ignoreFiles` | `string[]` (optional) | Names of ignore files honoured per directory in cascade order. Empty by default. |
| `extraIgnorePatterns` | `string[]` (optional) | Hard-coded ignore patterns added to the root before any file-based rules. |
| `noGlob` | `boolean` (optional) | Treat all `patterns` as literal paths. |

Returns absolute paths with the OS-native separator.

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
