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
 * A thread is worth its start-up time only for this many files
 */
const FILES_PER_THREAD = 2000;
const MAX_THREADS = 4;

export type ParallelKeywordScan = {
    /**
     * `states[i]` is `FileScanState` of `filePathList[i]`
     */
    states: Uint8Array;
    /**
     * The index of the file to the scan of the file. It has only the files that have a keyword
     */
    scans: Map<number, FileKeywordScan>;
};
/**
 * The number of the threads for the files, including the main thread.
 * `SECRETLINT_KEYWORD_SCAN_THREADS` overrides it. It is for the measurement of this proof of concept.
 */
export const getKeywordScanThreads = (fileCount: number): number => {
    const specified = Number(process.env.SECRETLINT_KEYWORD_SCAN_THREADS);
    if (Number.isInteger(specified) && specified >= 1) {
        return specified;
    }
    // Bun runs worker threads, but the single binary has no file of the worker
    if (process.versions.bun !== undefined) {
        return 1;
    }
    return Math.max(1, Math.min(MAX_THREADS, os.availableParallelism(), Math.floor(fileCount / FILES_PER_THREAD)));
};

export const scanKeywordsInParallel = async ({
    plan,
    filePathList,
    threads,
}: {
    plan: KeywordScanPlan;
    filePathList: readonly string[];
    threads: number;
}): Promise<ParallelKeywordScan> => {
    const shared = createSharedScanState(filePathList.length);
    const workerData = { plan, filePathList, shared };
    const workerResults = Array.from({ length: threads - 1 }, () => {
        return new Promise<FileKeywordScans | undefined>((resolve) => {
            // A failed worker resolves with undefined: the files that it claimed are linted without the scan
            try {
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
    });
    // The main thread scans too, until no file is left. The workers start while it scans
    const results = [scanFilesForKeywords(workerData), ...(await Promise.all(workerResults))];
    const scans = new Map<number, FileKeywordScan>();
    for (const result of results) {
        if (result === undefined) {
            continue;
        }
        for (let i = 0; i < result.fileIndexes.length; i++) {
            scans.set(result.fileIndexes[i] as number, result.scans[i] as FileKeywordScan);
        }
    }
    return { states: getFileScanStates(shared), scans };
};
