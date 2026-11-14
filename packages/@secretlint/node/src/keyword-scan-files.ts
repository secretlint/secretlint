/**
 * Scan files for the keywords of the rules. The main thread and worker threads run the same function.
 *
 * It does not import rules or config: a worker thread only needs the keyword scan of `@secretlint/core`.
 * The threads share the list of the files and a SharedArrayBuffer, and each thread claims the next files
 * until no file is left. So a thread that starts late, or that fails, only scans fewer files.
 */
import fs from "node:fs";
import { createKeywordScanner, type KeywordScanPlan, type KeywordScanResult } from "@secretlint/core/keyword-scan";

/**
 * The state of a file in the shared buffer
 */
export const FileScanState = {
    /**
     * No thread scanned the file, or the file could not be read
     */
    NotScanned: 0,
    NoKeyword: 1,
    HasKeyword: 2,
} as const;
/**
 * The number of the files that a thread claims at once
 */
const CLAIM_SIZE = 32;
const INITIAL_BUFFER_SIZE = 64 * 1024;

export type FileKeywordScan = {
    /**
     * The result of the keyword scan of the file
     */
    scan: KeywordScanResult;
    /**
     * The size of the content that was scanned
     */
    byteLength: number;
};
export type FileKeywordScans = {
    /**
     * The indexes of the files that have a keyword
     */
    fileIndexes: number[];
    /**
     * `scans[i]` is the scan of the file of `fileIndexes[i]`
     */
    scans: FileKeywordScan[];
};
/**
 * The buffer that the threads share: the index of the next file to claim, then the state of each file
 */
export const createSharedScanState = (fileCount: number): SharedArrayBuffer => {
    return new SharedArrayBuffer(4 + fileCount);
};
export const getFileScanStates = (shared: SharedArrayBuffer): Uint8Array => {
    return new Uint8Array(shared, 4);
};

export const scanFilesForKeywords = ({
    plan,
    filePathList,
    shared,
    onClaim,
}: {
    plan: KeywordScanPlan;
    filePathList: readonly string[];
    shared: SharedArrayBuffer;
    /**
     * It is called before the thread claims the next files, with the number of the files that the threads claimed
     */
    onClaim?: (claimedCount: number) => void;
}): FileKeywordScans => {
    const scanner = createKeywordScanner(plan);
    const nextIndex = new Int32Array(shared, 0, 1);
    const states = getFileScanStates(shared);
    const fileIndexes: number[] = [];
    const scans: FileKeywordScan[] = [];
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
        onClaim?.(Math.min(Atomics.load(nextIndex, 0), filePathList.length));
        const start = Atomics.add(nextIndex, 0, CLAIM_SIZE);
        if (start >= filePathList.length) {
            return { fileIndexes, scans };
        }
        const end = Math.min(start + CLAIM_SIZE, filePathList.length);
        for (let fileIndex = start; fileIndex < end; fileIndex++) {
            let byteLength: number;
            try {
                byteLength = readFile(filePathList[fileIndex] as string);
            } catch {
                // The state stays NotScanned: the lint of the file reads it again and reports the error
                continue;
            }
            const scan = scanner.scan(buffer.subarray(0, byteLength));
            if (scan.hits.count === 0) {
                states[fileIndex] = FileScanState.NoKeyword;
                continue;
            }
            fileIndexes.push(fileIndex);
            scans.push({
                scan: {
                    planId: scan.planId,
                    // Keep only the used part: the hits are kept until the file is linted, and a worker sends them
                    hits: {
                        found: scan.hits.found,
                        positions: scan.hits.positions.slice(0, scan.hits.count * 2),
                        count: scan.hits.count,
                    },
                },
                byteLength,
            });
            states[fileIndex] = FileScanState.HasKeyword;
        }
    }
};
