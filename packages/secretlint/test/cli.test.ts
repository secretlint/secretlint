import fs from "node:fs";
import assert from "node:assert";
import { cli, run } from "../src/cli.js";
import { fileURLToPath } from "url";
import path from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_DIR = path.join(__dirname, "snapshots");
const createSnapshotReplacer = () => {
    return (_key: string, value: any) => {
        if (typeof value === "string") {
            return (
                value
                    .replace(SNAPSHOT_DIR, "[SNAPSHOT]")
                    // glob use / , but Windows use \
                    .replace(SNAPSHOT_DIR.replaceAll(path.sep, path.posix.sep), "[SNAPSHOT]")
                    // normalize path separator for Windows
                    .replace(/\\\\/g, "/")
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
            const fixtureDir = path.join(SNAPSHOT_DIR, caseName);
            // url join input.txt
            const actualFilePath = path.join(fixtureDir, "input.txt");
            const fileURL = pathToFileURL(path.join(fixtureDir, "options.ts"));
            const options = await import(fileURL.href);
            const actualOptions = options.options;
            const actualInputs = options.inputs;
            const actual = await run(actualInputs ? actualInputs : [actualFilePath], {
                ...cli.flags,
                ...actualOptions,
                cwd: fixtureDir,
                // Less diff between env
                color: false,
                format: "json",
                debug: true,
            }).catch((error) => {
                // if throw an error, save it
                return `Error: ${error.message}`;
            });
            // json string to json
            if (typeof actual === "object" && actual.stdout && !actualOptions.version && !actualOptions.help) {
                actual.stdout = JSON.parse(actual.stdout);
            }
            const normalizedActual = JSON.parse(JSON.stringify(actual, createSnapshotReplacer(), 4));
            const expectedFilePath = path.join(fixtureDir, "output.json");
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
