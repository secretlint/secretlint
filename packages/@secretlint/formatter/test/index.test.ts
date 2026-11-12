import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { loadFormatter, getFormatterList } from "../src/index.js";
import { results } from "./snapshots/input.js";
import escapeStringRegexp from "escape-string-regexp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotsDir = path.join(__dirname, "snapshots");
/**
 * "github" formatter escapes `:` and `,` of the file path as a property of a workflow command.
 * For example, `D:\\path` on Windows is `D%3A\\path`.
 */
const escapedSnapshotsDir = snapshotsDir.replace(
    /[%:,]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
);
const snapshotReplace = (value: string) => {
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

describe("@secretlint/formatter", () => {
    const formatters = getFormatterList();
    for (const formatter of formatters) {
        const formatterName = formatter.name;
        // TODO: skip json and table test if windows
        const it_ = process.platform === "win32" && formatterName === "json" ? it.skip : it;
        it_(`test ${formatterName}`, async (t) => {
            const fixtureDir = snapshotsDir;
            const formatter = await loadFormatter({
                color: false,
                formatterName: formatterName,
                // The results do not have the content of the sources
                getSource: (filePath) => fs.readFileSync(filePath, "utf-8"),
            });
            const actual = snapshotReplace(formatter.format(results));
            const expectedFilePath = path.join(fixtureDir, `output.${formatterName}.txt`);
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(expectedFilePath, actual);
                t.skip(); // skip when updating snapshots
                return;
            }
            // compare input and output
            const expected = snapshotReplace(fs.readFileSync(expectedFilePath, "utf-8"));
            assert.strictEqual(actual, expected);
        });
    }
});
