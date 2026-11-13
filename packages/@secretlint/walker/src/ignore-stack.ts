import { readFileSync } from "node:fs";
import path from "node:path";
import { compileGitignore, foldName, type DirectoryRules, type Gitignore } from "./gitignore.js";
import { relativeFrom } from "./relative.js";

/**
 * One level of the cascade ignore stack. Each level holds the rules from a
 * single `.gitignore` file (or the root extra-patterns), the absolute
 * directory those rules are anchored to, and a link to its parent level.
 *
 * Modeled after ripgrep's `ignore` crate
 * (https://docs.rs/ignore/latest/ignore/gitignore/), where each
 * `Gitignore` matcher records its own root and the parent chain is walked
 * at match time. We avoid `.gitignore` content rewriting that way: rules
 * stay verbatim, and the path-side is made relative to each matcher's
 * root before being tested.
 */
export type IgnoreChain = {
    /** Absolute directory the matcher is rooted at (native separators). */
    dir: string;
    /**
     * The matcher that has only the rules of this level.
     * It tests only the path, without its parent directories. See {@link isIgnoredByChain}.
     */
    matcher: Gitignore;
    /** Match case-insensitively. It is the same for all levels of a chain. */
    ignoreCase: boolean;
    /** Parent level, or null at the root. */
    parent: IgnoreChain | null;
};

/**
 * Create the matcher of a level for the content of ignore files.
 */
const createMatcher = (
    contents: readonly string[],
    ignoreCase: boolean,
): Pick<IgnoreChain, "matcher" | "ignoreCase"> => {
    return { matcher: compileGitignore(contents, { ignoreCase }), ignoreCase };
};

/**
 * Build the root level of the cascade for a walk rooted at `cwd`.
 * `extraPatterns` are evaluated at the root, so they behave as if the
 * caller dropped a synthetic `.gitignore` at `cwd`.
 */
export const createRootIgnore = (
    cwd: string,
    extraPatterns: readonly string[],
    ignoreCase: boolean = false,
): IgnoreChain => {
    return {
        dir: cwd,
        ...createMatcher(extraPatterns, ignoreCase),
        parent: null,
    };
};

/**
 * Read an ignore file and return its content, or null when the file is
 * absent or unreadable. ENOENT / EACCES are tolerated so a single missing
 * or locked ignore file does not abort the entire walk; other errors are
 * wrapped and rethrown with the original error preserved on `cause`.
 */
const tryReadIgnoreFile = (filePath: string): string | null => {
    try {
        return readFileSync(filePath, "utf8");
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return null;
        throw new Error(`Failed to read ignore file: ${filePath}`, { cause: error });
    }
};

/**
 * Extend the chain with a new level for `dir`. If `dir` has no ignore file
 * (or all candidate files are empty), returns `parent` unchanged so callers
 * can avoid pushing no-op levels.
 *
 * `presentNames` is an optional pre-filter (e.g. derived from `Dirent[]`)
 * of the ignore-file names that actually exist in `dir`; when provided we
 * skip the readFile ENOENT round-trip for missing files entirely.
 */
export const extendIgnore = (
    parent: IgnoreChain,
    dir: string,
    ignoreFiles: readonly string[],
    presentNames?: ReadonlySet<string>,
): IgnoreChain => {
    const candidates = presentNames ? ignoreFiles.filter((name) => presentNames.has(name)) : ignoreFiles;
    if (candidates.length === 0) return parent;

    const reads = candidates.map((name) => tryReadIgnoreFile(path.join(dir, name)));
    const contents = reads.filter((c): c is string => c !== null && c.trim().length > 0);
    if (contents.length === 0) return parent;

    return { dir, ...createMatcher(contents, parent.ignoreCase), parent };
};

/**
 * Return the path of `fullPath` relative to the level's directory in POSIX form,
 * or null when the path is not inside the directory.
 */
const relativeInLevel = (level: IgnoreChain, fullPath: string): string | null => {
    const rel = relativeFrom(level.dir, fullPath);
    // Skip levels whose dir does not contain fullPath. The path leaves
    // the level only when the relative result IS the literal `..`
    // directive or starts with `..` followed by a separator, never
    // when it merely starts with two dots in a directory name like
    // `..config/file`.
    if (rel === "" || rel === ".." || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) return null;
    return path.sep === "\\" ? rel.replaceAll("\\", "/") : rel;
};

