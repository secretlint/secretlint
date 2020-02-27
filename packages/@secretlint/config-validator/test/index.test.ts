import fs from "fs";
import path from "path";
import assert from "assert";
import { validateRawConfig } from "../src/index";

const fixturesDir = path.join(__dirname, "snapshots");
const validateReturn = (content: any): "OK" | string => {
    const result = validateRawConfig(content);
    if (result.ok) {
        return "OK";
    } else {
        return result.error.message;
    }
};
describe("@secretlint/config-validator", function() {
    fs.readdirSync(fixturesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, function() {
                const fixtureDir = path.join(fixturesDir, normalizedTestName);
                const secretlintrcFileName = fs.readdirSync(fixtureDir).find(filePath => {
                    return filePath.startsWith(".secretlintrc");
                });
                if (!secretlintrcFileName) {
                    throw new Error("Should put .secretelint.* file");
                }
                const actualFilePath = path.join(fixtureDir, secretlintrcFileName);
                const actualContent = require(actualFilePath);
                const actual = validateReturn(actualContent);
                const expectedFilePath = path.join(fixtureDir, "output.txt");
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
                if (normalizedTestName.startsWith("ok.")) {
                    assert.strictEqual(actual, "OK", "should be passed validation");
                } else {
                    assert.notStrictEqual(actual, "OK", "should be failed validation");
                }
            });
        });
});
