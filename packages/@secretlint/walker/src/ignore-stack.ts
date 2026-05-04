import { readFile } from "node:fs/promises";
import path from "node:path";
import ignore, { type Ignore } from "ignore";

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
    /** node-ignore matcher carrying ONLY this dir's rules. */
    matcher: Ignore;
    /** Parent level, or null at the root. */
    parent: IgnoreChain | null;
};

/**
 * Build the root level of the cascade for a walk rooted at `cwd`.
 * `extraPatterns` are evaluated at the root, so they behave as if the
 * caller dropped a synthetic `.gitignore` at `cwd`.
 */
export const createRootIgnore = (cwd: string, extraPatterns: readonly string[]): IgnoreChain => {
    return {
        dir: cwd,
        matcher: ignore().add(extraPatterns as string[]),
        parent: null,
    };
};

/**
 * Read an ignore file and return its content, or null when the file is
 * absent or unreadable. ENOENT / EACCES are tolerated so a single missing
 * or locked ignore file does not abort the entire walk; other errors are
 * wrapped and rethrown with the original error preserved on `cause`.
 */
const tryReadIgnoreFile = async (filePath: string): Promise<string | null> => {
    try {
        return await readFile(filePath, "utf8");
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
export const extendIgnore = async (
    parent: IgnoreChain,
    dir: string,
    ignoreFiles: readonly string[],
    presentNames?: ReadonlySet<string>,
): Promise<IgnoreChain> => {
    const candidates = presentNames ? ignoreFiles.filter((name) => presentNames.has(name)) : ignoreFiles;
    if (candidates.length === 0) return parent;

    const reads = await Promise.all(candidates.map((name) => tryReadIgnoreFile(path.join(dir, name))));
    const contents = reads.filter((c): c is string => c !== null && c.trim().length > 0);
    if (contents.length === 0) return parent;

    const matcher = ignore();
    for (const content of contents) matcher.add(content);
    return { dir, matcher, parent };
};

/**
 * Walk the chain root → leaf, asking each level whether it ignores the
 * given path. Each level computes the path relative to its own `dir`
 * before consulting its matcher (mirroring gitignore semantics: a rule
 * in `packages/foo/.gitignore` is anchored at `packages/foo/`).
 *
 * The verdict accumulates across levels: a later level can flip an earlier
 * one via a negation rule. node-ignore's `test()` exposes both `ignored`
 * and `unignored` so we can distinguish "this level made no statement"
 * from "this level un-ignored the path".
 *
 * `fullPath` is the absolute path to test (native separators OK).
 * `isDirectory` controls whether a trailing slash is appended for the
 * matcher (`foo` vs `foo/` are distinct in gitignore semantics).
 */
export const isIgnoredByChain = (chain: IgnoreChain, fullPath: string, isDirectory: boolean): boolean => {
    // Collect chain levels root → leaf so child rules apply on top of parents.
    const levels: IgnoreChain[] = [];
    for (let cur: IgnoreChain | null = chain; cur !== null; cur = cur.parent) levels.push(cur);
    levels.reverse();

    let verdict = false;
    for (const level of levels) {
        const rel = path.relative(level.dir, fullPath);
        // Skip levels whose dir does not contain fullPath.
        if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) continue;
        const relPosix = path.sep === "\\" ? rel.replaceAll("\\", "/") : rel;
        const target = isDirectory ? `${relPosix}/` : relPosix;
        const r = level.matcher.test(target);
        if (r.ignored) verdict = true;
        else if (r.unignored) verdict = false;
    }
    return verdict;
};
