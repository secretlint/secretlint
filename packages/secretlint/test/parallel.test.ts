import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { cli, run } from "../src/cli.js";

/**
 * The CLI lints files in worker threads when there are many files (see @secretlint/node parallel.ts).
 * These tests run the CLI on more files than one worker handles, and compare the result with `--no-parallel`.
 * On a machine with one CPU core, both runs use the main thread, and the tests still pass.
 */
const FILE_COUNT = 2600;
// Build the fake tokens at runtime, so this test file does not contain a secret-like string
const fakeGitHubToken = () => "ghp" + "_" + "wWPw5k4aXcaT4fNP0UcnZwJUVFk6LO0pINUx";

type Result = { filePath: string; messages: { ruleId: string; range: number[] }[] };
const sortByFilePath = (results: Result[]) => [...results].sort((a, b) => a.filePath.localeCompare(b.filePath));

describe("lint many files", () => {
    let tmpDir: string;
    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-cli-parallel-"));
        fs.writeFileSync(
            path.join(tmpDir, ".secretlintrc.json"),
            JSON.stringify({
                rules: [
                    { id: "@secretlint/secretlint-rule-example" },
                    { id: "@secretlint/secretlint-rule-preset-recommend" },
                ],
            }),
        );
        for (let index = 0; index < FILE_COUNT; index++) {
            const dir = path.join(tmpDir, `dir-${index % 10}`);
            fs.mkdirSync(dir, { recursive: true });
            let content = `line ${index}\n`;
            // the example rule reports "SECRET"
            if (index % 50 === 0) content += "SECRET\n";
            // keywords are matched case-insensitively, but the example rule reports only "SECRET"
            if (index % 50 === 1) content += "secret\n";
            if (index % 70 === 0) content += `token=${fakeGitHubToken()}\n`;
            fs.writeFileSync(path.join(dir, `file-${index}.txt`), content);
        }
    });
    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    const lint = async (flags: Partial<typeof cli.flags>) => {
        const result = await run(["**/*"], {
            ...cli.flags,
            cwd: tmpDir,
            color: false,
            format: "json",
            ...flags,
        });
        assert.ok(result.stdout);
        return { exitStatus: result.exitStatus, results: sortByFilePath(JSON.parse(result.stdout) as Result[]) };
    };
    const countFiles = (results: Result[], ruleId: string) => {
        return results.filter((result) => result.messages.some((message) => message.ruleId === ruleId)).length;
    };

    it("returns the same results with and without --no-parallel", async () => {
        const parallel = await lint({ parallel: true });
        const serial = await lint({ parallel: false });
        assert.deepStrictEqual(parallel, serial);
        // .secretlintrc.json is ignored by default
        assert.strictEqual(parallel.results.length, FILE_COUNT);
        assert.strictEqual(parallel.exitStatus, 1);
        assert.strictEqual(countFiles(parallel.results, "@secretlint/secretlint-rule-example"), FILE_COUNT / 50);
        assert.strictEqual(
            countFiles(parallel.results, "@secretlint/secretlint-rule-github"),
            Math.ceil(FILE_COUNT / 70),
        );
    });

    it("returns the same results with --secretlintrcJSON", async () => {
        const secretlintrcJSON = JSON.stringify({ rules: [{ id: "@secretlint/secretlint-rule-example" }] });
        const parallel = await lint({ parallel: true, secretlintrcJSON });
        const serial = await lint({ parallel: false, secretlintrcJSON });
        assert.deepStrictEqual(parallel, serial);
        assert.strictEqual(countFiles(parallel.results, "@secretlint/secretlint-rule-example"), FILE_COUNT / 50);
        assert.strictEqual(countFiles(parallel.results, "@secretlint/secretlint-rule-github"), 0);
    });

    it("returns the same results when the config can not be sent to workers", async () => {
        // A function in the options can not be cloned to a worker, so all files are linted in the main thread
        const configFilePath = path.join(tmpDir, "secretlintrc-with-function.cjs");
        fs.writeFileSync(
            configFilePath,
            `module.exports = { rules: [{ id: "@secretlint/secretlint-rule-example", options: { fn: () => {} } }] };\n`,
        );
        try {
            const parallel = await lint({ parallel: true, secretlintrc: configFilePath });
            const serial = await lint({ parallel: false, secretlintrc: configFilePath });
            assert.deepStrictEqual(parallel, serial);
            assert.strictEqual(countFiles(parallel.results, "@secretlint/secretlint-rule-example"), FILE_COUNT / 50);
        } finally {
            fs.rmSync(configFilePath);
        }
    });
});
