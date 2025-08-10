import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { validateConfig, validateConfigResult } from "../src/index.js";
import { isAggregationError } from "../src/AggregationError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotDir = path.join(__dirname, "snapshots");
const formatResult = (result: validateConfigResult) => {
    return result.ok
        ? "OK"
        : result.error.message
              .replace(/cwd: .*/, "cwd: <cwd>")
              .replace(/baseDir: .*/, "baseDir: <baseDir>")
              // 1. escape \n \t \r
              .replace(/\\([ntr])/g, "_!!!_$1")
              // 2. normalize path separator for Windows
              .replace(/\\/g, "/")
              // 3. restore \n \t \r
              .replace(/_!!!_/g, "\\")
              // \r\n -> \n
              .replace(/\r\n/g, "\n");
};
describe("validateConfig", () => {
    fs.readdirSync(snapshotDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, async () => {
                const fixtureDir = path.join(snapshotDir, normalizedTestName);
                const secretlintrcFileName = fs.readdirSync(fixtureDir).find((filePath) => {
                    return filePath.startsWith(".secretlintrc");
                });
                if (!secretlintrcFileName) {
                    throw new Error("Should put .secretelint.* file");
                }
                const actualFilePath = path.join(fixtureDir, secretlintrcFileName);
                const actual = await validateConfig({
                    cwd: fixtureDir,
                    configFilePath: actualFilePath,
                    node_moduleDir: path.join(fixtureDir, "modules"),
                });
                const expectedFilePath = path.join(fixtureDir, "output.txt");
                // Usage: update snapshots
                // UPDATE_SNAPSHOT=1 npm test
                if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, formatResult(actual));
                    this.skip(); // skip when updating snapshots
                    return;
                }
                // compare input and output
                const expected = fs.readFileSync(expectedFilePath, "utf-8");
                try {
                    assert.strictEqual(formatResult(actual), expected);
                } catch (error) {
                    console.error(`Test failed: ${normalizedTestName}`);
                    if ("error" in actual && isAggregationError(actual.error)) {
                        actual.error.errors.forEach((error) => {
                            console.error(error);
                        });
                    }
                    throw error;
                }
                if (normalizedTestName.startsWith("ok.")) {
                    assert.ok(actual.ok, "This validation should be passed");
                } else {
                    assert.ok(!actual.ok, "This validation should be failed");
                }
            });
        });
});
