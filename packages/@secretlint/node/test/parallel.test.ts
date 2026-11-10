import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clearHooks, registerResolveHook } from "@secretlint/resolver";
import { secretLintProfiler } from "@secretlint/profiler";
// Workers run the built worker.js, so this test uses the built module.
// `pnpm test` builds the package before running the tests.
import { getWorkerCount, isPlainJSONValue, lintFilesInWorkers } from "../module/parallel.js";
import { lintFile, loadConfigFromSource } from "../module/lint-file.js";
import type { ConfigSource } from "../src/lint-file.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.join(__dirname, "fixtures/valid-config");
const configSource: ConfigSource = {
    type: "file",
    cwd: configDir,
    configFilePath: path.join(configDir, ".secretlintrc.json"),
};
const lintOptions = { maskSecrets: true };

describe("parallel", () => {
    let tmpDir: string;
    let filePathList: string[];
    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-node-parallel-"));
        filePathList = Array.from({ length: 50 }, (_, index) => {
            const filePath = path.join(tmpDir, `file-${index}.txt`);
            fs.writeFileSync(filePath, index % 3 === 0 ? `line ${index}\nSECRET\n` : `line ${index}\n`);
            return filePath;
        });
    });
    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    const createMainThreadLinter = async () => {
        const loaded = await loadConfigFromSource(configSource);
        assert.ok(loaded.ok);
        const mainThreadFiles: string[] = [];
        const lintInMainThread = async (files: string[]) => {
            mainThreadFiles.push(...files);
            const results = [];
            for (const filePath of files) {
                results.push(await lintFile({ filePath, config: loaded.config, options: lintOptions }));
            }
            return results;
        };
        return { lintInMainThread, mainThreadFiles };
    };

    it("returns the same results in the same order as the main thread", async () => {
        const { lintInMainThread } = await createMainThreadLinter();
        const expected = await lintInMainThread(filePathList);
        const actual = await lintFilesInWorkers({
            filePathList,
            workerCount: 2,
            workerData: { configSource, lintOptions },
            lintInMainThread,
        });
        assert.deepStrictEqual(actual, expected);
        assert.strictEqual(actual.filter((result) => result.messages.length > 0).length, 17);
    });

    it("lints all files in the main thread if workers fail to load the config", async () => {
        const { lintInMainThread, mainThreadFiles } = await createMainThreadLinter();
        const expected = await lintInMainThread(filePathList);
        mainThreadFiles.length = 0;
        const actual = await lintFilesInWorkers({
            filePathList,
            workerCount: 2,
            workerData: {
                configSource: { type: "file", cwd: tmpDir, configFilePath: path.join(tmpDir, "not-found.json") },
                lintOptions,
            },
            lintInMainThread,
        });
        assert.deepStrictEqual(actual, expected);
        assert.deepStrictEqual([...mainThreadFiles].sort(), [...filePathList].sort());
    });

    it("lints all files in the main thread if worker data can not be cloned", async () => {
        const { lintInMainThread, mainThreadFiles } = await createMainThreadLinter();
        const expected = await lintInMainThread(filePathList);
        mainThreadFiles.length = 0;
        const actual = await lintFilesInWorkers({
            filePathList,
            workerCount: 2,
            workerData: {
                configSource: {
                    type: "json",
                    // a function can not be sent to a worker
                    configFileJSON: { rules: [{ id: "example", options: { fn: () => {} } }] } as never,
                },
                lintOptions,
            },
            lintInMainThread,
        });
        assert.deepStrictEqual(actual, expected);
        assert.deepStrictEqual([...mainThreadFiles].sort(), [...filePathList].sort());
    });

    it("rejects if the main thread fails to lint", async () => {
        await assert.rejects(
            lintFilesInWorkers({
                filePathList,
                workerCount: 2,
                workerData: { configSource, lintOptions },
                lintInMainThread: async () => {
                    throw new Error("main thread error");
                },
            }),
            /main thread error/,
        );
    });

    describe("isPlainJSONValue", () => {
        it("returns true for JSON values", () => {
            assert.ok(isPlainJSONValue({ rules: [{ id: "a", options: { allows: ["x"], n: 1, b: true, z: null } }] }));
            assert.ok(isPlainJSONValue(Object.create(null)));
        });
        it("returns false for values that structured clone changes", () => {
            class Matcher {}
            assert.ok(!isPlainJSONValue({ options: { matcher: new Matcher() } }));
            assert.ok(!isPlainJSONValue({ options: { fn: () => {} } }));
            assert.ok(!isPlainJSONValue({ options: { re: /a/ } }));
            assert.ok(!isPlainJSONValue({ options: { u: undefined } }));
            assert.ok(!isPlainJSONValue([new Date()]));
        });
    });

    describe("getWorkerCount", () => {
        afterEach(() => {
            clearHooks();
            secretLintProfiler.setEnabled(false);
        });
        it("returns 0 for a few files", () => {
            assert.strictEqual(getWorkerCount(10), 0);
        });
        it("returns workers for many files if the CPU has multiple cores", () => {
            const expected = os.availableParallelism() > 1 ? 1 : 0;
            assert.ok(getWorkerCount(100_000) >= expected);
            assert.ok(getWorkerCount(100_000) <= os.availableParallelism() - 1 || getWorkerCount(100_000) === 0);
        });
        it("returns 0 if resolver hooks are registered", () => {
            registerResolveHook(() => undefined);
            assert.strictEqual(getWorkerCount(100_000), 0);
        });
        it("returns 0 if the profiler is enabled", () => {
            secretLintProfiler.setEnabled(true);
            assert.strictEqual(getWorkerCount(100_000), 0);
        });
    });
});
