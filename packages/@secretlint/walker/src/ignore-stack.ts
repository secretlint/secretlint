import { readFile } from "node:fs/promises";
import path from "node:path";
import ignore, { type Ignore } from "ignore";

export type IgnoreInstance = Ignore;

export const createRootIgnore = (extraPatterns: readonly string[]): IgnoreInstance => {
    return ignore().add(extraPatterns as string[]);
};

const tryReadIgnoreFile = async (filePath: string): Promise<string | null> => {
    try {
        return await readFile(filePath, "utf8");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw new Error(`Failed to read ignore file: ${filePath}`, { cause: error });
    }
};

/**
 * Build a new ignore instance by extending `parent` with any ignore files
 * found in `dir`. If none are present, returns `parent` unchanged so callers
 * can avoid allocating new instances on each level.
 */
export const extendIgnore = async (
    parent: IgnoreInstance,
    dir: string,
    ignoreFiles: readonly string[],
): Promise<IgnoreInstance> => {
    const contents: string[] = [];
    for (const name of ignoreFiles) {
        const content = await tryReadIgnoreFile(path.join(dir, name));
        if (content !== null) contents.push(content);
    }
    if (contents.length === 0) return parent;
    const next = ignore().add(parent);
    for (const content of contents) next.add(content);
    return next;
};
