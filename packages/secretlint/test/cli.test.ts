import os from "node:os";
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
            const replaced = value
                .replace(SNAPSHOT_DIR, "[SNAPSHOT]")
                // glob use / , but Windows use \
                .replace(SNAPSHOT_DIR.replaceAll(path.sep, path.posix.sep), "[SNAPSHOT]")
                // normalize path separator for Windows
                .replace(/\\\\/g, "/")
                // normalize CRLF to LF
                .replace(/\r\n/g, "\n");
            // a native file path like the config file path uses \ on Windows
            return replaced.startsWith("[SNAPSHOT]") ? replaced.replace(/\\/g, "/") : replaced;
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
    // a preset: its rules have `patterns`
    const patternFixtureDir = path.join(SNAPSHOT_DIR, "preset-rule-severity-warning");
    const patternInputFilePath = path.join(patternFixtureDir, "input.txt");
    const runWithProfile = async (format: string) => {
        return run([patternInputFilePath], {
            ...cli.flags,
            cwd: patternFixtureDir,
            color: false,
            format,
            profile: true,
        });
    };
    it("should enable the profiler and print the summary if --profile is specified", async () => {
        const result = await runWithProfile("stylish");
        assert.strictEqual(secretLintProfiler.isEnabled, true);
        // the exit status is the one of the lint: the fixture has a warning only
        assert.strictEqual(result.exitStatus, 0);
        // the summary only: no lint results
        const output = result.stdout as string;
        assert.match(output, /^secretlint profile: [\d.]+ms, 1 files\n/);
        // phases, rules, patterns, and files
        assert.match(output, /\n {2}@node>execute +[\d.]+ +[\d.]+ +1\n/);
        assert.match(output, /\n +[\d.]+ +1 {2}@secretlint\/secretlint-rule-/);
        assert.match(
            output,
            /\n +[\d.]+ +[\d.]+ +\d+ +[1-9]\d* +[\d.]+ +\d+ {2}@secretlint\/secretlint-rule-[a-z-]+#\d+ \//,
        );
        assert.match(output, /\n +[\d.]+ {2}<cwd>[\\/]input\.txt$/);
    });
    it("should write the lint results to --output and print the summary only", async () => {
        const outputFilePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-profile-")), "result.json");
        const result = await run([patternInputFilePath], {
            ...cli.flags,
            cwd: patternFixtureDir,
            color: false,
            format: "json",
            profile: true,
            output: outputFilePath,
        });
        const report = JSON.parse(result.stdout as string);
        assert.strictEqual(report.files, 1);
        const lintResults = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
        assert.ok(Array.isArray(lintResults));
    });
    it("should print the summary as JSON if --profile and --format=json are specified", async () => {
        const result = await runWithProfile("json");
        // the standard output is one JSON document: the summary
        const report = JSON.parse(result.stdout as string);
        assert.deepStrictEqual(Object.keys(report), [
            "total",
            "files",
            "phases",
            "keywordScanThreads",
            "rules",
            "patterns",
            "slowestFiles",
        ]);
        assert.strictEqual(report.files, 1);
        assert.strictEqual(report.phases[0].name, "secretlint>cli");
        // the file path of a searched file uses "/" on Windows
        assert.strictEqual(
            report.slowestFiles[0].filePath.replaceAll("\\", "/"),
            patternInputFilePath.replaceAll("\\", "/"),
        );
        const matchedPatterns = report.patterns.filter((pattern: { matches: number }) => pattern.matches > 0);
        assert.ok(matchedPatterns.length > 0, `should have a pattern with matches: ${result.stdout}`);
        matchedPatterns.forEach((pattern: { ruleId: string; pattern: string; runs: number }) => {
            assert.match(pattern.ruleId, /^@secretlint\/secretlint-rule-/);
            assert.match(pattern.pattern, /^\/.+\/[a-z]*$/s);
            assert.ok(pattern.runs > 0);
        });
    });
});
