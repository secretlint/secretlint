import { readdir, stat } from "node:fs/promises";
import path from "node:path";
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

const matchesAny = (relPosix: string, patterns: readonly string[]): boolean => {
    if (patterns.length === 0) return true;
    for (const p of patterns) {
        if (path.matchesGlob(relPosix, p)) return true;
    }
    return false;
};

type WalkJob = {
    rootDir: string;
    matchPatterns: string[];
};

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
    ignoreFiles: readonly string[]
): Promise<IgnoreInstance> => {
    const relative = path.relative(cwd, targetDir);
    if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
        // targetDir is cwd, outside cwd, or unrelated — only seed at cwd itself.
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

const walkDir = async (
    absDir: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matchPatterns: readonly string[],
    results: Set<string>
): Promise<void> => {
    const ig = await extendIgnore(parentIg, absDir, ignoreFiles);
    let entries;
    try {
        entries = await readdir(absDir, { withFileTypes: true });
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    await Promise.all(
        entries.map(async (entry) => {
            const full = path.join(absDir, entry.name);
            const relFromWalkRoot = toPosix(path.relative(walkRoot, full));
            const target = entry.isDirectory() ? `${relFromWalkRoot}/` : relFromWalkRoot;
            if (ig.ignores(target)) return;
            if (entry.isDirectory()) {
                await walkDir(full, ig, ignoreFiles, walkRoot, matchRoot, matchPatterns, results);
            } else if (entry.isFile()) {
                const relFromMatchRoot = toPosix(path.relative(matchRoot, full));
                if (matchesAny(relFromMatchRoot, matchPatterns)) results.add(full);
            }
        })
    );
};

const handleStaticPath = async (
    absPath: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    results: Set<string>
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
        const ig = await extendIgnore(parentIg, absPath, ignoreFiles);
        await walkDir(absPath, ig, ignoreFiles, walkRoot, absPath, [], results);
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
            // For static paths the ancestor seed is taken from the parent
            // directory of the path; for directory walks it's from cwd up to
            // (and including) the job's root directory.
            if (literalEntries.length > 0 && globPatterns.length === 0) {
                const parentDir = path.dirname(job.rootDir);
                const seededIg = await seedAncestorIgnore(rootIg, cwd, parentDir, ignoreFiles);
                await handleStaticPath(job.rootDir, seededIg, ignoreFiles, cwd, results);
                return;
            }
            const seededIg = await seedAncestorIgnore(rootIg, cwd, job.rootDir, ignoreFiles);
            // walkDir's first step calls extendIgnore(seededIg, job.rootDir, ...)
            // again, which would double-apply the rootDir's ignore file. To
            // avoid the duplicate read we walk children directly.
            await walkChildren(job.rootDir, seededIg, ignoreFiles, cwd, job.rootDir, globPatterns, results);
        })
    );
    return [...results];
};

/**
 * Like walkDir but does NOT call extendIgnore for `absDir` — used when the
 * caller has already seeded the ignore instance for that exact directory.
 */
const walkChildren = async (
    absDir: string,
    ig: IgnoreInstance,
    ignoreFiles: readonly string[],
    walkRoot: string,
    matchRoot: string,
    matchPatterns: readonly string[],
    results: Set<string>
): Promise<void> => {
    let entries;
    try {
        entries = await readdir(absDir, { withFileTypes: true });
    } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "ENOENT" || code === "EACCES") return;
        throw error;
    }
    await Promise.all(
        entries.map(async (entry) => {
            const full = path.join(absDir, entry.name);
            const relFromWalkRoot = toPosix(path.relative(walkRoot, full));
            const target = entry.isDirectory() ? `${relFromWalkRoot}/` : relFromWalkRoot;
            if (ig.ignores(target)) return;
            if (entry.isDirectory()) {
                await walkDir(full, ig, ignoreFiles, walkRoot, matchRoot, matchPatterns, results);
            } else if (entry.isFile()) {
                const relFromMatchRoot = toPosix(path.relative(matchRoot, full));
                if (matchesAny(relFromMatchRoot, matchPatterns)) results.add(full);
            }
        })
    );
};
