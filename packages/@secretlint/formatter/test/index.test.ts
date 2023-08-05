import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { loadFormatter, getFormatterList } from "../src/index.js";
import { results } from "./snapshots/input.js";
import escapeStringRegexp from "escape-string-regexp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotsDir = path.join(__dirname, "snapshots");
const snapshotReplace = (value: string) => {
    return (
        value
            .replace(new RegExp(escapeStringRegexp(snapshotsDir), "g"), "[SNAPSHOT]")
            // normalize path separator for Windows
            .replace(/\\\\(?![rtn])/g, "/")
            // normalize CRLF to LF
            .replace(/\r\n/g, "\n")
    );
};

describe("@secretlint/formatter", function () {
    const formatters = getFormatterList();
    for (const formatter of formatters) {
        const formatterName = formatter.name;
        it(`test ${formatterName}`, async function () {
            const fixtureDir = snapshotsDir;
            const formatter = await loadFormatter({
                color: false,
                formatterName: formatterName,
            });
            const actual = snapshotReplace(formatter.format(results));
            const expectedFilePath = path.join(fixtureDir, `output.${formatterName}.txt`);
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(expectedFilePath, actual);
                this.skip(); // skip when updating snapshots
                return;
            }
            // compare input and output
            const expected = fs.readFileSync(expectedFilePath, "utf-8");
            assert.strictEqual(actual, expected);
        });
    }
});
