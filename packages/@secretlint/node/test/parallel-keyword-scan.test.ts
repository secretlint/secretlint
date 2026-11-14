import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { getKeywordScanPlan } from "@secretlint/core";
import { loadPackagesFromConfigDescriptor } from "@secretlint/config-loader";
import { createEngine } from "../src/index.js";
import {
    createSharedScanBuffer,
    FileScanState,
    type HandedFiles,
    openSharedScanState,
    scanFilesInWorker,
    type WorkerMessage,
} from "../src/keyword-scan-files.js";
import { createKeywordScanWorkers, estimateWorkerCount } from "../src/parallel-keyword-scan.js";

const configFileJSON = { rules: [{ id: "@secretlint/secretlint-rule-example" }] };
const FILE_COUNT = 200;
const PENDING_BYTES_LIMIT = 1024 * 1024;
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
const contentOf = (batch: HandedFiles, file: HandedFiles["files"][number]): string => {
    return Buffer.from(batch.bytes, file.offset, file.byteLength).toString();
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
    const scan = (
        options: { requiresKeyword: boolean; filePathList?: string[] },
        plan: Awaited<ReturnType<typeof loadPlan>>,
    ) => {
        const filePathList = options.filePathList ?? files.filePathList;
        const shared = createSharedScanBuffer(filePathList.length);
        const messages: WorkerMessage[] = [];
        scanFilesInWorker(
            {
                plan: { ...plan, requiresKeyword: options.requiresKeyword },
                filePathList,
                shared,
                pendingBytesLimit: Number.MAX_SAFE_INTEGER,
            },
            (message) => messages.push(message),
        );
        const batches = messages.flatMap((message) => (message.type === "files" ? [message.batch] : []));
        const handed = batches.flatMap((batch) => batch.files.map((file) => ({ batch, file })));
        return { messages, handed, states: openSharedScanState(shared, filePathList.length).states };
    };
    it("should hand only the files that have a keyword, with the bytes and the hits", async () => {
        const plan = await loadPlan();
        const missingIndex = 5;
        const filePathList = files.filePathList.map((filePath, index) => {
            return index === missingIndex ? path.join(files.dir, "not-found.txt") : filePath;
        });
        const { messages, handed, states } = scan({ requiresKeyword: true, filePathList }, plan);
        assert.deepStrictEqual(
            handed.map(({ file }) => file.fileIndex),
            files.secretIndexes,
        );
        for (const { batch, file } of handed) {
            assert.strictEqual(contentOf(batch, file), fs.readFileSync(filePathList[file.fileIndex] as string, "utf8"));
            assert.strictEqual(file.isTextByName, true);
            assert.strictEqual(file.keywordScanResult?.planId, plan.id);
            assert.ok((file.keywordScanResult?.hits.count ?? 0) > 0);
        }
        states.forEach((state, index) => {
            const expected =
                index === missingIndex
                    ? FileScanState.NotScanned
                    : files.secretIndexes.includes(index)
                      ? FileScanState.Handed
                      : FileScanState.NoMessages;
            assert.strictEqual(state, expected, `state of file ${index}`);
        });
        assert.deepStrictEqual(messages.at(-1)?.type === "done" ? messages.at(-1) : undefined, {
            type: "done",
            scannedCount: FILE_COUNT - 1,
            duration: (messages.at(-1) as { duration: number }).duration,
        });
    });
    it("should hand all files if a rule runs without keywords", async () => {
        const plan = await loadPlan();
        const { handed, states } = scan({ requiresKeyword: false }, plan);
        assert.strictEqual(handed.length, FILE_COUNT);
        assert.ok(states.every((state) => state === FileScanState.Handed));
        // A file without keywords has no result of the scan: the main thread knows that it has no keyword
        const withoutKeyword = handed.filter(({ file }) => file.keywordScanResult === undefined);
        assert.strictEqual(withoutKeyword.length, FILE_COUNT - files.secretIndexes.length);
    });
    it("should hand a file that is not text by its name without the result of the scan", async () => {
        const plan = await loadPlan();
        const binaryFilePath = path.join(files.dir, "secret.png");
        fs.writeFileSync(binaryFilePath, "THIS IS SECRET");
        const { handed } = scan({ requiresKeyword: true, filePathList: [binaryFilePath] }, plan);
        assert.strictEqual(handed.length, 1);
        assert.strictEqual(handed[0]?.file.isTextByName, false);
        assert.strictEqual(handed[0]?.file.keywordScanResult, undefined);
    });
    it("should scan files in the worker thread", async () => {
        const plan = await loadPlan();
        const shared = createSharedScanBuffer(files.filePathList.length);
        // The test runs the source, so use the worker of the build
        const worker = new Worker(new URL("../module/keyword-scan-worker.js", import.meta.url), {
            workerData: { plan, filePathList: files.filePathList, shared, pendingBytesLimit: PENDING_BYTES_LIMIT },
        });
        const fileIndexes: number[] = [];
        const done = await new Promise<WorkerMessage>((resolve, reject) => {
            worker.on("message", (message: WorkerMessage) => {
                if (message.type === "done") {
                    resolve(message);
                    return;
                }
                fileIndexes.push(...message.batch.files.map((file) => file.fileIndex));
            });
            worker.once("error", reject);
        });
        await worker.terminate();
        assert.deepStrictEqual(fileIndexes, files.secretIndexes);
        assert.strictEqual(done.type === "done" ? done.scannedCount : -1, FILE_COUNT);
    });
    it("should not start a worker for a short lint", async () => {
        const plan = await loadPlan();
        const workers = createKeywordScanWorkers({ plan, filePathList: files.filePathList, maxThreads: 4 });
        workers.startWorkersIfWorth();
        assert.strictEqual(workers.isRunning(), false);
        assert.deepStrictEqual(workers.takeBatches(), []);
        await workers.waitForMessage();
    });
    it("should start workers only if the rest of the files take longer than the start-up of a worker", () => {
        const estimate = (elapsed: number, claimedCount: number, restCount: number, maxThreads = 8) => {
            return estimateWorkerCount({ elapsed, claimedCount, restCount, maxThreads });
        };
        // 20ms for 1,000 files: the rest of 1,000 files takes 20ms
        assert.strictEqual(estimate(20, 1000, 1000), 0);
        // the rest of 9,000 files takes 180ms: a worker
        assert.strictEqual(estimate(20, 1000, 9000), 1);
        // the rest takes 2s: all threads
        assert.strictEqual(estimate(20, 1000, 100000), 7);
        assert.strictEqual(estimate(20, 1000, 100000, 2), 1);
        assert.strictEqual(estimate(20, 1000, 100000, 1), 0);
        // few large files are the same as many small files
        assert.strictEqual(estimate(200, 32, 32), 2);
        assert.strictEqual(estimate(20, 0, 100), 0);
    });
    it("should output the same results with any max number of threads", async () => {
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
        // The rule also checks the binary file
        assert.strictEqual(withMessages.length, files.secretIndexes.length + 1);
    });
});
