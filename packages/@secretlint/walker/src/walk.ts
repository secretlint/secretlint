import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { Dirent } from "node:fs";
import ignore, { type Ignore } from "ignore";
import { createRootIgnore, extendIgnore, type IgnoreInstance } from "./ignore-stack.js";
import { isDynamicPattern, splitGlobRoot } from "./glob-root.js";

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

type WalkJob = {
    rootDir: string;
    matchPatterns: string[];
};

type CompiledMatcher = Ignore | null;

const buildJobs = (cwd: string, patterns: readonly string[] | undefined, noGlob: boolean | undefined): WalkJob[] => {
    if (patterns === undefined || patterns.length === 0) {
        return [{ rootDir: cwd, matchPatterns: [] }];
    }
    const byRoot = new Map<string, string[]>();
    for (const raw of patterns) {
        const normalized = raw.replaceAll("\\", "/");
        if (noGlob || !isDynamicPattern(normalized)) {
            const abs = path.isAbsolute(normalized) ? normalized : path.join(cwd, normalized);
            const list = byRoot.get(abs) ?? [];
            list.push("");
            byRoot.set(abs, list);
            continue;
        }
        const { rootDir, matchPattern } = splitGlobRoot(normalized);
        const abs = rootDir === "" ? cwd : path.isAbsolute(rootDir) ? rootDir : path.join(cwd, rootDir);
        const list = byRoot.get(abs) ?? [];
        list.push(matchPattern);
        byRoot.set(abs, list);
    }
    return [...byRoot.entries()].map(([rootDir, matchPatterns]) => ({ rootDir, matchPatterns }));
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
 * directory itself. Reads `absDir` once, derives ignore-file presence from
 * the dirent listing, and recurses with `walkSubdir` (which loads ignore
 * files for the child).
 */
const walkSeeded = async (
    absDir: string,
    ig: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matcher: CompiledMatcher,
    results: Set<string>,
): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    await processEntries(absDir, entries, ig, ignoreFiles, walkRoot, matchRoot, matcher, results);
};

/**
 * Recurse into a child directory: read it once, derive ignore-file presence,
 * extend the ignore stack accordingly, then process entries.
 */
const walkSubdir = async (
    absDir: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matcher: CompiledMatcher,
    results: Set<string>,
): Promise<void> => {
    const entries = await safeReaddir(absDir);
    if (entries === null) return;
    const present = presentIgnoreNames(entries, ignoreFiles);
    const ig = await extendIgnore(parentIg, absDir, ignoreFiles, present);
    await processEntries(absDir, entries, ig, ignoreFiles, walkRoot, matchRoot, matcher, results);
};

const processEntries = async (
    absDir: string,
    entries: readonly Dirent[],
    ig: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matcher: CompiledMatcher,
    results: Set<string>,
): Promise<void> => {
    await Promise.all(
        entries.map(async (entry) => {
            const isDir = entry.isDirectory();
            const isFile = entry.isFile();
            if (!isDir && !isFile) return;
            const full = path.join(absDir, entry.name);
            const relFromWalkRoot = toPosix(path.relative(walkRoot, full));
            const target = isDir ? `${relFromWalkRoot}/` : relFromWalkRoot;
            if (ig.ignores(target)) return;
            if (isDir) {
                await walkSubdir(full, ig, ignoreFiles, walkRoot, matchRoot, matcher, results);
            } else {
                if (matcher === null) {
                    results.add(full);
                } else {
                    const relFromMatchRoot = toPosix(path.relative(matchRoot, full));
                    if (matcher.ignores(relFromMatchRoot)) results.add(full);
                }
            }
        }),
    );
};

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
        await walkSubdir(absPath, parentIg, ignoreFiles, walkRoot, absPath, null, results);
    } else if (info.isFile()) {
        const relFromWalkRoot = toPosix(path.relative(walkRoot, absPath));
        if (parentIg.ignores(relFromWalkRoot)) return;
        results.add(absPath);
    }
};

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
            const matcher = compileMatcher(globPatterns);
            await walkSeeded(job.rootDir, seededIg, ignoreFiles, cwd, job.rootDir, matcher, results);
        }),
    );
    return [...results];
};
