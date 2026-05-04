import { readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";
import picomatch from "picomatch";
import { createRootIgnore, extendIgnore, isIgnoredByChain, type IgnoreChain } from "./ignore-stack.js";
import { isDynamicPattern, splitGlobRoot } from "./glob-root.js";

/**
 * Public options for {@link walk}.
 *
 * - `cwd`: starting directory. All relative paths in `patterns` resolve here.
 * - `patterns`: glob patterns and/or static paths. Omit to walk all of `cwd`.
 * - `ignoreFiles`: file names looked up per directory and merged into the
 *   cascade ignore stack (e.g. `[".gitignore", ".secretlintignore"]`).
 * - `extraIgnorePatterns`: hard-coded patterns added to the root ignore
 *   instance before any file-based rules (e.g. `["**\/.git"]`).
 * - `noGlob`: treat every entry in `patterns` as a literal path, even when it
 *   contains glob special characters such as `[`, `(`, `{`, `?`.
 * - `followSymlinks`: when true (default) the walker follows directory
 *   symlinks during search but still treats them as their symlink path
 *   for ignore matching (so cascaded `.gitignore` rules apply at the
 *   symlink's location, not the resolved target). Cycles are detected
 *   via realpath and skipped.
 */
export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
    followSymlinks?: boolean;
};

const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

/**
 * A matcher that returns true when a relative POSIX path matches the
 * compiled include patterns. `null` means "no patterns supplied" — callers
 * short-circuit and accept everything.
 */
type CompiledMatcher = ((relPath: string) => boolean) | null;

/**
 * Compile a list of glob patterns into a single matcher.
 *
 * Picomatch is used (rather than node-ignore or `path.matchesGlob`) for
 * three reasons:
 *
 * 1. Brace expansion. Patterns like `**\/*.{ts,js}` are common in CLI usage
 *    but node-ignore (gitignore semantics) does not expand braces. The
 *    cascade ignore stack still uses node-ignore — gitignore is a different
 *    pattern language from globs and the two should not be unified.
 * 2. Dotfile traversal under `**`. `path.matchesGlob` (Node 22+) and
 *    `fs.glob` do not match dotfiles via `**\/*`, and there is no `dot`
 *    flag to opt in. Picomatch's `{ dot: true }` makes `**\/*` match every
 *    file as users expect.
 * 3. Picomatch is the same engine that micromatch / globby / fast-glob
 *    wrap, so its glob dialect is the de-facto standard in the Node
 *    ecosystem.
 *
 * Returns `null` when there are no patterns so the caller can skip the
 * matcher call entirely on the hot path.
 */
const compileMatcher = (patterns: readonly string[]): CompiledMatcher => {
    if (patterns.length === 0) return null;
    const matchers = patterns.map((p) => picomatch(p, { dot: true }));
    return (relPath) => matchers.some((m) => m(relPath));
};

/**
 * Patterns sharing the same static-prefix root, grouped together so the
 * walker descends into each root once.
 */
type PatternGroup = {
    rootDir: string;
    matchPatterns: string[];
};

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
    /** Per-group anchor for include-pattern matching. Equals the group's `rootDir`. */
    patternRoot: string;
    /** Compiled include matcher; null means "match every file". */
    matcher: CompiledMatcher;
    /** Shared dedup sink for absolute file paths in POSIX form. */
    results: Set<string>;
    /** When true, descend into directory symlinks (with cycle detection). */
    followSymlinks: boolean;
    /**
     * Real paths of directory symlink targets we have already entered, used
     * to break `a → b → a` style cycles. Shared across the whole walk so
     * sibling symlinks pointing at the same target are also visited at most
     * once.
     */
    visitedRealPaths: Set<string>;
};

/**
 * Build an ignore chain by walking the directory chain from `cwd` down to
 * (and including) `targetDir`, pushing one chain level per directory that
 * contains an ignore file. This ensures that walks starting below `cwd`
 * (because of a glob's static prefix) still respect ancestor `.gitignore`
 * files.
 */
const seedAncestorIgnore = async (options: {
    rootIg: IgnoreChain;
    cwd: string;
    targetDir: string;
    ignoreFiles: readonly string[];
}): Promise<IgnoreChain> => {
    const { rootIg, cwd, targetDir, ignoreFiles } = options;
    const relative = path.relative(cwd, targetDir);
    if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
        return await extendIgnore(rootIg, cwd, ignoreFiles);
    }
    let chain = await extendIgnore(rootIg, cwd, ignoreFiles);
    let current = cwd;
    for (const segment of relative.split(path.sep).filter(Boolean)) {
        current = path.join(current, segment);
        chain = await extendIgnore(chain, current, ignoreFiles);
    }
    return chain;
};

/**
 * Walk a directory whose ignore stack has already been seeded for the
 * directory itself. Reads `absDir` once and processes entries.
 */
const walkSeeded = async (absDir: string, chain: IgnoreChain, ctx: WalkContext): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    await processEntries(absDir, entries, chain, ctx);
};

/**
 * Recurse into a child directory: read it once, derive ignore-file presence,
 * extend the ignore chain with that directory's ignore file (if any), then
 * process entries.
 */
const walkSubdir = async (absDir: string, parentChain: IgnoreChain, ctx: WalkContext): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    const present = presentIgnoreNames(entries, ctx.ignoreFiles);
    const chain = await extendIgnore(parentChain, absDir, ctx.ignoreFiles, present);
    await processEntries(absDir, entries, chain, ctx);
};

