/**
 * Worker threads that read files and scan them for the keywords of the rules, while the main thread lints.
 *
 * The lint of a file has two parts: narrow down (read the file and scan it for the keywords), and run the rules.
 * Most of the time goes to the first part, and it needs no rule. So worker threads without rules do the first part,
 * and hand the bytes and the result of the scan of a file to the main thread only if a rule runs for it.
 * The main thread loads the rules once, and runs them as before.
 *
 * The number of the workers is decided while linting, from the time that the lint takes.
 */
import os from "node:os";
import { Worker } from "node:worker_threads";
import type { KeywordScanLineTests, KeywordScanPlan } from "@secretlint/core/keyword-scan";
import {
    createSharedScanBuffer,
    type HandedFiles,
    openSharedScanState,
    type SharedScanState,
    type WorkerData,
    type WorkerMessage,
} from "./keyword-scan-files.js";
import debug0 from "debug";

const debug = debug0("@secretlint/node");
/**
 * The time to start a worker thread, in milliseconds. It is a measured value on a 4 vCPU machine: 70-100ms.
 * A worker is started only if the rest of the files take longer than this.
 */
const WORKER_START_COST = 100;
/**
 * The main thread lints alone for this time twice, in milliseconds, and then estimates the rest of the files
 * from the second time. The first time is not used: the lint is slow until the runtime has optimized it.
 */
const ESTIMATE_INTERVAL = 20;
/**
 * A worker waits while the main thread has more bytes than this to lint, so the memory has a limit
 */
const PENDING_BYTES_LIMIT = 256 * 1024 * 1024;

/**
 * The max number of the threads, including the main thread.
 * `SECRETLINT_KEYWORD_SCAN_THREADS` overrides it. It is for the measurement of this proof of concept.
 */
export const getMaxKeywordScanThreads = (): number => {
    const specified = Number(process.env.SECRETLINT_KEYWORD_SCAN_THREADS);
    if (Number.isInteger(specified) && specified >= 1) {
        return specified;
    }
    return os.availableParallelism();
};
/**
 * The number of the workers to start, from the time that the main thread has taken.
 * It does not use the number of the files: the time depends on the size of the files and the speed of the disk.
 */
export const estimateWorkerCount = ({
    elapsed,
    claimedCount,
    restCount,
    maxThreads,
}: {
    /**
     * The time that the main thread took for `claimedCount` files, in milliseconds
     */
    elapsed: number;
    claimedCount: number;
    /**
     * The number of the files that no thread has claimed
     */
    restCount: number;
    maxThreads: number;
}): number => {
    if (claimedCount === 0) {
        return 0;
    }
    const restTime = (elapsed / claimedCount) * restCount;
    // Each worker should have work for longer than its start-up time
    return Math.max(0, Math.min(maxThreads - 1, Math.floor(restTime / WORKER_START_COST)));
};

export type KeywordScanWorkers = {
    readonly state: SharedScanState;
    /**
     * Call it each time before the main thread claims files. It starts the workers once, when they are worth it
     */
    startWorkersIfWorth(): void;
    /**
     * The batches that the workers handed and the main thread has not taken
     */
    takeBatches(): HandedFiles[];
    /**
     * true while a worker may hand more files
     */
    isRunning(): boolean;
    /**
     * Wait until a worker hands files or ends
     */
    waitForMessage(): Promise<void>;
    /**
     * What each worker did, for the profile. A failed worker is not in it
     */
    readonly threads: { name: string; scannedCount: number; duration: number; lineTests: KeywordScanLineTests[] }[];
    /**
     * Stop all workers, and wait until they stopped. Call it when the lint ends or fails,
     * because a worker that waits for the main thread keeps the process alive
     */
    terminate(): Promise<void>;
};

export const createKeywordScanWorkers = ({
    plan,
    filePathList,
    maxThreads,
    profile,
}: {
    plan: KeywordScanPlan;
    filePathList: readonly string[];
    maxThreads: number;
    profile: boolean;
}): KeywordScanWorkers => {
    const shared = createSharedScanBuffer(filePathList.length);
    const state = openSharedScanState(shared, filePathList.length);
    const workerData: WorkerData = { plan, filePathList, shared, pendingBytesLimit: PENDING_BYTES_LIMIT, profile };
    const startedWorkers: Worker[] = [];
    const threads: KeywordScanWorkers["threads"] = [];
    let batches: HandedFiles[] = [];
    let runningCount = 0;
    let started = false;
    let wake: (() => void) | undefined;
    const notify = () => {
        wake?.();
        wake = undefined;
    };
    const startWorker = (name: string) => {
        runningCount++;
        let ended = false;
        // A failed worker only ends: the main thread lints the files that the worker did not hand
        const end = () => {
            if (!ended) {
                ended = true;
                runningCount--;
                notify();
            }
        };
        try {
            // A bundle needs the worker as a file next to the bundle. The single-executable binary has it as an entry.
            // Without the file the worker fails to start, and the main thread lints all files
            const worker = new Worker(new URL("./keyword-scan-worker.js", import.meta.url), { workerData });
            startedWorkers.push(worker);
            worker.on("message", (message: WorkerMessage) => {
                if (message.type === "files") {
                    batches.push(message.batch);
                    notify();
                    return;
                }
                threads.push({
                    name,
                    scannedCount: message.scannedCount,
                    duration: message.duration,
                    lineTests: message.lineTests,
                });
                end();
                void worker.terminate();
            });
            worker.once("error", (error) => {
                debug("keyword scan worker error: %o", error);
                end();
            });
            worker.once("exit", end);
        } catch (error) {
            debug("keyword scan worker can not start: %o", error);
            end();
        }
    };
    let sampleTime = performance.now();
    let sampleCount = -1;
    return {
        state,
        threads,
        startWorkersIfWorth() {
            if (started || maxThreads <= 1) {
                return;
            }
            const now = performance.now();
            const elapsed = now - sampleTime;
            if (elapsed < ESTIMATE_INTERVAL) {
                return;
            }
            const claimedCount = state.claimedCount();
            if (sampleCount === -1) {
                sampleTime = now;
                sampleCount = claimedCount;
                return;
            }
            started = true;
            const workerCount = estimateWorkerCount({
                elapsed,
                claimedCount: claimedCount - sampleCount,
                restCount: filePathList.length - claimedCount,
                maxThreads,
            });
            debug("keyword scan workers: %d (%dms for %d files)", workerCount, elapsed, claimedCount - sampleCount);
            for (let i = 1; i <= workerCount; i++) {
                startWorker(`worker ${i}`);
            }
        },
        takeBatches() {
            const taken = batches;
            batches = [];
            return taken;
        },
        isRunning: () => runningCount > 0,
        waitForMessage() {
            if (batches.length > 0 || runningCount === 0) {
                return Promise.resolve();
            }
            return new Promise<void>((resolve) => {
                wake = resolve;
            });
        },
        async terminate() {
            // terminate() of a worker that ended is a no-op
            await Promise.allSettled(startedWorkers.map((worker) => worker.terminate()));
        },
    };
};
