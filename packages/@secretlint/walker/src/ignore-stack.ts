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
        const code = (error as NodeJS.ErrnoException).code;
        // Mirror safeReaddir/handleStaticPath: a single unreadable ignore file
        // shouldn't abort the entire walk.
        if (code === "ENOENT" || code === "EACCES") return null;
        throw new Error(`Failed to read ignore file: ${filePath}`, { cause: error });
    }
};

const isMeaningful = (content: string): boolean => {
    // Skip empty / whitespace-only / comment-only files to avoid
    // allocating a new ignore() instance with zero rules.
    for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.length > 0 && !trimmed.startsWith("#")) return true;
    }
    return false;
};

/**
 * Build a new ignore instance by extending `parent` with any ignore files
 * found in `dir`. If none are present, returns `parent` unchanged so callers
 * can avoid allocating new instances on each level.
 *
 * `presentNames` is an optional pre-filter (e.g. derived from `Dirent[]`) of
 * the ignore-file names that actually exist in `dir`; when provided, we skip
 * the readFile ENOENT round-trip for missing files entirely.
 */
export const extendIgnore = async (
    parent: IgnoreInstance,
    dir: string,
    ignoreFiles: readonly string[],
    presentNames?: ReadonlySet<string>,
): Promise<IgnoreInstance> => {
    const candidates = presentNames ? ignoreFiles.filter((name) => presentNames.has(name)) : ignoreFiles;
    if (candidates.length === 0) return parent;

    const reads = await Promise.all(candidates.map((name) => tryReadIgnoreFile(path.join(dir, name))));
    const contents = reads.filter((c): c is string => c !== null && isMeaningful(c));
    if (contents.length === 0) return parent;

    const next = ignore().add(parent);
    for (const content of contents) next.add(content);
    return next;
};