/**
 * Resolve a Dirent's effective type. For symlinks the entry itself reports
 * `isFile() === isDirectory() === false`, so we stat the target to find
 * out what to do with it. Returns null when the symlink is dangling /
 * inaccessible / points to something we don't care about (sockets etc.).
 */
const resolveEntryKind = async (
    full: string,
    entry: Dirent,
    followSymlinks: boolean,
): Promise<{ kind: "file" | "dir"; isSymlink: boolean } | null> => {
    if (entry.isDirectory()) return { kind: "dir", isSymlink: false };
    if (entry.isFile()) return { kind: "file", isSymlink: false };
    if (!entry.isSymbolicLink() || !followSymlinks) return null;
    let info;
    try {
        info = await stat(full);
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return null;
        throw error;
    }
    if (info.isDirectory()) return { kind: "dir", isSymlink: true };
    if (info.isFile()) return { kind: "file", isSymlink: true };
    return null;
};

/**
 * For each entry: skip if its path is ignored by the cascade chain;
 * otherwise recurse (directory) or run it through the include matcher (file).
 *
 * Symlinks are handled by following the target for *search* (so a symlinked
 * directory's contents end up in the result list) while keeping the
 * symlink's path for *ignore matching* (so a `.gitignore` rule like
 * `vendor/` excludes a `vendor → /shared/lib` symlink without us having
 * to consult `/shared/lib`'s rules). Cycles are detected via realpath.
 */
const processEntries = async (
    absDir: string,
    entries: readonly Dirent[],
    chain: IgnoreChain,
    ctx: WalkContext,
): Promise<void> => {
    await Promise.all(
        entries.map(async (entry) => {
            const full = path.join(absDir, entry.name);
            const resolved = await resolveEntryKind(full, entry, ctx.followSymlinks);
            if (resolved === null) return;
            const isDir = resolved.kind === "dir";
            // Ignore evaluation always uses the symlink's path, never the resolved target.
            if (isIgnoredByChain(chain, full, isDir)) return;
            if (isDir) {
                if (resolved.isSymlink) {
                    let real;
                    try {
                        real = await realpath(full);
                    } catch (error) {
                        const code = (error as NodeJS.ErrnoException).code;
                        if (code === "ENOENT" || code === "EACCES") return;
                        throw error;
                    }
                    if (ctx.visitedRealPaths.has(real)) return;
                    ctx.visitedRealPaths.add(real);
                }
                await walkSubdir(full, chain, ctx);
            } else if (ctx.matcher === null) {
                ctx.results.add(toPosix(full));
            } else {
                const relFromPatternRoot = toPosix(path.relative(ctx.patternRoot, full));
                if (ctx.matcher(relFromPatternRoot)) ctx.results.add(toPosix(full));
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
    parentChain: IgnoreChain;
    ignoreFiles: readonly string[];
    results: Set<string>;
    followSymlinks: boolean;
    visitedRealPaths: Set<string>;
}): Promise<void> => {
    const { absPath, parentChain, ignoreFiles, results, followSymlinks, visitedRealPaths } = options;
    // `stat` resolves symlinks. A literal user-supplied path is treated
    // permissively: if it points at a directory (real or via symlink) we
    // walk it. The ignore check uses absPath (the user's literal input),
    // never the resolved target.
    let info;
    try {
        info = await stat(absPath);
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    if (info.isDirectory()) {
        // Same defensive ignore check as the file branch below: a literal
        // directory path explicitly passed by the user is still subject
        // to the cascade, so we don't descend into e.g. `node_modules`
        // when the caller asked us to walk it directly.
        if (isIgnoredByChain(parentChain, absPath, true)) return;
        await walkSubdir(absPath, parentChain, {
            ignoreFiles,
            patternRoot: absPath,
            matcher: null,
            results,
            followSymlinks,
            visitedRealPaths,
        });
    } else if (info.isFile()) {
        if (isIgnoredByChain(parentChain, absPath, false)) return;
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
    const rootChain = createRootIgnore(cwd, options.extraIgnorePatterns ?? []);
    const results = new Set<string>();
    const followSymlinks = options.followSymlinks !== false;
    // Shared across all groups so two patterns under the same job don't
    // re-enter the same symlinked directory twice.
    const visitedRealPaths = new Set<string>();
    const groups = groupPatterns(cwd, options.patterns, options.noGlob);
    await Promise.all(
        groups.map(async (group) => {
            const literalEntries = group.matchPatterns.filter((p) => p === "");
            const globPatterns = group.matchPatterns.filter((p) => p !== "");
            if (literalEntries.length > 0 && globPatterns.length === 0) {
                const parentDir = path.dirname(group.rootDir);
                const seededChain = await seedAncestorIgnore({
                    rootIg: rootChain,
                    cwd,
                    targetDir: parentDir,
                    ignoreFiles,
                });
                await handleStaticPath({
                    absPath: group.rootDir,
                    parentChain: seededChain,
                    ignoreFiles,
                    results,
                    followSymlinks,
                    visitedRealPaths,
                });
                return;
            }
            const seededChain = await seedAncestorIgnore({
                rootIg: rootChain,
                cwd,
                targetDir: group.rootDir,
                ignoreFiles,
            });
            await walkSeeded(group.rootDir, seededChain, {
                ignoreFiles,
                patternRoot: group.rootDir,
                matcher: compileMatcher(globPatterns),
                results,
                followSymlinks,
                visitedRealPaths,
            });
        }),
    );
    return [...results];
};
