import { readFileSync } from "node:fs";
import path from "node:path";
import ignore from "ignore";
import { compileFastIgnore, type DirectoryRules, type FastIgnore, type FastIgnoreResult } from "./fast-ignore.js";
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
     * Matcher carrying ONLY this dir's rules. Like node-ignore's `test()`,
     * it also tests the parent directories of the path within this level.
     */
    matcher: IgnoreMatcher;
    /**
     * The fast matcher that tests only the path, without its parent directories.
     * undefined when the level uses node-ignore. See {@link createDirIgnoreState}.
     */
    leafMatcher: FastIgnore | undefined;
    /** Parent level, or null at the root. */
    parent: IgnoreChain | null;
};

type IgnoreMatcher = { test(relPosixPath: string): FastIgnoreResult };

const IGNORED: FastIgnoreResult = { ignored: true, unignored: false };

/**
 * Test the parent directories of the path first, like node-ignore's `test()`.
 * If a parent directory is ignored, the path is ignored.
 */
const withParents = (leafMatcher: FastIgnore): IgnoreMatcher => {
    return {
        test(relPosixPath) {
            for (let index = relPosixPath.indexOf("/"); index !== -1 && index < relPosixPath.length - 1; ) {
                if (leafMatcher.test(relPosixPath.slice(0, index + 1)).ignored) return IGNORED;
                index = relPosixPath.indexOf("/", index + 1);
            }
            return leafMatcher.test(relPosixPath);
        },
    };
};

/**
 * Create the matchers of a level for the content of ignore files.
 * Simple rules are matched without regular expressions by {@link compileFastIgnore}.
 * When a rule is not supported by it, node-ignore matches all the rules of the level.
 */
const createMatchers = (contents: readonly string[]): Pick<IgnoreChain, "matcher" | "leafMatcher"> => {
    const leafMatcher = compileFastIgnore(contents);
    if (leafMatcher) {
        return { matcher: withParents(leafMatcher), leafMatcher };
    }
    const matcher = ignore();
    for (const content of contents) matcher.add(content);
    return { matcher, leafMatcher: undefined };
};

/**
 * Build the root level of the cascade for a walk rooted at `cwd`.
 * `extraPatterns` are evaluated at the root, so they behave as if the
 * caller dropped a synthetic `.gitignore` at `cwd`.
 */
export const createRootIgnore = (cwd: string, extraPatterns: readonly string[]): IgnoreChain => {
    return {
        dir: cwd,
        ...createMatchers(extraPatterns),
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

    return { dir, ...createMatchers(contents), parent };
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
    /** The levels of the chain that contain the directory, leaf → root */
    levels: {
        level: IgnoreChain;
        /** The directory relative to the level's directory in POSIX form, with a trailing `/`. "" for the level's directory itself. */
        relDir: string;
        /** The rules of the fast matcher for the entries of the directory. undefined for a node-ignore level. */
        directoryRules: DirectoryRules | undefined;
        /**
         * true if this level ignores the directory or one of its parent directories within the level.
         * Always false for a node-ignore level, because node-ignore tests the parent directories itself.
         */
        parentIgnored: boolean;
    }[];
};

/**
 * Create the ignore state of `absDir` whose entries are tested with `chain`.
 *
 * The fast matcher tests only the path. To keep the result of
 * {@link isIgnoredByChain}, which also tests the parent directories, this
 * remembers for each level whether the level ignores a parent directory.
 * With `parent` (the state of the parent directory), it tests only `absDir`
 * for each level, so the walker tests each directory once per level.
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
        let parentIgnored = false;
        if (cur.leafMatcher && relDir !== "") {
            const parentLevel = parent?.levels.find((item) => item.level === cur);
            parentIgnored = parentLevel
                ? parentLevel.parentIgnored || cur.leafMatcher.test(relDir).ignored
                : cur.matcher.test(relDir).ignored;
        }
        levels.push({
            level: cur,
            relDir,
            // The entries of an ignored directory are not tested
            directoryRules: parentIgnored ? undefined : cur.leafMatcher?.forDirectory(relDir),
            parentIgnored,
        });
    }
    return { levels };
};

/**
 * Same as {@link isIgnoredByChain} for the entry `name` of the directory of `state`.
 */
export const isIgnoredInDir = (state: DirIgnoreState, name: string, isDirectory: boolean): boolean => {
    const levels = state.levels;
    for (let index = 0; index < levels.length; index++) {
        const { level, relDir, directoryRules, parentIgnored } = levels[index] as DirIgnoreState["levels"][number];
        if (parentIgnored) return true;
        // The fast matcher finds the rules by the name of the entry, so the path is not created for it
        const r =
            level.leafMatcher && directoryRules
                ? level.leafMatcher.testEntry(directoryRules, name, isDirectory)
                : level.matcher.test(isDirectory ? `${relDir}${name}/` : relDir + name);
        if (r.ignored) return true;
        if (r.unignored) return false;
    }
    return false;
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
    // Walk leaf → root (the chain's natural direction) and return on the
    // first level that takes a position. This is equivalent to walking
    // root → leaf with "last match wins" semantics — gitignore guarantees
    // that within any single matcher's rules the last hit decides, and
    // node-ignore's `test()` already collapses each level to a single
    // verdict, so the first level whose verdict is non-empty wins overall.
    // Avoids the buffer + reverse() the root → leaf form needed.
    for (let cur: IgnoreChain | null = chain; cur !== null; cur = cur.parent) {
        const relPosix = relativeInLevel(cur, fullPath);
        if (relPosix === null) continue;
        const target = isDirectory ? `${relPosix}/` : relPosix;
        const r = cur.matcher.test(target);
        if (r.ignored) return true;
        if (r.unignored) return false;
    }
    return false;
};
