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
// More than the memory of the batches of all files, because the test does not lint the batches
const PENDING_BYTES_LIMIT = 64 * 1024 * 1024;
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
        options: { requiresKeyword: boolean; filePathList?: string[]; profile?: boolean },
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
                profile: options.profile ?? false,
            },
            (message) => messages.push(message),
        );
        const batches = messages.flatMap((message) => (message.type === "files" ? [message.batch] : []));
        const handed = batches.flatMap((batch) => batch.files.map((file) => ({ batch, file })));
        return {
            messages,
            batches,
            handed,
            states: openSharedScanState(shared, filePathList.length).states,
            // The second Int32 value of the shared buffer
            pendingBytes: new Int32Array(shared, 0, 2)[1],
        };
    };
    it("should hand only the files that have a keyword, with the bytes and the result of the scan", async () => {
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
            assert.strictEqual(file.contentType, "text");
            assert.strictEqual(file.keywordScanResult?.runsRules, true);
            assert.strictEqual(file.keywordScanResult?.planId, plan.id);
            assert.strictEqual(file.keywordScanResult?.hasKeyword, true);
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
            lineTests: [],
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
    it("should not hand all files for the pattern rule without patterns, as `secretlint --init` writes it", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [{ id: "@secretlint/secretlint-rule-example" }, { id: "@secretlint/secretlint-rule-pattern" }],
            },
        });
        const plan = getKeywordScanPlan({ config });
        assert.ok(plan);
        assert.strictEqual(plan.requiresKeyword, true);
        const { handed } = scan({ requiresKeyword: plan.requiresKeyword }, plan);
        assert.deepStrictEqual(
            handed.map(({ file }) => file.fileIndex),
            files.secretIndexes,
        );
    });
    it("should hand a file that is not text without the result of the scan", async () => {
        const plan = await loadPlan();
        const binaryFilePath = path.join(files.dir, "secret.png");
        fs.writeFileSync(binaryFilePath, "THIS IS SECRET");
        const { handed } = scan({ requiresKeyword: true, filePathList: [binaryFilePath] }, plan);
        assert.strictEqual(handed.length, 1);
        assert.strictEqual(handed[0]?.file.contentType, "binary");
        assert.strictEqual(handed[0]?.file.keywordScanResult, undefined);
    });
    it("should detect the content type from the bytes if the name does not tell it", async () => {
        const plan = await loadPlan();
        // The names have no known extension
        const textFilePath = path.join(files.dir, "text-without-extension");
        const secretFilePath = path.join(files.dir, "secret-without-extension");
        fs.writeFileSync(textFilePath, "nothing\n");
        fs.writeFileSync(secretFilePath, "THIS IS SECRET\n");
        const { handed, states } = scan({ requiresKeyword: true, filePathList: [textFilePath, secretFilePath] }, plan);
        assert.deepStrictEqual([...states], [FileScanState.NoMessages, FileScanState.Handed]);
        assert.strictEqual(handed.length, 1);
        assert.strictEqual(handed[0]?.file.contentType, "text");
        assert.strictEqual(handed[0]?.file.keywordScanResult?.hasKeyword, true);
    });
    it("should not hand a file that has a keyword on a line that no pattern matches", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: { rules: [{ id: "@secretlint/secretlint-rule-preset-recommend" }] },
        });
        const plan = getKeywordScanPlan({ config });
        assert.ok(plan);
        // "https://" is a keyword of the pattern of basic auth
        const urlFilePath = path.join(files.dir, "url.txt");
        const basicAuthFilePath = path.join(files.dir, "basic-auth.txt");
        fs.writeFileSync(urlFilePath, "see https://example.com/\n");
        fs.writeFileSync(basicAuthFilePath, "see https://example.com/\nhttps://user:password@example.com/\n");
        const { handed, states } = scan(
            { requiresKeyword: true, filePathList: [urlFilePath, basicAuthFilePath] },
            plan,
        );
        assert.deepStrictEqual([...states], [FileScanState.NoMessages, FileScanState.Handed]);
        assert.strictEqual(handed[0]?.file.keywordScanResult?.lineMatched, true);
        // If a rule runs without keywords, the file is handed with the result of the check
        const all = scan({ requiresKeyword: false, filePathList: [urlFilePath] }, plan);
        assert.strictEqual(all.handed[0]?.file.keywordScanResult?.runsRules, false);
        assert.strictEqual(all.handed[0]?.file.keywordScanResult?.lineMatched, false);
    });
    it("should count the memory of the handed batches as the pending bytes", async () => {
        const plan = await loadPlan();
        const { batches, handed, pendingBytes } = scan({ requiresKeyword: false }, plan);
        const movedBytes = batches.reduce((total, batch) => total + batch.bytes.byteLength, 0);
        const fileBytes = handed.reduce((total, { file }) => total + file.byteLength, 0);
        // The main thread subtracts the size of the memory of each batch, so the worker adds the same number
        assert.strictEqual(pendingBytes, movedBytes);
        assert.ok(movedBytes > fileBytes);
    });
    it("should return the tests of lines of the worker with the profile", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: { rules: [{ id: "@secretlint/secretlint-rule-preset-recommend" }] },
        });
        const plan = getKeywordScanPlan({ config });
        assert.ok(plan);
        const urlFilePath = path.join(files.dir, "url.txt");
        fs.writeFileSync(urlFilePath, "see https://example.com/\n");
        const lineTestsOf = (profile: boolean) => {
            const done = scan({ requiresKeyword: true, filePathList: [urlFilePath], profile }, plan).messages.at(-1);
            return done?.type === "done" ? done.lineTests : undefined;
        };
        assert.deepStrictEqual(lineTestsOf(false), []);
        const lineTests = lineTestsOf(true);
        assert.ok(lineTests && lineTests.length > 0);
        assert.ok(lineTests.every((lineTest) => lineTest.count === 1 && lineTest.profileId.includes("#")));
    });
    it("should stop a worker that waits for the main thread", async () => {
        const plan = await loadPlan();
        const workers = createKeywordScanWorkers({
            plan,
            filePathList: files.filePathList,
            maxThreads: 2,
            profile: false,
        });
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        // The worker waits while the main thread has too many bytes to lint
        workers.state.addPendingBytes(2 ** 30);
        // Take two samples of the time, as the lint does, so that a worker is worth it
        await wait(25);
        workers.startWorkersIfWorth();
        workers.state.claim();
        await wait(25);
        workers.startWorkersIfWorth();
        assert.strictEqual(workers.isRunning(), true);
        await workers.terminate();
        await wait(0);
        assert.strictEqual(workers.isRunning(), false);
        assert.deepStrictEqual(workers.takeBatches(), []);
    });
    it("should scan files in the worker thread", async () => {
        const plan = await loadPlan();
        const shared = createSharedScanBuffer(files.filePathList.length);
        // The test runs the source, so use the worker of the build
        const worker = new Worker(new URL("../module/keyword-scan-worker.js", import.meta.url), {
            workerData: {
                plan,
                filePathList: files.filePathList,
                shared,
                pendingBytesLimit: PENDING_BYTES_LIMIT,
                profile: false,
            },
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
        const workers = createKeywordScanWorkers({
            plan,
            filePathList: files.filePathList,
            maxThreads: 4,
            profile: false,
        });
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
