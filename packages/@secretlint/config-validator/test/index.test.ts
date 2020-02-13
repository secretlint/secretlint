import fs from "fs";
import path from "path";
import assert from "assert";
import { validate } from "../src/index";

const fixturesDir = path.join(__dirname, "snapshots");
const validateReturn = (content: unknown): "OK" | string => {
    const result = validate(content);
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
                const actualFilePath = path.join(fixtureDir, ".secretlintrc.json");
                const actualContent = JSON.parse(fs.readFileSync(actualFilePath, "utf-8"));
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
