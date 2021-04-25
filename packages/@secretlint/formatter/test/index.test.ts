import fs from "fs";
import path from "path";
import assert from "assert";
import { createFormatter, getFormatterList } from "../src/index";
import { results } from "./snapshots/input";

const escapeStringRegexp = require("escape-string-regexp");
const snapshotsDir = path.join(__dirname, "snapshots");
const snapshotReplace = (value: string) => {
    return value.replace(new RegExp(escapeStringRegexp(snapshotsDir), "g"), "[SNAPSHOT]");
};

describe("@secretlint/formatter", function () {
    const formatters = getFormatterList();
    formatters.forEach((formatter) => {
        const formatterName = formatter.name;
        it(`test ${formatterName}`, async function () {
            const fixtureDir = snapshotsDir;
            const formatter = createFormatter({
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
    });
});
