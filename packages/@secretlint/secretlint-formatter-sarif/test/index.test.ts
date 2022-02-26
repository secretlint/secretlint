import fs from "fs";
import path from "path";
import assert from "assert";
import { results } from "./snapshots/input";
import formatter from "../src/index";

const escapeStringRegexp = require("escape-string-regexp");
const snapshotsDir = path.join(__dirname, "snapshots");
const snapshotReplace = (value: string) => {
    return value.replace(new RegExp(escapeStringRegexp(snapshotsDir), "g"), "[SNAPSHOT]");
};

describe("@secretlint/secretlint-formatter-sarif", function () {
    it(`snapshot testing`, async function () {
        const fixtureDir = snapshotsDir;
        const actual = snapshotReplace(
            formatter(results, {
                color: true
            })
        );
        const expectedFilePath = path.join(fixtureDir, `output.sarif`);
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
});
