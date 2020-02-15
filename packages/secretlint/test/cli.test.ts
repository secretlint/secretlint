import fs from "fs";
import path from "path";
import assert from "assert";
import { cli, run } from "../src/cli";
const fixturesDir = path.join(__dirname, "snapshots");
const createSnapshotReplacer = () => {
    return (_key: string, value: any) => {
        if (typeof value === "string") {
            return value.replace(fixturesDir, "[SNAPSHOT]");
        }
        return value;
    };
};

describe("cli snapshot testing", function() {
    fs.readdirSync(fixturesDir).map(caseName => {
        it(`test ${caseName}`, async function() {
            const fixtureDir = path.join(fixturesDir, caseName);
            const actualFilePath = path.join(fixtureDir, "input.txt");
            const actualOptions = require(path.join(fixtureDir, "options.ts")).options;
            const actual = await run([actualFilePath], {
                ...cli.flags,
                ...actualOptions,
                cwd: fixtureDir,
                // Less diff between env
                color: false,
                format: path.join(__dirname, "./test-formatter")
            }).catch(error => {
                // if throw an error, save it
                return `Error: ${error.message}`;
            });
            // json string to json
            if (typeof actual === "object" && actual.stdout) {
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
${fixtureDir}
${JSON.stringify(normalizedActual, createSnapshotReplacer(), 4)}
`
            );
        });
    });
});
