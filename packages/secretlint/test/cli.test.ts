import fs from "node:fs";
import assert from "node:assert";
import { cli, run } from "../src/cli.js";
import { secretLintProfiler } from "@secretlint/profiler";
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
 * - pnpm run updateSnapshot
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
describe("cli snapshot testing", () => {
    it("--version should return version", async () => {
        const actual = await run([], {
            ...cli.flags,
            version: true,
            cwd: process.cwd(),
            // Less diff between env
            color: false,
            format: "json",
        });
        assert.ok(actual.stdout);
        assert.match(actual.stdout, /^[\d.]+$/);
    });
    fs.readdirSync(SNAPSHOT_DIR).map((caseName) => {
        it(`test ${caseName}`, async (t) => {
            const fixtureDir = path.join(SNAPSHOT_DIR, caseName);
            // url join input.txt
            const actualFilePath = path.join(fixtureDir, "input.txt");
            const fileURL = pathToFileURL(path.join(fixtureDir, "options.ts"));
            const options = await import(fileURL.href);
            const actualOptions = options.options;
            const actualInputs = options.inputs;
            // Logging Group
            console.group(`Snapshot Fixture: ${fixtureDir}`);
            const actual = await run(actualInputs ? actualInputs : [actualFilePath], {
                ...cli.flags,
                ...actualOptions,
                cwd: fixtureDir,
                // Less diff between env
                color: false,
                format: "json",
            }).catch((error) => {
                // if throw an error, save it
                return `Error: ${error.message}`;
            });
            console.groupEnd();
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
                    "utf-8",
                );
                t.skip(); // skip when updating snapshots
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
`,
            );
        });
    });
});

describe("--profile", () => {
    const fixtureDir = path.join(SNAPSHOT_DIR, "--format=json");
    const inputFilePath = path.join(fixtureDir, "input.txt");
    afterEach(() => {
        // reset the profiler state for other tests
        secretLintProfiler.setEnabled(false);
    });
    it("should not enable the profiler if --profile is not specified", async () => {
        await run([inputFilePath], {
            ...cli.flags,
            cwd: fixtureDir,
            color: false,
            format: "json",
        });
        assert.strictEqual(secretLintProfiler.isEnabled, false);
    });
    it("should enable the profiler and print the measures if --profile is specified", async () => {
        const logs: string[] = [];
        const consoleLog = console.log;
        console.log = (...args: unknown[]) => {
            logs.push(args.join(" "));
        };
        try {
            await run([inputFilePath], {
                ...cli.flags,
                cwd: fixtureDir,
                color: false,
                format: "stylish",
                profile: true,
            });
        } finally {
            console.log = consoleLog;
        }
        assert.strictEqual(secretLintProfiler.isEnabled, true);
        assert.ok(
            logs.some((log) => /^.+ - [\d.]+ms$/.test(log)),
            `should print the measures: ${JSON.stringify(logs)}`,
        );
    });
});

describe("SARIF scanner version", () => {
    for (const config of ["file", "inline"] as const) {
        for (const suppliedVersion of [undefined, "2.3.4"]) {
            it(`reports ${suppliedVersion ?? "the CLI version"} with ${config} config`, async () => {
                const cwd = path.join(SNAPSHOT_DIR, "--format=json");
                const filePath = path.join(cwd, "input.txt");
                const actual = await run(
                    [filePath],
                    {
                        ...cli.flags,
                        cwd,
                        color: false,
                        format: fileURLToPath(import.meta.resolve("@secretlint/secretlint-formatter-sarif")),
                        // Exercise config-file and inline-JSON engine options.
                        secretlintrcJSON:
                            config === "inline"
                                ? fs.readFileSync(path.join(cwd, ".secretlintrc.json"), "utf-8")
                                : undefined,
                    },
                    suppliedVersion,
                );
                assert.ok(actual.stdout);
                const packageJson = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"));
                assert.strictEqual(
                    JSON.parse(actual.stdout).runs[0].tool.driver.version,
                    suppliedVersion ?? packageJson.version,
                );
            });
        }
    }
});
