import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";
import ignore, { type Ignore } from "ignore";
import { createRootIgnore, extendIgnore, type IgnoreInstance } from "./ignore-stack.js";
import { isDynamicPattern, splitGlobRoot } from "./glob-root.js";

/**
 * Public options for {@link walk}.
 *
 * - `cwd`: starting directory. All relative paths in `patterns` resolve here.
 * - `patterns`: glob patterns and/or static paths. Omit to walk all of `cwd`.
 * - `ignoreFiles`: file names looked up per directory and merged into the
 *   cascade ignore stack (e.g. `[".gitignore", ".secretlintignore"]`).
 * - `extraIgnorePatterns`: hard-coded patterns added to the root ignore
 *   instance before any file-based rules (e.g. `["**\/.git/**"]`).
 * - `noGlob`: treat every entry in `patterns` as a literal path, even when it
 *   contains glob special characters such as `[`, `(`, `{`, `?`.
 */
export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

/**
 * Compile a list of glob patterns into a single matcher that returns true
 * when a path matches any of them. Uses node-ignore's matcher because
 * (1) it already handles dotfiles correctly under `**` and (2) it shares
 * pattern semantics with the cascade ignore stack, so include and exclude
 * rules behave consistently.
 *
 * Returns null when patterns is empty (caller can short-circuit and accept
 * everything).
 */
const compileMatcher = (patterns: readonly string[]): Ignore | null => {
    if (patterns.length === 0) return null;
    return ignore().add(patterns as string[]);
};

/**
 * Patterns sharing the same static-prefix root, grouped together so the
 * walker descends into each root once.
 */
type PatternGroup = {
    rootDir: string;
    matchPatterns: string[];
};

type CompiledMatcher = Ignore | null;

/**
 * Group user-supplied patterns by the static prefix they descend from.
 *
 * Each group represents one directory the walker descends into; patterns
 * that share a static prefix collapse into the same group so the walker
 * traverses each directory at most once.
 *
 * - When `patterns` is omitted, returns a single group rooted at `cwd`.
 * - Patterns containing no glob characters (or any pattern when `noGlob` is
 *   true) are flagged with the empty-string sentinel so the caller knows to
 *   take the literal-path branch via {@link handleStaticPath}.
 * - Otherwise, {@link splitGlobRoot} pulls the static prefix off the front
 *   of the pattern and the remainder is stored as the per-group match pattern.
 */
const groupPatterns = (
    cwd: string,
    patterns: readonly string[] | undefined,
    noGlob: boolean | undefined,
): PatternGroup[] => {
    if (patterns === undefined || patterns.length === 0) {
        return [{ rootDir: cwd, matchPatterns: [] }];
    }
    const byRoot = new Map<string, PatternGroup>();
    const upsert = (rootDir: string, pattern: string): void => {
        let group = byRoot.get(rootDir);
        if (!group) {
            group = { rootDir, matchPatterns: [] };
            byRoot.set(rootDir, group);
        }
        group.matchPatterns.push(pattern);
    };
    for (const raw of patterns) {
        const normalized = raw.replaceAll("\\", "/");
        if (noGlob || !isDynamicPattern(normalized)) {
            upsert(toPosix(path.resolve(cwd, normalized)), "");
            continue;
        }
        const { rootDir, matchPattern } = splitGlobRoot(normalized);
        upsert(rootDir === "" ? toPosix(cwd) : toPosix(path.resolve(cwd, rootDir)), matchPattern);
    }
    return [...byRoot.values()];
};

const safeReaddir = async (absDir: string): Promise<Dirent[] | null> => {
    try {
        return await readdir(absDir, { withFileTypes: true });
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return null;
        throw error;
    }
};

/**
 * Walk over `entries` and pick out which of `ignoreFiles` are present in the
 * directory as files. Used to drive `extendIgnore`'s `presentNames` so we
 * skip the readFile ENOENT round-trip for missing ignore files.
 */
const presentIgnoreNames = (entries: readonly Dirent[], ignoreFiles: readonly string[]): ReadonlySet<string> => {
    if (ignoreFiles.length === 0) return new Set();
    const wanted = new Set(ignoreFiles);
    const found = new Set<string>();
    for (const entry of entries) {
        if (entry.isFile() && wanted.has(entry.name)) found.add(entry.name);
    }
    return found;
};

/**
 * Per-walk constants threaded through every recursive call. The same
 * instance is reused at every level of the recursion so the helpers can
 * stay slim instead of passing 5+ positional arguments.
 */
type WalkContext = {
    /** Names of ignore files (e.g. `.gitignore`) loaded at every directory. */
    ignoreFiles: readonly string[];
    /** Anchor for cascade-ignore relative paths. Always equal to the walk's `cwd`. */
    ignoreRoot: string;
    /** Per-group anchor for include-pattern matching. Equals the group's `rootDir`. */
    patternRoot: string;
    /** Compiled include matcher; null means "match every file". */
    matcher: CompiledMatcher;
    /** Shared dedup sink for absolute file paths in POSIX form. */
    results: Set<string>;
};

/**
 * Build an ignore instance by walking the directory chain from `cwd` down to
 * (and including) `targetDir`, applying any ignore files encountered at each
 * level. This ensures that walks that start below `cwd` (because of a glob's
 * static prefix) still respect ancestor `.gitignore` files.
 */
