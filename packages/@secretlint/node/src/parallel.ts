/**
 * Lint files in worker threads.
 *
 * Linting is CPU bound (regular expressions over the file content), so a single thread can not use the other CPU cores.
 * The files are split into small batches in a queue.
 * The main thread and the workers take a batch from the queue until the queue is empty,
 * so a thread that gets large files does not make the others wait.
 * The main thread starts linting at once, because a worker takes time to start and to load the rules.
 *
 * Workers are an optimization, not a requirement.
 * If a worker fails for any reason (config loading, a rule error, a result that can not be cloned, a crash),
 * no more batches are sent to workers and the main thread lints the rest of the files.
 * So the results and the errors are the same as linting in the main thread.
 */
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import type { SecretLintCoreResult } from "@secretlint/types";
import { hasHooks } from "@secretlint/resolver";
import { secretLintProfiler } from "@secretlint/profiler";
import debug0 from "debug";
import type { ConfigSource, LintFileOptions } from "./lint-file.js";

const debug = debug0("@secretlint/node:parallel");

export type WorkerData = {
    configSource: ConfigSource;
    lintOptions: LintFileOptions;
};
export type WorkerRequest = {
    batchId: number;
    filePathList: string[];
};
export type WorkerResponse =
    | {
          type: "result";
          batchId: number;
          results: SecretLintCoreResult[];
      }
    | {
          type: "error";
          batchId: number;
          message: string;
      };

/**
 * A worker costs the time to start and to load the config and the rules (about 100-250ms).
 * Add a worker for each this number of files.
 * With fewer files, the main thread finishes linting before the workers are ready.
 */
const FILES_PER_WORKER = 2500;
/**
 * Each worker loads its own copy of the rules, so limit the number of workers.
 * More threads compete for memory bandwidth, and the speedup is small after a few workers.
 */
const MAX_WORKERS = 4;
const MAX_BATCH_SIZE = 32;
/**
 * Keep this number of batches in flight for each worker,
 * so a worker does not wait for the main thread between batches.
 */
const IN_FLIGHT_BATCHES = 2;

const workerURL = new URL("./worker.js", import.meta.url);

/**
 * Return the number of workers to lint the files, or 0 if the main thread lints all files.
 */
export const getWorkerCount = (fileCount: number): number => {
    // Bun binary and custom loaders register resolver hooks, but hooks are per-thread
    if (hasHooks()) {
        debug("Use main thread: resolver hooks are registered");
        return 0;
    }
    if (process.versions.bun !== undefined) {
        debug("Use main thread: Bun");
        return 0;
    }
    // The profiler collects marks in the main thread
    if (secretLintProfiler.isEnabled) {
        debug("Use main thread: profiler is enabled");
        return 0;
    }
    // The main thread lints files too, so it uses one CPU
    const count = Math.min(os.availableParallelism() - 1, MAX_WORKERS, Math.floor(fileCount / FILES_PER_WORKER));
    if (count < 1) {
        debug("Use main thread: %d files", fileCount);
        return 0;
    }
    // The worker file does not exist when running src/ directly. e.g. tests with TypeScript loader
    if (!fs.existsSync(fileURLToPath(workerURL))) {
        debug("Use main thread: worker file is not found: %s", workerURL.href);
        return 0;
    }
    return count;
};

type Batch = {
    start: number;
    end: number;
};

/**
 * Lint files in the main thread and `workerCount` workers.
 * The results are in the same order as `filePathList`.
 */
