import fs from "node:fs";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { results } from "./snapshots/input.js";
import formatter from "../src/index.js";
import escapeStringRegexp from "escape-string-regexp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotsDir = path.join(__dirname, "snapshots");
const snapshotReplace = (value: string) => {
    return (
        value
            // replace snapshotsDir to [SNAPSHOT]
            .replace(new RegExp(escapeStringRegexp(snapshotsDir), "g"), "[SNAPSHOT]")
            // 2. normalize path separator for Windows
            .replace(/\\\\/g, "/")
            .replace(/\r?\n/g, "\n")
    );
};

test("@secretlint/secretlint-formatter-sarif", (t) => {
    t.test(`snapshot testing`, async (context) => {
        const fixtureDir = snapshotsDir;
        const actual = snapshotReplace(
            formatter(results, {
                color: true,
                secretlintVersion: "2.3.4"
            })
        );
        const expectedFilePath = path.join(fixtureDir, `output.sarif`);
        // Usage: update snapshots
        // UPDATE_SNAPSHOT=1 npm test
        if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
            fs.writeFileSync(expectedFilePath, actual);
            context.skip(); // skip when updating snapshots
            return;
        }
        // compare input and output
        const expected = snapshotReplace(fs.readFileSync(expectedFilePath, "utf-8"));
        assert.strictEqual(actual, expected);
    });
});

test("uses the supplied scanner version", () => {
    const report = JSON.parse(formatter(results, { secretlintVersion: "2.3.4" }));
    assert.strictEqual(report.runs[0].tool.driver.version, "2.3.4");
});

test("omits the version for legacy formatter options", () => {
    const report = JSON.parse(formatter(results, { color: true }));
    assert.strictEqual(Object.hasOwn(report.runs[0].tool.driver, "version"), false);
    assert.strictEqual(report.runs[0].tool.driver.name, "secretlint");
    assert.strictEqual(
        report.runs[0].results.length,
        results.reduce((count, result) => count + result.messages.length, 0)
    );
});

test("accepts a direct call without formatter options", () => {
    const report = JSON.parse(formatter(results));
    assert.strictEqual(Object.hasOwn(report.runs[0].tool.driver, "version"), false);
    assert.strictEqual(
        report.runs[0].results.length,
        results.reduce((count, result) => count + result.messages.length, 0)
    );
});
