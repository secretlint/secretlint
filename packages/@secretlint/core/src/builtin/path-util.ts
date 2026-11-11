/**
 * Return the last portion of a path, like `path.basename()` of Node.js.
 * Both `/` and `\` are treated as separators, so it works for POSIX and Windows paths
 * without importing `node:path` (core must work in browsers).
 */
export const basename = (filePath: string): string => {
    const trimmed = filePath.replace(/[\\/]+$/, "");
    const index = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
    return index === -1 ? trimmed : trimmed.slice(index + 1);
};
