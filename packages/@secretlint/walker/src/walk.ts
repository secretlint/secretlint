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
    rootDir: string;          // absolute
    matchPatterns: string[];  // relative, posix; empty = match everything
};

const buildJobs = (cwd: string, patterns: readonly string[] | undefined, noGlob: boolean | undefined): WalkJob[] => {
    if (patterns === undefined || patterns.length === 0) {
        return [{ rootDir: cwd, matchPatterns: [] }];
    }
    // Group all globs that share the same rootDir into a single walk to avoid
    // double traversal.
    const byRoot = new Map<string, string[]>();
    for (const raw of patterns) {
        const normalized = raw.replaceAll("\\", "/");
        if (noGlob || !isDynamicPattern(normalized)) {
            const abs = path.isAbsolute(normalized) ? normalized : path.join(cwd, normalized);
            const list = byRoot.get(abs) ?? [];
            list.push(""); // sentinel meaning "this exact path/dir"
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
            if (relFromWalkRoot !== "" && ig.ignores(target)) return;
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
        await walkDir(absPath, parentIg, ignoreFiles, walkRoot, absPath, [], results);
    } else if (info.isFile()) {
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
                await handleStaticPath(job.rootDir, rootIg, ignoreFiles, cwd, results);
                return;
            }
            await walkDir(job.rootDir, rootIg, ignoreFiles, cwd, job.rootDir, globPatterns, results);
        })
    );
    return [...results];
};
