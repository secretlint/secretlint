import { readFile } from "node:fs/promises";
import path from "node:path";
import { walk } from "@secretlint/walker";
import debug0 from "debug";

const debug = debug0("secretlint");

// Patterns are written WITHOUT a trailing `/**` so node-ignore prunes the
// directory itself (not just its contents). With `**/foo/**` the walker
// would still readdir `foo/` and check each child individually.
//
// node-ignore (gitignore semantics) does not expand braces, so the four
// `.secretlintrc.{json,yaml,yml,js}` variants are listed individually
// rather than as a single brace pattern.
const DEFAULT_IGNORE_PATTERNS = [
    "**/.git",
    "**/node_modules",
    "**/.secretlintrc",
    "**/.secretlintrc.json",
    "**/.secretlintrc.yaml",
    "**/.secretlintrc.yml",
    "**/.secretlintrc.js",
    "**/.secretlintignore*",
];

/**
 * Read the ignore file at `ignoreFilePath` (resolved against `cwd`) and
 * return its rules, anchored at `cwd` like Git's `core.excludesFile`.
 * A missing file is reported on stderr instead of being skipped silently,
 * because the user named it explicitly.
 */
const readIgnoreFileRules = async (ignoreFilePath: string, cwd: string): Promise<string[]> => {
    const absolutePath = path.resolve(cwd, ignoreFilePath);
    try {
        const content = await readFile(absolutePath, "utf8");
        return content.split(/\r?\n/);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            console.warn(`secretlint: ignore file not found: ${absolutePath}`);
            return [];
        }
        throw new Error(`Failed to read ignore file: ${absolutePath}`, { cause: error });
    }
};

// Looked up in every directory the walker visits, like `.gitignore`.
const DEFAULT_IGNORE_FILE_NAME = ".secretlintignore";

export type SearchFilesOptions = {
    cwd: string;
    /**
     * Ignore file to use instead of the cascaded `.secretlintignore`.
     * It is read once, relative to `cwd`, and nested `.secretlintignore`
     * files are not consulted.
     */
    ignoreFilePath?: string;
    noGlob?: boolean;
    respectGitignore?: boolean;
};

/**
 * Search files matching the given patterns under `options.cwd`.
 * Always honours DEFAULT_IGNORE_PATTERNS. When `respectGitignore` is true
 * (default), nested `.gitignore` files are respected with Git semantics.
 *
 * Symlinks encountered while walking are not followed, like Prettier,
 * gitleaks, and ripgrep. A symlink passed explicitly as a pattern is
 * still resolved and scanned.
 *
 * Patterns are interpreted as globs by default. To pass a literal path —
 * for example a file whose name contains glob special characters such as
 * `[`, `(`, `{`, or `?` — set `noGlob: true` (CLI: `--no-glob`).
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoreFiles: string[] = [];
    const extraIgnorePatterns = [...DEFAULT_IGNORE_PATTERNS];
    if (options.ignoreFilePath) {
        extraIgnorePatterns.push(...(await readIgnoreFileRules(options.ignoreFilePath, options.cwd)));
    } else {
        ignoreFiles.push(DEFAULT_IGNORE_FILE_NAME);
    }
    if (options.respectGitignore !== false) ignoreFiles.push(".gitignore");

    debug("search patterns: %o", patterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFiles: %o", ignoreFiles);
    debug("search extraIgnorePatterns: %o", extraIgnorePatterns);

    const items = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles,
        extraIgnorePatterns,
        noGlob: options.noGlob,
        followSymlinks: false,
    });

    if (items.length > 0) {
        return { ok: true, items };
    }

    /**
     * If the result is empty because every match was filtered out by an
     * ignore file or was a skipped symlink, suppress the "not found target
     * file" error. The fallback walk drops the file-based cascade (`ignoreFiles: []`) but
     * keeps DEFAULT_IGNORE_PATTERNS so we never descend into `.git/` or
     * `node_modules/` just to answer this diagnostic question.
     */
    const itemsWithoutIgnore = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles: [],
        extraIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
        noGlob: options.noGlob,
        followSymlinks: false,
        // Count skipped symlinks as matches without reading their targets,
        // so a pattern that matches only symlinks is not "not found".
        listSymlinks: true,
    });
    return {
        ok: itemsWithoutIgnore.length > 0,
        items: [] as string[],
    };
};
