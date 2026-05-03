import { readdir } from "node:fs/promises";
import path from "node:path";
import { createRootIgnore, extendIgnore, type IgnoreInstance } from "./ignore-stack.js";

export type WalkOptions = {
    cwd: string;
    patterns?: string[];
    ignoreFiles?: string[];
    extraIgnorePatterns?: string[];
    noGlob?: boolean;
};

const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

const walkDir = async (
    absDir: string,
    parentIg: IgnoreInstance,
    ignoreFiles: readonly string[],
    root: string,
    results: Set<string>,
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
            const relPosix = toPosix(path.relative(root, full));
            const target = entry.isDirectory() ? `${relPosix}/` : relPosix;
            if (relPosix !== "" && ig.ignores(target)) return;
            if (entry.isDirectory()) {
                await walkDir(full, ig, ignoreFiles, root, results);
            } else if (entry.isFile()) {
                results.add(full);
            }
        }),
    );
};

export const walk = async (options: WalkOptions): Promise<string[]> => {
    const root = path.resolve(options.cwd);
    const ignoreFiles = options.ignoreFiles ?? [];
    const rootIg = createRootIgnore(options.extraIgnorePatterns ?? []);
    const results = new Set<string>();
    await walkDir(root, rootIg, ignoreFiles, root, results);
    return [...results];
};
