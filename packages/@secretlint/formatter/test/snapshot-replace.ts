import path from "node:path";
import { fileURLToPath } from "node:url";
import escapeStringRegexp from "escape-string-regexp";

export const snapshotsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "snapshots");
/**
 * "github" formatter escapes `:` and `,` of the file path as a property of a workflow command.
 * For example, `D:\\path` on Windows is `D%3A\\path`.
 */
const escapedSnapshotsDir = snapshotsDir.replace(
    /[%:,]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
);
/**
 * Make the output independent of the directory and the platform
 */
export const snapshotReplace = (value: string) => {
    return (
        value
            // replace snapshotsDir to [SNAPSHOT]
            .replace(new RegExp(escapeStringRegexp(snapshotsDir), "g"), "[SNAPSHOT]")
            .replace(new RegExp(escapeStringRegexp(escapedSnapshotsDir), "g"), "[SNAPSHOT]")
            // 1. escape \n \t \r
            .replace(/\\([ntr])/g, "_!!!_$1")
            // 2. normalize path separator for Windows
            .replace(/\\/g, "/")
            // 3. restore \n \t \r
            .replace(/_!!!_/g, "\\")
            .replace(/\r?\n/g, "\n")
    );
};
