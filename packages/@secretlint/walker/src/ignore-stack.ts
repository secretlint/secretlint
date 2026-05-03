import { readFile } from "node:fs/promises";
import path from "node:path";
import ignore, { type Ignore } from "ignore";

/** A node-ignore matcher used as a directory's cumulative ignore stack. */
export type IgnoreInstance = Ignore;

/**
 * Build the root ignore instance for a walk. `extraPatterns` are seeded
 * before any file-based rules so callers can hard-code project-level
 * exclusions (e.g. `**\/.git/**`).
 */
export const createRootIgnore = (extraPatterns: readonly string[]): IgnoreInstance => {
    return ignore().add(extraPatterns as string[]);
};

/**
 * Read an ignore file and return its content, or null when the file is
 * absent or unreadable. ENOENT (file not present) and EACCES (permission
 * denied) are tolerated so a single missing/locked ignore file does not
 * abort the entire walk; other errors are wrapped and rethrown with the
 * original error preserved on `cause`.
 */
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

/**
 * Returns true when `content` has any non-whitespace characters.
 *
 * Used to skip empty ignore files (e.g. `touch .gitignore`) so we don't
 * allocate a fresh ignore() instance that adds no rules. Comments and
 * pattern parsing are left to node-ignore.
 */
const hasContent = (content: string): boolean => content.trim().length > 0;

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
    const contents = reads.filter((c): c is string => c !== null && hasContent(c));
    if (contents.length === 0) return parent;

    const next = ignore().add(parent);
    for (const content of contents) next.add(content);
    return next;
};
