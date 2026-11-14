/**
 * The work of a worker thread: read files, detect the content type, and scan them for the keywords of the rules.
 *
 * It does not import rules or config: a worker needs only the keyword scan of `@secretlint/core`.
 * The main thread and the workers share the list of the files and a SharedArrayBuffer,
 * and each thread claims the next files until no file is left.
 * So a thread that starts late, or that fails, only handles fewer files.
 *
 * A worker also checks the lines that have a keyword, with the regular expressions that the plan has as data.
 * It hands the bytes of a file to the main thread only if a rule runs for the file,
 * so the main thread does not read that file again.
 */
import fs from "node:fs";
import {
    createKeywordScanner,
    type KeywordScanLineTests,
    type KeywordScanPlan,
    type KeywordScanResult,
} from "@secretlint/core/keyword-scan";
import { detectContentType } from "@secretlint/source-creator";

/**
 * The state of a file in the shared buffer
 */
export const FileScanState = {
    /**
     * No worker handled the file, or a worker could not read it. The main thread lints the file by itself
     */
    NotScanned: 0,
    /**
     * A worker read the file, and no rule runs for it: the result has no messages
     */
    NoMessages: 1,
    /**
     * A worker hands the bytes of the file to the main thread
     */
    Handed: 2,
} as const;
/**
 * The number of the files that a thread claims at once
 */
export const CLAIM_SIZE = 32;
const INITIAL_BUFFER_SIZE = 64 * 1024;
const INITIAL_BATCH_SIZE = 256 * 1024;
/**
 * The layout of the shared buffer: Int32 values, and then one byte of state for each file
 */
const NEXT_INDEX = 0;
const PENDING_BYTES = 1;
const HEADER_SIZE = 8;

export type SharedScanState = {
    /**
     * Claim the next files. It returns the index of the first file, which is not less than the number of the files
     * if no file is left
     */
    claim(): number;
    /**
     * The number of the files that the threads claimed
     */
    claimedCount(): number;
    readonly states: Uint8Array;
    /**
     * The bytes that the workers handed and the main thread has not linted yet
     */
    addPendingBytes(bytes: number): void;
    /**
     * Wait while the pending bytes are more than the limit. Only a worker thread can wait
     */
    waitForPendingBytes(limit: number): void;
};
export const createSharedScanBuffer = (fileCount: number): SharedArrayBuffer => {
    return new SharedArrayBuffer(HEADER_SIZE + fileCount);
};
export const openSharedScanState = (shared: SharedArrayBuffer, fileCount: number): SharedScanState => {
    const header = new Int32Array(shared, 0, HEADER_SIZE / 4);
    return {
        claim: () => Atomics.add(header, NEXT_INDEX, CLAIM_SIZE),
        claimedCount: () => Math.min(Atomics.load(header, NEXT_INDEX), fileCount),
        states: new Uint8Array(shared, HEADER_SIZE),
        addPendingBytes(bytes) {
            Atomics.add(header, PENDING_BYTES, bytes);
            Atomics.notify(header, PENDING_BYTES);
        },
        waitForPendingBytes(limit) {
            while (true) {
                const pending = Atomics.load(header, PENDING_BYTES);
                if (pending <= limit) {
                    return;
                }
                // The timeout is for a main thread that stops reading: the worker checks again
                Atomics.wait(header, PENDING_BYTES, pending, 1000);
            }
        },
    };
};

/**
 * The files of one claim that a worker hands to the main thread
 */
export type HandedFiles = {
    /**
     * The bytes of all files of the batch, one after another
     */
    bytes: ArrayBuffer;
    files: {
        fileIndex: number;
        /**
         * Where the file is in `bytes`
         */
        offset: number;
        byteLength: number;
        /**
         * The content type that the worker detected from the name and the bytes of the file
         */
        contentType: "text" | "binary" | "unknown";
        /**
         * The result of the keyword scan for the text content type.
         * undefined if the file has no keyword, or if the file is not text
         */
        keywordScanResult: KeywordScanResult | undefined;
    }[];
};
export type WorkerMessage =
    | { type: "files"; batch: HandedFiles }
    | {
          type: "done";
          /**
           * The number of the files that the worker read
           */
          scannedCount: number;
          /**
           * The time that the worker took, in milliseconds
           */
          duration: number;
          /**
           * The tests of lines for each pattern. It is empty without the profile
           */
          lineTests: KeywordScanLineTests[];
      };
