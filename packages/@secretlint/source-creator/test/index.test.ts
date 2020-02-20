import fs from "fs";
import path from "path";
import assert from "assert";
import { createRawSource } from "../src/index";

const fixturesDir = path.join(__dirname, "snapshots");
const createSnapshotReplacer = () => {
    return (key: string, value: any) => {
        if (key === "content") {
            return "[SNIP]";
        }
        if (typeof value === "string") {
            return value.replace(fixturesDir, "[SNAPSHOT]");
        }
        return value;
    };
};

describe("@secretlint/source-creator", function() {
    fs.readdirSync(fixturesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, async function() {
                const fixtureDir = path.join(fixturesDir, normalizedTestName);
                const actualFilePath = fs.readdirSync(fixtureDir).find(filePath => {
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
                assert.deepStrictEqual(actual, expected);
            });
        });
});
