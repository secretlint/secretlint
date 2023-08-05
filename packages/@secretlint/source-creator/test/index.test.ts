import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { createRawSource } from "../src/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "snapshots");
const createSnapshotReplacer = () => {
    return (key: string, value: any) => {
        if (key === "content") {
            return "[SNIP]";
        }
        if (typeof value === "string") {
            return (
                value
                    .replace(fixturesDir, "[SNAPSHOT]")
                    // normalize path separator for Windows
                    .replace(/\\\\(?![rtn])/g, "/")
                    // normalize CRLF to LF
                    .replace(/\r\n/g, "\n")
            );
        }
        return value;
    };
};

describe("@secretlint/source-creator", function () {
    fs.readdirSync(fixturesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, async function () {
                const fixtureDir = path.join(fixturesDir, normalizedTestName);
                const actualFilePath = fs.readdirSync(fixtureDir).find((filePath) => {
                    return filePath.startsWith("input");
                });
                if (!actualFilePath) {
                    throw new Error("should put input.* file");
                }
                const actual = await createRawSource(path.join(fixtureDir, actualFilePath));
                const expectedFilePath = path.join(fixtureDir, "output.json");
                // Usage: update snapshots
                // UPDATE_SNAPSHOT=1 npm test
                if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, JSON.stringify(actual, createSnapshotReplacer(), 4));
                    this.skip(); // skip when updating snapshots
                    return;
                }
                // compare input and output
                const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                assert.deepStrictEqual(JSON.parse(JSON.stringify(actual, createSnapshotReplacer())), expected);
            });
        });
});
