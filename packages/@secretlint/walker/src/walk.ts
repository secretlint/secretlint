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
 * One traversal unit: a starting directory and the patterns to match files
 * against once they are below it.
 */
type WalkJob = {
    rootDir: string;
    matchPatterns: string[];
};

type CompiledMatcher = Ignore | null;

/**
 * Group user-supplied patterns into traversal jobs by their static prefix.
 *
 * Each job represents one directory the walker descends into; patterns that
 * share a static prefix collapse into the same job so the walker traverses
 * each directory at most once.
 *
 * - When `patterns` is omitted, returns a single job rooted at `cwd`.
 * - Patterns containing no glob characters (or any pattern when `noGlob` is
 *   true) are flagged with the empty-string sentinel so the caller knows to
 *   take the literal-path branch via {@link handleStaticPath}.
 * - Otherwise, {@link splitGlobRoot} pulls the static prefix off the front
 *   of the pattern and the remainder is stored as the per-job match pattern.
 */
const buildJobs = (cwd: string, patterns: readonly string[] | undefined, noGlob: boolean | undefined): WalkJob[] => {
    if (patterns === undefined || patterns.length === 0) {
        return [{ rootDir: cwd, matchPatterns: [] }];
    }
    const byRoot = new Map<string, WalkJob>();
    const upsert = (rootDir: string, pattern: string): void => {
        let job = byRoot.get(rootDir);
        if (!job) {
            job = { rootDir, matchPatterns: [] };
            byRoot.set(rootDir, job);
        }
        job.matchPatterns.push(pattern);
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
 * Per-walk constants threaded through every recursive call. `walkRoot` is the
 * anchor for cascade-ignore relative paths (always `cwd`). `matchRoot` is the
 * per-job anchor for include-pattern matching (job's `rootDir`).
 */
type WalkContext = {
    ignoreFiles: readonly string[];
    walkRoot: string;
    matchRoot: string;
    matcher: CompiledMatcher;
    results: Set<string>;
};

/**
 * Build an ignore instance by walking the directory chain from `cwd` down to
 * (and including) `targetDir`, applying any ignore files encountered at each
 * level. This ensures that walks that start below `cwd` (because of a glob's
 * static prefix) still respect ancestor `.gitignore` files.
 */
const seedAncestorIgnore = async (
    rootIg: IgnoreInstance,
    cwd: string,
    targetDir: string,
    ignoreFiles: readonly string[],
): Promise<IgnoreInstance> => {
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
            const relFromWalkRoot = toPosix(path.relative(ctx.walkRoot, full));
            const target = isDir ? `${relFromWalkRoot}/` : relFromWalkRoot;
            if (ig.ignores(target)) return;
            if (isDir) {
                await walkSubdir(full, ig, ctx);
            } else if (ctx.matcher === null) {
                ctx.results.add(toPosix(full));
            } else {
                const relFromMatchRoot = toPosix(path.relative(ctx.matchRoot, full));
                if (ctx.matcher.ignores(relFromMatchRoot)) ctx.results.add(toPosix(full));
            }
        }),
    );
};

/**
 * Resolve a literal user-supplied path: stat once, then walk if it's a
 * directory or add directly if it's a file (after a final ignore check).
 */
const handleStaticPath = async (
    absPath: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    results: Set<string>,
): Promise<void> => {
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
            walkRoot,
            matchRoot: absPath,
            matcher: null,
            results,
        });
    } else if (info.isFile()) {
        const relFromWalkRoot = toPosix(path.relative(walkRoot, absPath));
        if (parentIg.ignores(relFromWalkRoot)) return;
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
    const jobs = buildJobs(cwd, options.patterns, options.noGlob);
    await Promise.all(
        jobs.map(async (job) => {
            const literalEntries = job.matchPatterns.filter((p) => p === "");
            const globPatterns = job.matchPatterns.filter((p) => p !== "");
            if (literalEntries.length > 0 && globPatterns.length === 0) {
                const parentDir = path.dirname(job.rootDir);
                const seededIg = await seedAncestorIgnore(rootIg, cwd, parentDir, ignoreFiles);
                await handleStaticPath(job.rootDir, seededIg, ignoreFiles, cwd, results);
                return;
            }
            const seededIg = await seedAncestorIgnore(rootIg, cwd, job.rootDir, ignoreFiles);
            await walkSeeded(job.rootDir, seededIg, {
                ignoreFiles,
                walkRoot: cwd,
                matchRoot: job.rootDir,
                matcher: compileMatcher(globPatterns),
                results,
            });
        }),
    );
    return [...results];
};