export const lintFilesInWorkers = async ({
    filePathList,
    workerCount,
    workerData,
    lintInMainThread,
}: {
    filePathList: string[];
    workerCount: number;
    workerData: WorkerData;
    lintInMainThread: (filePathList: string[]) => Promise<SecretLintCoreResult[]>;
}): Promise<SecretLintCoreResult[]> => {
    // Small batches balance the load, and large batches reduce the messages
    const threadCount = workerCount + 1;
    const batchSize = Math.max(1, Math.min(MAX_BATCH_SIZE, Math.ceil(filePathList.length / (threadCount * 8))));
    const batches: Batch[] = [];
    for (let start = 0; start < filePathList.length; start += batchSize) {
        batches.push({ start, end: Math.min(start + batchSize, filePathList.length) });
    }
    debug("Lint %d files in %d workers with batch size %d", filePathList.length, workerCount, batchSize);
    const results: (SecretLintCoreResult | undefined)[] = new Array(filePathList.length);
    const setResults = (batchId: number, batchResults: SecretLintCoreResult[]) => {
        const batch = batches[batchId] as Batch;
        batchResults.forEach((result, index) => {
            results[batch.start + index] = result;
        });
    };
    // The batches that a failed worker could not lint. The main thread lints them.
    const retryBatchIds: number[] = [];
    let nextBatchId = 0;
    let workerFailed = false;
    let runningWorkers = 0;
    // Wake up the main thread that waits for workers
    let notifyMainThread: (() => void) | undefined;
    const notify = () => {
        notifyMainThread?.();
        notifyMainThread = undefined;
    };
    // Terminate all workers when the main thread stops, including when it throws
    const stopWorkers: (() => void)[] = [];
    const startWorker = () => {
        let worker: Worker;
        try {
            worker = new Worker(workerURL, { workerData });
        } catch (error) {
            // e.g. DataCloneError: a rule option in the config is a function
            debug("Fail to start a worker, lint in the main thread: %o", error);
            workerFailed = true;
            return;
        }
        runningWorkers++;
        const inFlightBatchIds = new Set<number>();
        let finished = false;
        const finish = () => {
            if (finished) {
                return;
            }
            finished = true;
            runningWorkers--;
            worker.removeAllListeners();
            // terminate() does not throw, but ignore the error to be safe
            worker.terminate().catch(() => {});
            notify();
        };
        stopWorkers.push(finish);
        const fail = (reason: string) => {
            debug("Worker failed, lint the rest in the main thread: %s", reason);
            workerFailed = true;
            retryBatchIds.push(...inFlightBatchIds);
            inFlightBatchIds.clear();
            finish();
        };
        const sendBatches = () => {
            while (!workerFailed && inFlightBatchIds.size < IN_FLIGHT_BATCHES && nextBatchId < batches.length) {
                const batchId = nextBatchId++;
                const batch = batches[batchId] as Batch;
                inFlightBatchIds.add(batchId);
                worker.postMessage({
                    batchId,
                    filePathList: filePathList.slice(batch.start, batch.end),
                } satisfies WorkerRequest);
            }
            if (inFlightBatchIds.size === 0) {
                finish();
            }
        };
        worker.on("message", (response: WorkerResponse) => {
            if (response.type === "error") {
                fail(response.message);
                return;
            }
            setResults(response.batchId, response.results);
            inFlightBatchIds.delete(response.batchId);
            sendBatches();
        });
        worker.on("error", (error: unknown) => {
            fail(error instanceof Error ? (error.stack ?? error.message) : String(error));
        });
        worker.on("exit", (code) => {
            fail(`worker exited with code ${code}`);
        });
        sendBatches();
    };
    for (let i = 0; i < workerCount && !workerFailed; i++) {
        startWorker();
    }
    // The main thread lints batches too
    const takeBatchId = (): number | undefined => {
        if (retryBatchIds.length > 0) {
            return retryBatchIds.shift();
        }
        if (nextBatchId < batches.length) {
            return nextBatchId++;
        }
        return undefined;
    };
    try {
        while (true) {
            const batchId = takeBatchId();
            if (batchId !== undefined) {
                const batch = batches[batchId] as Batch;
                setResults(batchId, await lintInMainThread(filePathList.slice(batch.start, batch.end)));
                // Let workers receive the next batches
                await new Promise<void>((resolve) => setImmediate(resolve));
                continue;
            }
            if (runningWorkers === 0) {
                break;
            }
            // Wait for workers. A failed worker may return its batches to retry.
            await new Promise<void>((resolve) => {
                notifyMainThread = resolve;
            });
        }
    } finally {
        stopWorkers.forEach((stop) => stop());
    }
    return results as SecretLintCoreResult[];
};
