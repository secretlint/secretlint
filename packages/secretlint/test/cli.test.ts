import fs from "node:fs";
import assert from "node:assert";
import { cli, run } from "../src/cli.js";
import { fileURLToPath } from "url";

const SNAPSHOT_DIR = new URL("./snapshots/", import.meta.url);
const createSnapshotReplacer = () => {
    return (_key: string, value: any) => {
        if (typeof value === "string") {
            return (
                value
                    .replace(fileURLToPath(SNAPSHOT_DIR), "[SNAPSHOT]/")
                    // normalize path separator for Windows
                    .replace(/\\/g, "/")
                    // normalize CRLF to LF
                    .replace(/\r\n/g, "\n")
            );
        }
        return value;
    };
};
/**
 *
 * Update Snapshots
 * - yarn run updateSnapshot
 *
 * File Overview
 *
 * - input.txt
 * - options.ts
 *   - exports inputs -> use inputs instead of input.txt
 *   - exports options -> use options
 * - .secretelintrc.json
 *   - config file
 * - output.json
 *   - snapshot result
 */
describe("cli snapshot testing", function () {
    fs.readdirSync(SNAPSHOT_DIR).map((caseName) => {
        it(`test ${caseName}`, async function () {
            const fixtureDir = new URL(caseName + "/", SNAPSHOT_DIR);
            // url join input.txt
            const actualFilePath = new URL("./input.txt", fixtureDir);
            const options = await import(new URL("./options.ts", fixtureDir).href);
            const actualOptions = options.options;
            const actualInputs = options.inputs;
            const actual = await run(actualInputs ? actualInputs : [fileURLToPath(actualFilePath)], {
                ...cli.flags,
                ...actualOptions,
                cwd: fileURLToPath(fixtureDir),
                // Less diff between env
                color: false,
                format: "json",
            }).catch((error) => {
                // if throw an error, save it
                return `Error: ${error.message}`;
            });
            // json string to json
            if (typeof actual === "object" && actual.stdout) {
                actual.stdout = JSON.parse(actual.stdout);
            }
            const normalizedActual = JSON.parse(JSON.stringify(actual, createSnapshotReplacer(), 4));
            const expectedFilePath = new URL("output.json", fixtureDir);
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(
                    expectedFilePath,
                    JSON.stringify(normalizedActual, createSnapshotReplacer(), 4),
                    "utf-8"
                );
                this.skip(); // skip when updating snapshots
                return;
            }
            // compare input and output
            const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
            assert.deepStrictEqual(
                normalizedActual,
                expected,
                `
Fixture: ${fixtureDir}
Result:
${JSON.stringify(normalizedActual, createSnapshotReplacer(), 4)}
`
            );
        });
    });
});
