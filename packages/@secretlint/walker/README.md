# @secretlint/walker

Promise-based file system walker with nested `.gitignore` cascade support.

## Install

    npm install @secretlint/walker

Requires Node.js >= 22 (uses `path.matchesGlob`).

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

## Semantics

- Each directory's ignore files are added on top of the parent's via `ignore().add(parent).add(content)`.
- When a directory matches an ignore rule, the walker does not call `readdir` on it (subtree pruning).
- Symbolic links are not followed (Git default).
- `ENOENT` / `EACCES` during `readdir` / `stat` are tolerated; other I/O errors are thrown.

## License

MIT © azu
