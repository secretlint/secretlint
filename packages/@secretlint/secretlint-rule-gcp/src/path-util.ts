/**
 * Return the last portion of a path, like `path.basename()` of Node.js, without importing `node:path`
 * (the rule must work in browsers).
 *
 * A path that has `/` is a POSIX path (or a URL-like path), and only `/` separates it:
 * `\` is a valid character of a file name on POSIX, so `/repo/staging\input.p12` is `staging\input.p12`.
 * A path without `/` is split by `\`, for Windows paths such as `C:\repo\input.p12`.
 */
export const basename = (filePath: string): string => {
    const separator = filePath.includes("/") ? "/" : "\\";
    // Trim the trailing separators without a regular expression: /[\\/]+$/ is slow on many separators
    let end = filePath.length;
    while (end > 0 && filePath[end - 1] === separator) {
        end--;
    }
    const trimmed = filePath.slice(0, end);
    const index = trimmed.lastIndexOf(separator);
    return index === -1 ? trimmed : trimmed.slice(index + 1);
};
