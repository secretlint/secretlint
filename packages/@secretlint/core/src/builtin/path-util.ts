/**
 * Return the last portion of a path, like `path.basename()` of Node.js.
 * Both `/` and `\` are treated as separators, so it works for POSIX and Windows paths
 * without importing `node:path` (core must work in browsers).
 */
export const basename = (filePath: string): string => {
    // Trim the trailing separators without a regular expression: /[\\/]+$/ is slow on many separators
    let end = filePath.length;
    while (end > 0 && (filePath[end - 1] === "/" || filePath[end - 1] === "\\")) {
        end--;
    }
    const trimmed = filePath.slice(0, end);
    const index = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
    return index === -1 ? trimmed : trimmed.slice(index + 1);
};
