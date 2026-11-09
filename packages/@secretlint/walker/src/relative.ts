import path from "node:path";

/**
 * Fast path of `path.relative(from, to)` for the common case where `to` is
 * under `from`. Both paths are expected to be absolute and normalized
 * (built by `path.resolve` / `path.join`), so a plain prefix check is
 * equivalent and avoids `path.relative`'s resolve/normalize cost on every
 * entry. Falls back to `path.relative` for anything else (e.g. `to` is
 * outside `from`, `from` is a filesystem root, or case differs on Windows).
 */
export const relativeFrom = (from: string, to: string): string => {
    if (
        to.length > from.length + 1 &&
        to.startsWith(from) &&
        to[from.length] === path.sep &&
        !from.endsWith(path.sep)
    ) {
        return to.slice(from.length + 1);
    }
    return path.relative(from, to);
};
