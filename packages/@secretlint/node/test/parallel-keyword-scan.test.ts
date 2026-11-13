import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { getKeywordScanPlan } from "@secretlint/core";
import { loadPackagesFromConfigDescriptor } from "@secretlint/config-loader";
import { createEngine } from "../src/index.js";
import {
    createSharedScanState,
    type FileKeywordScans,
    FileScanState,
    getFileScanStates,
    scanFilesForKeywords,
} from "../src/keyword-scan-files.js";
import { scanKeywordsInParallel } from "../src/parallel-keyword-scan.js";

const configFileJSON = { rules: [{ id: "@secretlint/secretlint-rule-example" }] };
const FILE_COUNT = 200;
/**
 * Create files: every 10th file has the keyword of the example rule
 */
const createFiles = (): { dir: string; filePathList: string[]; secretIndexes: number[] } => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-parallel-"));
    const filePathList: string[] = [];
    const secretIndexes: number[] = [];
    for (let i = 0; i < FILE_COUNT; i++) {
        const filePath = path.join(dir, `file-${i}.txt`);
        const hasSecret = i % 10 === 0;
        fs.writeFileSync(filePath, hasSecret ? `line\nTHIS IS SECRET ${i}\n` : `nothing ${i}\n`);
        filePathList.push(filePath);
        if (hasSecret) {
            secretIndexes.push(i);
        }
    }
    return { dir, filePathList, secretIndexes };
};
const loadPlan = async () => {
    const { config } = await loadPackagesFromConfigDescriptor({ configDescriptor: configFileJSON });
    const plan = getKeywordScanPlan({ config });
    assert.ok(plan);
    return plan;
};

describe("parallel keyword scan", () => {
    let files: ReturnType<typeof createFiles>;
    beforeEach(() => {
        files = createFiles();
    });
    afterEach(() => {
        fs.rmSync(files.dir, { recursive: true, force: true });
        delete process.env.SECRETLINT_KEYWORD_SCAN_THREADS;
    });
    it("should find the files that have a keyword", async () => {
        const plan = await loadPlan();
        const shared = createSharedScanState(files.filePathList.length);
        const missingIndex = 5;
        const filePathList = files.filePathList.map((filePath, index) => {
            return index === missingIndex ? path.join(files.dir, "not-found.txt") : filePath;
        });
        const result = scanFilesForKeywords({ plan, filePathList, shared });
        assert.deepStrictEqual(result.fileIndexes, files.secretIndexes);
        const states = getFileScanStates(shared);
        states.forEach((state, index) => {
            const expected =
                index === missingIndex
                    ? FileScanState.NotScanned
                    : files.secretIndexes.includes(index)
                      ? FileScanState.HasKeyword
                      : FileScanState.NoKeyword;
            assert.strictEqual(state, expected, `state of file ${index}`);
        });
        assert.strictEqual(result.scans[0]?.byteLength, fs.statSync(files.filePathList[0] as string).size);
    });
    it("should scan files in the worker thread", async () => {
        const plan = await loadPlan();
        const shared = createSharedScanState(files.filePathList.length);
        // The test runs the source, so use the worker of the build
        const worker = new Worker(new URL("../module/keyword-scan-worker.js", import.meta.url), {
            workerData: { plan, filePathList: files.filePathList, shared },
        });
        const result = await new Promise<FileKeywordScans>((resolve, reject) => {
            worker.once("message", resolve);
            worker.once("error", reject);
        });
        await worker.terminate();
        assert.deepStrictEqual(result.fileIndexes, files.secretIndexes);
        assert.strictEqual(result.scans[0]?.scan.planId, plan.id);
        assert.strictEqual(
            getFileScanStates(shared).filter((state) => state === FileScanState.NoKeyword).length,
            FILE_COUNT - files.secretIndexes.length,
        );
    });
    it("should scan all files even if the workers fail", async () => {
        const plan = await loadPlan();
        // The test runs the source, and the source has no file of the worker: the workers fail to start
        const result = await scanKeywordsInParallel({ plan, filePathList: files.filePathList, threads: 3 });
        assert.deepStrictEqual([...result.scans.keys()], files.secretIndexes);
        assert.ok(result.states.every((state) => state !== FileScanState.NotScanned));
    });
    it("should output the same results as the lint without the parallel scan", async () => {
        const execute = async (threads: number) => {
            process.env.SECRETLINT_KEYWORD_SCAN_THREADS = String(threads);
            const engine = await createEngine({ color: false, configFileJSON, formatter: "json", maskSecrets: false });
            return engine.executeOnFiles({ filePathList: [...files.filePathList, path.join(files.dir, "none.bin")] });
        };
        fs.writeFileSync(path.join(files.dir, "none.bin"), "THIS IS SECRET");
        const serial = await execute(1);
        const parallel = await execute(3);
        assert.strictEqual(parallel.ok, false);
        assert.deepStrictEqual(JSON.parse(parallel.output), JSON.parse(serial.output));
        const withMessages = JSON.parse(parallel.output).filter((result: { messages: unknown[] }) => {
            return result.messages.length > 0;
        });
        // The rule also checks the binary file. Its content type is not text, so it does not use the scan
        assert.strictEqual(withMessages.length, files.secretIndexes.length + 1);
    });
});
