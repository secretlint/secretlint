/**
 * Scan the files for the keywords of the rules on several threads, before the lint.
 *
 * The lint of a file has two steps: scan the content for the keywords, and run the rules that the keywords select.
 * Most of the time goes to the first step, and it needs no rule. So worker threads without rules do the first step,
 * and the main thread does the second step with the rules as before.
 *
 * The result is the same as the lint without it:
 *
 * - Only the rules on the main thread create messages, from the content that the main thread reads.
 * - A file is skipped only if a thread read it and found no keyword, and no rule runs without a keyword.
 * - The scan of a file is used only if the main thread reads the same size of content.
 * - If a thread fails, its files are linted as before.
 *
 * The number of the threads is decided while scanning, from the time that the scan takes.
 */
import os from "node:os";
import { Worker } from "node:worker_threads";
import type { KeywordScanPlan } from "@secretlint/core/keyword-scan";
import {
    createSharedScanState,
    type FileKeywordScan,
    type FileKeywordScans,
    getFileScanStates,
    scanFilesForKeywords,
} from "./keyword-scan-files.js";
import debug0 from "debug";

const debug = debug0("@secretlint/node");
/**
 * The time to start a worker thread, in milliseconds. It is a measured value on a 4 vCPU machine: 70-100ms.
 * A worker is started only if the rest of the scan takes longer than this.
 */
const WORKER_START_COST = 100;
/**
 * The main thread scans alone for this time twice, in milliseconds, and then estimates the rest of the scan
 * from the second time. The first time is not used: the scan is slow until the runtime has optimized it.
 */
const ESTIMATE_INTERVAL = 20;

export type ParallelKeywordScan = {
    /**
     * `states[i]` is `FileScanState` of `filePathList[i]`
     */
    states: Uint8Array;
    /**
     * The index of the file to the scan of the file. It has only the files that have a keyword
     */
    scans: Map<number, FileKeywordScan>;
    /**
     * What each thread did, for the profile. The first is the main thread. A failed worker is not in it
     */
    threads: { name: string; scannedCount: number; duration: number }[];
};
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

const startWorker = (workerData: unknown): Promise<FileKeywordScans | undefined> => {
    return new Promise<FileKeywordScans | undefined>((resolve) => {
        // A failed worker resolves with undefined: the files that it claimed are linted without the scan
        try {
            // A bundle needs the worker as a file next to the bundle. The single-executable binary has it as an entry.
            // Without the file the worker fails to start, and the files are linted without it
            const worker = new Worker(new URL("./keyword-scan-worker.js", import.meta.url), { workerData });
            worker.once("message", (result: FileKeywordScans) => {
                resolve(result);
                void worker.terminate();
            });
            worker.once("error", (error) => {
                debug("keyword scan worker error: %o", error);
                resolve(undefined);
            });
            worker.once("exit", () => resolve(undefined));
        } catch (error) {
            debug("keyword scan worker can not start: %o", error);
            resolve(undefined);
        }
    });
};

export const scanKeywordsInParallel = async ({
    plan,
    filePathList,
    maxThreads,
}: {
    plan: KeywordScanPlan;
    filePathList: readonly string[];
    maxThreads: number;
}): Promise<ParallelKeywordScan> => {
    const shared = createSharedScanState(filePathList.length);
    const workerData = { plan, filePathList, shared };
    let workerResults: Promise<FileKeywordScans | undefined>[] | undefined;
    let sampleTime = performance.now();
    let sampleCount = -1;
    // The main thread starts the scan alone. The threads claim files from the same list,
    // so workers can join later: start them once, when the time so far tells that the rest is worth it
    const mainResult = scanFilesForKeywords({
        ...workerData,
        onClaim: (claimedCount) => {
            if (workerResults !== undefined) {
                return;
            }
            const now = performance.now();
            const elapsed = now - sampleTime;
            if (elapsed < ESTIMATE_INTERVAL) {
                return;
            }
            if (sampleCount === -1) {
                sampleTime = now;
                sampleCount = claimedCount;
                return;
            }
            const workerCount = estimateWorkerCount({
                elapsed,
                claimedCount: claimedCount - sampleCount,
                restCount: filePathList.length - claimedCount,
                maxThreads,
            });
            debug("keyword scan workers: %d (%dms for %d files)", workerCount, elapsed, claimedCount - sampleCount);
            workerResults = Array.from({ length: workerCount }, () => startWorker(workerData));
        },
    });
    const results = [mainResult, ...(await Promise.all(workerResults ?? []))];
    const scans = new Map<number, FileKeywordScan>();
    const threads: ParallelKeywordScan["threads"] = [];
    for (const [index, result] of results.entries()) {
        if (result === undefined) {
            continue;
        }
        threads.push({
            name: index === 0 ? "main" : `worker ${index}`,
            scannedCount: result.scannedCount,
            duration: result.duration,
        });
        for (let i = 0; i < result.fileIndexes.length; i++) {
            scans.set(result.fileIndexes[i] as number, result.scans[i] as FileKeywordScan);
        }
    }
    return { states: getFileScanStates(shared), scans, threads };
};
