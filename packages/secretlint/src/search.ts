import fs from "node:fs/promises";
import path from "node:path";
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

const existsOnDisk = async (cwd: string, p: string): Promise<boolean> => {
    const abs = path.isAbsolute(p) ? p : path.join(cwd, p);
    try {
        await fs.access(abs);
        return true;
    } catch {
        return false;
    }
};

/**
 * Pre-classify patterns into literal paths (existing on disk) and glob
 * patterns. A pattern that resolves to an existing path is always treated
 * literally even if it contains glob special characters such as `[`, `(`,
 * `{`, or `?`. This mirrors globby's `convertPathToPattern` behaviour.
 */
const classifyPatterns = async (
    cwd: string,
    patterns: readonly string[],
    noGlob: boolean
): Promise<{ literal: string[]; glob: string[] }> => {
    if (noGlob) {
        return { literal: [...patterns], glob: [] };
    }
    const literal: string[] = [];
    const glob: string[] = [];
    await Promise.all(
        patterns.map(async (p) => {
            if (await existsOnDisk(cwd, p)) {
                literal.push(p);
            } else {
                glob.push(p);
            }
        })
    );
    return { literal, glob };
};

/**
 * Search files matching the given patterns under `options.cwd`.
 * Always honours DEFAULT_IGNORE_PATTERNS. When `respectGitignore` is true
 * (default), nested `.gitignore` files are respected with Git semantics.
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoreFiles: string[] = [];
    if (options.ignoreFilePath) ignoreFiles.push(options.ignoreFilePath);
    if (options.respectGitignore !== false) ignoreFiles.push(".gitignore");

    debug("search patterns: %o", patterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFiles: %o", ignoreFiles);

    const { literal, glob } = await classifyPatterns(options.cwd, patterns, options.noGlob === true);

    const sharedOpts = {
        cwd: options.cwd,
        ignoreFiles,
        extraIgnorePatterns: DEFAULT_IGNORE_PATTERNS,
    };
    const [literalItems, globItems] = await Promise.all([
        literal.length > 0 ? walk({ ...sharedOpts, patterns: literal, noGlob: true }) : Promise.resolve([]),
        glob.length > 0 ? walk({ ...sharedOpts, patterns: glob, noGlob: false }) : Promise.resolve([]),
    ]);
    const items = [...new Set([...literalItems, ...globItems])];

    if (items.length > 0) {
        return { ok: true, items };
    }

    /**
     * If the result is empty due to ignoring, suppress the "not found target file" error.
     * Re-walk without any ignore handling to detect this case.
     */
    const [rawLiteral, rawGlob] = await Promise.all([
        literal.length > 0
            ? walk({ cwd: options.cwd, patterns: literal, ignoreFiles: [], extraIgnorePatterns: [], noGlob: true })
            : Promise.resolve([]),
        glob.length > 0
            ? walk({ cwd: options.cwd, patterns: glob, ignoreFiles: [], extraIgnorePatterns: [], noGlob: false })
            : Promise.resolve([]),
    ]);
    return {
        ok: rawLiteral.length + rawGlob.length > 0,
        items: [] as string[],
    };
};
