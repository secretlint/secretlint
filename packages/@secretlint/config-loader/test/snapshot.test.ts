import fs from "fs";
import path from "path";
import assert from "assert";
import { validateConfig, validateConfigResult } from "../src";

const snapshotDir = path.join(__dirname, "snapshots");
const formatResult = (result: validateConfigResult) => {
    return result.ok
        ? "OK"
        : result.error.message.replace(/cwd: .*/, "cwd: <cwd>").replace(/baseDir: .*/, "baseDir: <baseDir>");
};
describe("validateConfig", function () {
    fs.readdirSync(snapshotDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, async function () {
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
                assert.strictEqual(formatResult(actual), expected);
                if (normalizedTestName.startsWith("ok.")) {
                    assert.ok(actual.ok, "This validation should be passed ");
                } else {
                    assert.ok(!actual.ok, "This validation should be failed");
                }
            });
        });
});