const seedAncestorIgnore = async (options: {
    rootIg: IgnoreInstance;
    cwd: string;
    targetDir: string;
    ignoreFiles: readonly string[];
}): Promise<IgnoreInstance> => {
    const { rootIg, cwd, targetDir, ignoreFiles } = options;
    const relative = path.relative(cwd, targetDir);
    if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
        return await extendIgnore(rootIg, cwd, ignoreFiles);
    }
    let ig = await extendIgnore(rootIg, cwd, ignoreFiles);
    let current = cwd;
    for (const segment of relative.split(path.sep).filter(Boolean)) {
        current = path.join(current, segment);
        ig = await extendIgnore(ig, current, ignoreFiles);
    }
    return ig;
};

/**
 * Walk a directory whose ignore stack has already been seeded for the
 * directory itself. Reads `absDir` once and processes entries.
 */
const walkSeeded = async (absDir: string, ig: IgnoreInstance, ctx: WalkContext): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    await processEntries(absDir, entries, ig, ctx);
};

/**
 * Recurse into a child directory: read it once, derive ignore-file presence,
 * extend the ignore stack accordingly, then process entries.
 */
const walkSubdir = async (absDir: string, parentIg: IgnoreInstance, ctx: WalkContext): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    const present = presentIgnoreNames(entries, ctx.ignoreFiles);
    const ig = await extendIgnore(parentIg, absDir, ctx.ignoreFiles, present);
    await processEntries(absDir, entries, ig, ctx);
};

/**
 * For each entry: skip if its path is ignored by the cascade stack;
 * otherwise recurse (directory) or run it through the include matcher (file).
 */
const processEntries = async (
    absDir: string,
    entries: readonly Dirent[],
    ig: IgnoreInstance,
    ctx: WalkContext,
): Promise<void> => {
    await Promise.all(
        entries.map(async (entry) => {
            const isDir = entry.isDirectory();
            const isFile = entry.isFile();
            if (!isDir && !isFile) return;
            const full = path.join(absDir, entry.name);
            const relFromIgnoreRoot = toPosix(path.relative(ctx.ignoreRoot, full));
            const target = isDir ? `${relFromIgnoreRoot}/` : relFromIgnoreRoot;
            if (ig.ignores(target)) return;
            if (isDir) {
                await walkSubdir(full, ig, ctx);
            } else if (ctx.matcher === null) {
                ctx.results.add(toPosix(full));
            } else {
                const relFromPatternRoot = toPosix(path.relative(ctx.patternRoot, full));
                if (ctx.matcher.ignores(relFromPatternRoot)) ctx.results.add(toPosix(full));
            }
        }),
    );
};

/**
 * Resolve a literal user-supplied path: stat once, then walk if it's a
 * directory or add directly if it's a file (after a final ignore check).
 */
const handleStaticPath = async (options: {
    absPath: string;
    parentIg: IgnoreInstance;
    ignoreFiles: readonly string[];
    ignoreRoot: string;
    results: Set<string>;
}): Promise<void> => {
    const { absPath, parentIg, ignoreFiles, ignoreRoot, results } = options;
    let info;
    try {
        info = await stat(absPath);
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    if (info.isDirectory()) {
        await walkSubdir(absPath, parentIg, {
            ignoreFiles,
            ignoreRoot,
            patternRoot: absPath,
            matcher: null,
            results,
        });
    } else if (info.isFile()) {
        const relFromIgnoreRoot = toPosix(path.relative(ignoreRoot, absPath));
        if (parentIg.ignores(relFromIgnoreRoot)) return;
        results.add(toPosix(absPath));
    }
};

/**
 * Walk the file system rooted at `options.cwd`, returning POSIX-form
 * absolute paths of files that match `options.patterns` (or every file when
 * `patterns` is omitted), with `.gitignore`-style cascade applied per the
 * given `ignoreFiles`.
 */
export const walk = async (options: WalkOptions): Promise<string[]> => {
    const cwd = path.resolve(options.cwd);
    const ignoreFiles = options.ignoreFiles ?? [];
    const rootIg = createRootIgnore(options.extraIgnorePatterns ?? []);
    const results = new Set<string>();
    const groups = groupPatterns(cwd, options.patterns, options.noGlob);
    await Promise.all(
        groups.map(async (group) => {
            const literalEntries = group.matchPatterns.filter((p) => p === "");
            const globPatterns = group.matchPatterns.filter((p) => p !== "");
            if (literalEntries.length > 0 && globPatterns.length === 0) {
                const parentDir = path.dirname(group.rootDir);
                const seededIg = await seedAncestorIgnore({ rootIg, cwd, targetDir: parentDir, ignoreFiles });
                await handleStaticPath({
                    absPath: group.rootDir,
                    parentIg: seededIg,
                    ignoreFiles,
                    ignoreRoot: cwd,
                    results,
                });
                return;
            }
            const seededIg = await seedAncestorIgnore({ rootIg, cwd, targetDir: group.rootDir, ignoreFiles });
            await walkSeeded(group.rootDir, seededIg, {
                ignoreFiles,
                ignoreRoot: cwd,
                patternRoot: group.rootDir,
                matcher: compileMatcher(globPatterns),
                results,
            });
        }),
    );
    return [...results];
};
