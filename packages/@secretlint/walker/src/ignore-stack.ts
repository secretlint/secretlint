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
 * Per gitignore semantics every pattern in a `.gitignore` is anchored to
 * that file's directory. node-ignore evaluates patterns against the path
 * the caller passes in, so when we merge rules from a nested `.gitignore`
 * into a single cumulative matcher rooted at `walkRoot`, we must rewrite
 * the patterns to include the `relDir` prefix. Without this rewrite a
 * rule like `src/**\/*.ts` from `packages/foo/.gitignore` would only
 * match a top-level `src/` instead of `packages/foo/src/`.
 *
 * Rewriting follows the gitignore spec
 * (https://git-scm.com/docs/gitignore#_pattern_format):
 *
 * - Blank lines and `#` comments stay as-is.
 * - A leading `!` (negation) is preserved through the rewrite.
 * - "Rooted" patterns (those containing a `/` other than at the very end)
 *   are anchored to `relDir`: `src/**\/*.ts` becomes `<relDir>/src/**\/*.ts`.
 * - "Name" patterns (no `/`, or only a trailing `/` for directory matches)
 *   apply at any depth below the `.gitignore`'s directory: `*.log` becomes
 *   `<relDir>/**\/*.log`, `build/` becomes `<relDir>/**\/build/`.
 */
const rewritePatternsForRelDir = (content: string, relDir: string): string => {
    if (relDir === "") return content;
    const prefix = relDir.endsWith("/") ? relDir : `${relDir}/`;
    const out: string[] = [];
    for (const raw of content.split("\n")) {
        const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
        if (line === "" || line.startsWith("#")) {
            out.push(raw);
            continue;
        }
        let body = line;
        let negation = "";
        if (body.startsWith("!")) {
            negation = "!";
            body = body.slice(1);
        }
        const slashIdx = body.indexOf("/");
        const rooted = slashIdx !== -1 && slashIdx !== body.length - 1;
        let prefixed: string;
        if (rooted) {
            // Strip any leading `/` to avoid `<prefix>//foo`.
            prefixed = prefix + (body.startsWith("/") ? body.slice(1) : body);
        } else {
            prefixed = `${prefix}**/${body}`;
        }
        out.push(negation + prefixed);
    }
    return out.join("\n");
};

/**
 * Build a new ignore instance by extending `parent` with any ignore files
 * found in `dir`. If none are present, returns `parent` unchanged so callers
 * can avoid allocating new instances on each level.
 *
 * `walkRoot` is the anchor against which the cumulative matcher's paths
 * are evaluated; rules from a `.gitignore` that lives inside a
 * subdirectory of `walkRoot` are rewritten with that subdirectory's
 * prefix so a single matcher behaves like git's per-directory stack.
 *
 * `presentNames` is an optional pre-filter (e.g. derived from `Dirent[]`)
 * of the ignore-file names that actually exist in `dir`; when provided we
 * skip the readFile ENOENT round-trip for missing files entirely.
 */
export const extendIgnore = async (
    parent: IgnoreInstance,
    dir: string,
    walkRoot: string,
    ignoreFiles: readonly string[],
    presentNames?: ReadonlySet<string>,
): Promise<IgnoreInstance> => {
    const candidates = presentNames ? ignoreFiles.filter((name) => presentNames.has(name)) : ignoreFiles;
    if (candidates.length === 0) return parent;

    const reads = await Promise.all(candidates.map((name) => tryReadIgnoreFile(path.join(dir, name))));
    // Empty / whitespace-only ignore files contribute zero rules; reuse parent.
    const contents = reads.filter((c): c is string => c !== null && c.trim().length > 0);
    if (contents.length === 0) return parent;

    const relDirNative = path.relative(walkRoot, dir);
    const relDir = path.sep === "\\" ? relDirNative.replaceAll("\\", "/") : relDirNative;
    const rewritten = contents.map((c) => rewritePatternsForRelDir(c, relDir));

    const next = ignore().add(parent);
    for (const content of rewritten) next.add(content);
    return next;
};