/**
 * The ignore state of a directory that the walker reads.
 * The entries of the directory are tested by {@link isIgnoredInDir}.
 */
export type DirIgnoreState = {
    /**
     * true if the directory or one of its parent directories is ignored, so all the entries are ignored.
     * It can be true only for the directory where a walk starts: the walker does not read an ignored directory.
     */
    ignored: boolean;
    /** Match case-insensitively */
    ignoreCase: boolean;
    /** The levels of the chain that contain the directory, leaf → root */
    levels: {
        level: IgnoreChain;
        /** The rules of the level for the entries of the directory */
        directoryRules: DirectoryRules;
    }[];
};

/**
 * Create the ignore state of `absDir` whose entries are tested with `chain`.
 *
 * Git does not look into an ignored directory, so a path is ignored if one of its parent directories is.
 * The walker does not read an ignored directory, so only the directory where a walk starts (`parent` is null)
 * is tested with its parent directories. For the other directories, each entry is tested alone.
 */
export const createDirIgnoreState = (
    chain: IgnoreChain,
    absDir: string,
    parent: DirIgnoreState | null,
): DirIgnoreState => {
    const levels: DirIgnoreState["levels"] = [];
    for (let cur: IgnoreChain | null = chain; cur !== null; cur = cur.parent) {
        let relDir: string;
        // `cur.dir` and `absDir` can use different separators on Windows, so compare them with `path.relative`.
        if (cur.dir === absDir || relativeFrom(cur.dir, absDir) === "") {
            relDir = "";
        } else {
            const rel = relativeInLevel(cur, absDir);
            // The entries of the directory are not in this level
            if (rel === null) continue;
            relDir = `${rel}/`;
        }
        levels.push({ level: cur, directoryRules: cur.matcher.forDirectory(relDir) });
    }
    return {
        ignored: parent === null && isIgnoredByChain(chain, absDir, true),
        ignoreCase: chain.ignoreCase,
        levels,
    };
};

/**
 * Same as {@link isIgnoredByChain} for the entry `name` of the directory of `state`.
 */
export const isIgnoredInDir = (state: DirIgnoreState, name: string, isDirectory: boolean): boolean => {
    if (state.ignored) return true;
    const levels = state.levels;
    // The matchers find the rules by the name of the entry, so the path is not created.
    // All levels use the same name.
    const foldedName = foldName(name, state.ignoreCase);
    for (let index = 0; index < levels.length; index++) {
        const { level, directoryRules } = levels[index] as DirIgnoreState["levels"][number];
        const r = level.matcher.testEntry(directoryRules, foldedName, isDirectory);
        if (r.ignored) return true;
        if (r.unignored) return false;
    }
    return false;
};

/**
 * Ask each level whether it has a rule for the path itself, leaf → root.
 * The rules of a deeper ignore file are stronger, and the last matching rule of a file decides,
 * so the first level that has a matching rule decides.
 * Each level tests the path relative to its own `dir`:
 * a rule in `packages/foo/.gitignore` is anchored at `packages/foo/`.
 */
const isPathIgnoredByChain = (chain: IgnoreChain, fullPath: string, isDirectory: boolean): boolean => {
    for (let cur: IgnoreChain | null = chain; cur !== null; cur = cur.parent) {
        const relPosix = relativeInLevel(cur, fullPath);
        if (relPosix === null) continue;
        const r = cur.matcher.test(isDirectory ? `${relPosix}/` : relPosix);
        if (r.ignored) return true;
        if (r.unignored) return false;
    }
    return false;
};

/**
 * Return true if the path is ignored, like Git:
 * a path is ignored if one of its parent directories is ignored, or if the path itself is.
 * A parent directory is tested from the directory of the root level.
 *
 * `fullPath` is the absolute path to test (native separators OK).
 * `isDirectory` tells if the path is a directory (`foo/` matches only a directory).
 */
export const isIgnoredByChain = (chain: IgnoreChain, fullPath: string, isDirectory: boolean): boolean => {
    let root = chain;
    while (root.parent !== null) root = root.parent;
    const relPosix = relativeInLevel(root, fullPath);
    if (relPosix !== null) {
        for (let index = relPosix.indexOf("/"); index !== -1; index = relPosix.indexOf("/", index + 1)) {
            const parentDir = path.join(root.dir, relPosix.slice(0, index));
            if (isPathIgnoredByChain(chain, parentDir, true)) return true;
        }
    }
    return isPathIgnoredByChain(chain, fullPath, isDirectory);
};
