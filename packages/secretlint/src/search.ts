import { walk } from "@secretlint/walker";
import debug0 from "debug";

const debug = debug0("secretlint");

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
    respectGitignore?: boolean;
};

/**
 * Search files matching the given patterns under `options.cwd`.
 * Always honours DEFAULT_IGNORE_PATTERNS. When `respectGitignore` is true
 * (default), nested `.gitignore` files are respected with Git semantics.
 *
 * Patterns are interpreted as globs by default. To pass a literal path —
 * for example a file whose name contains glob special characters such as
 * `[`, `(`, `{`, or `?` — set `noGlob: true` (CLI: `--no-glob`).
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoreFiles: string[] = [];
    if (options.ignoreFilePath) ignoreFiles.push(options.ignoreFilePath);
    if (options.respectGitignore !== false) ignoreFiles.push(".gitignore");

    debug("search patterns: %o", patterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFiles: %o", ignoreFiles);

    const items = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles,
        extraIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
        noGlob: options.noGlob,
    });

    if (items.length > 0) {
        return { ok: true, items };
    }

    /**
     * If the result is empty due to ignoring, suppress the "not found target file" error.
     * Re-walk without any ignore handling to detect this case.
     */
    const itemsWithoutIgnore = await walk({
        cwd: options.cwd,
        patterns,
        ignoreFiles: [],
        extraIgnorePatterns: [],
        noGlob: options.noGlob,
    });
    return {
        ok: itemsWithoutIgnore.length > 0,
        items: [] as string[],
    };
};