export type WorkerData = {
    plan: KeywordScanPlan;
    filePathList: readonly string[];
    shared: SharedArrayBuffer;
    /**
     * A worker waits while the main thread has more bytes than this to lint
     */
    pendingBytesLimit: number;
    /**
     * true if the worker measures the tests of lines for the profile
     */
    profile: boolean;
};

export const scanFilesInWorker = (
    { plan, filePathList, shared, pendingBytesLimit, profile }: WorkerData,
    post: (message: WorkerMessage, transfer: ArrayBuffer[]) => void,
): void => {
    const startTime = performance.now();
    const scanner = createKeywordScanner(plan, { profile });
    const state = openSharedScanState(shared, filePathList.length);
    let scannedCount = 0;
    let buffer = Buffer.allocUnsafe(INITIAL_BUFFER_SIZE);
    // Read the file into the buffer, and return the size of the content
    const readFile = (filePath: string): number => {
        const fd = fs.openSync(filePath, "r");
        try {
            const size = fs.fstatSync(fd).size;
            let length = 0;
            while (true) {
                if (length === buffer.length) {
                    const grown = Buffer.allocUnsafe(buffer.length * 2);
                    buffer.copy(grown, 0, 0, length);
                    buffer = grown;
                }
                // Only a read of 0 bytes is the end of the file. See createFileSourceReader() of source-creator
                const bytesRead = fs.readSync(fd, buffer, length, buffer.length - length, null);
                if (bytesRead === 0) {
                    break;
                }
                length += bytesRead;
                if (length === size) {
                    break;
                }
            }
            return length;
        } finally {
            fs.closeSync(fd);
        }
    };
    while (true) {
        state.waitForPendingBytes(pendingBytesLimit);
        const start = state.claim();
        if (start >= filePathList.length) {
            post(
                {
                    type: "done",
                    scannedCount,
                    duration: performance.now() - startTime,
                    lineTests: scanner.lineTests(),
                },
                [],
            );
            return;
        }
        const end = Math.min(start + CLAIM_SIZE, filePathList.length);
        // The batch has its own memory, because it is moved to the main thread
        let batchBytes = new Uint8Array(new ArrayBuffer(INITIAL_BATCH_SIZE));
        let batchLength = 0;
        const files: HandedFiles["files"] = [];
        const transfer: ArrayBuffer[] = [];
        for (let fileIndex = start; fileIndex < end; fileIndex++) {
            const filePath = filePathList[fileIndex] as string;
            let byteLength: number;
            try {
                byteLength = readFile(filePath);
            } catch {
                // The state stays NotScanned: the main thread reads the file and reports the error
                continue;
            }
            scannedCount++;
            const contentType = detectContentType(filePath, buffer.subarray(0, byteLength));
            // The plan is for the text content type
            const scan = contentType === "text" ? scanner.scan(buffer.subarray(0, byteLength)) : undefined;
            const hasKeyword = scan !== undefined && scan.hasKeyword;
            if (scan !== undefined && !scan.runsRules && plan.requiresKeyword) {
                // No rule runs for the file
                state.states[fileIndex] = FileScanState.NoMessages;
                continue;
            }
            if (batchLength + byteLength > batchBytes.length) {
                const grown = new Uint8Array(
                    new ArrayBuffer(Math.max(batchBytes.length * 2, batchLength + byteLength)),
                );
                grown.set(batchBytes.subarray(0, batchLength));
                batchBytes = grown;
            }
            batchBytes.set(buffer.subarray(0, byteLength), batchLength);
            // A file without keywords has no result: the main thread knows what the result is
            const keywordScanResult = hasKeyword ? scan : undefined;
            files.push({ fileIndex, offset: batchLength, byteLength, keywordScanResult, contentType });
            batchLength += byteLength;
            state.states[fileIndex] = FileScanState.Handed;
        }
        if (files.length > 0) {
            const bytes = batchBytes.buffer as ArrayBuffer;
            // Count the memory that is moved, which can be more than the bytes of the files.
            // The main thread subtracts the same number after it lints the batch
            state.addPendingBytes(bytes.byteLength);
            transfer.push(bytes);
            post({ type: "files", batch: { bytes, files } }, transfer);
        }
    }
};
