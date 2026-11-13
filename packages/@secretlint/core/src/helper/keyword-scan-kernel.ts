/**
 * A faster scan of UTF-8 bytes for the automaton of keyword-matcher.ts, with WebAssembly SIMD.
 *
 * The scan loop of keyword-matcher.ts reads a table for every byte. Most bytes of a file are not a part of a keyword,
 * so the kernel (wasm/keyword-scan.c) first drops them 16 bytes at a time with a filter,
 * and runs the automaton only around the bytes that can be a keyword. See the comment of the C file.
 * The hits are the same as the hits of the scan loop.
 *
 * The kernel is optional: {@link createKeywordScanKernel} returns undefined where WebAssembly or SIMD is not
 * available (an old browser, or a page whose Content Security Policy does not allow `wasm-unsafe-eval`),
 * and the caller uses the scan loop.
 *
 * This module does not depend on Node.js.
 */
import { KEYWORD_SCAN_WASM_BASE64 } from "./keyword-scan-wasm.js";

export type KeywordScanKernelOptions = {
    /** The keywords in lowercase. They are matched ASCII case-insensitively. */
    keywords: readonly string[];
    /** `transitions[state * classCount + charClass[byte]]` is the next state multiplied by `classCount` */
    transitions: Uint16Array;
    charClass: Uint8Array;
    classCount: number;
    /** A state multiplied by `classCount` that is this value or more completes a keyword */
    firstOutputOffset: number;
};

export type KeywordScanKernel = {
    /**
     * Find the keywords in `bytes` from the `start` index.
     * It calls `onHit(state, index)` for each hit in the order of the index, like the scan loop,
     * and returns true. `state` is a state of the automaton that has the same keywords as the state of the scan loop.
     * It returns false without calling `onHit` if the kernel can not scan the input: the caller uses the scan loop.
     */
    scan(bytes: Uint8Array, start: number, onHit: (state: number, index: number) => void): boolean;
};

const FINGERPRINT_LENGTH = 3;
const BUCKET_COUNT = 16;
const PAGE_SIZE = 65536;
/** A larger input is scanned by the scan loop, so the memory of the kernel does not grow without a limit */
const MAX_INPUT_SIZE = 64 * 1024 * 1024;

/**
 * How many byte values a byte of a keyword matches in the filter: a letter matches both cases.
 */
const matchingByteValues = (byte: number): number => (byte >= 0x61 && byte <= 0x7a ? 2 : 1);

/** A fingerprint of a keyword: the bytes of `length` from `offset` of the keyword */
type Fingerprint = { offset: number; bytes: number[]; keywordLength: number };

const chooseFingerprint = (keyword: string): Fingerprint => {
    const bytes = Array.from(keyword, (character) => character.charCodeAt(0));
    if (bytes.length <= FINGERPRINT_LENGTH) {
        // The positions after a short keyword match any byte
        return { offset: 0, bytes, keywordLength: bytes.length };
    }
    // The fingerprint is the part of the keyword that matches the fewest byte sequences, and the first of such parts.
    // It is decided only from the keyword: Secretlint lints any kind of content, so nothing is assumed about
    // which bytes are common in the content.
    let bestOffset = 0;
    let bestScore = Number.POSITIVE_INFINITY;
    for (let offset = 0; offset + FINGERPRINT_LENGTH <= bytes.length; offset++) {
        let score = 1;
        for (let index = 0; index < FINGERPRINT_LENGTH; index++) {
            score *= matchingByteValues(bytes[offset + index] as number);
        }
        if (score < bestScore) {
            bestScore = score;
            bestOffset = offset;
        }
    }
    return {
        offset: bestOffset,
        bytes: bytes.slice(bestOffset, bestOffset + FINGERPRINT_LENGTH),
        keywordLength: bytes.length,
    };
};

/**
 * A bucket is a set of fingerprints. The filter knows only, for each position of the fingerprint,
 * which low 4 bits and which high 4 bits the fingerprints of the bucket have. So a bucket also matches
 * the combinations of them, and a bucket with similar fingerprints drops more bytes.
 */
type Bucket = { low: Set<number>[]; high: Set<number>[]; isEmpty: boolean };

const ALL_NIBBLES = Array.from({ length: 16 }, (_, value) => value);

/** The low and high 4 bits that a byte of a fingerprint matches. A letter matches both cases. */
const nibblesOfPosition = (fingerprint: Fingerprint, index: number): { low: number[]; high: number[] } => {
    const byte = fingerprint.bytes[index];
    if (byte === undefined) {
        return { low: ALL_NIBBLES, high: ALL_NIBBLES };
    }
    const variants = byte >= 0x61 && byte <= 0x7a ? [byte, byte - 0x20] : [byte];
    return {
        low: [...new Set(variants.map((variant) => variant & 15))],
        high: [...new Set(variants.map((variant) => variant >> 4))],
    };
};

const bucketSize = (low: Set<number>[], high: Set<number>[]): number => {
    let size = 1;
    for (let index = 0; index < FINGERPRINT_LENGTH; index++) {
        size *= Math.max(1, (low[index] as Set<number>).size) * Math.max(1, (high[index] as Set<number>).size);
    }
    return size;
};

/**
 * Create the tables of the filter and the distances of the check for the keywords.
 * It is exported for tests.
 */
export const createFilterTables = (
    keywords: readonly string[],
): { masks: Uint8Array; back: number; forward: number } => {
    const fingerprints = keywords.map(chooseFingerprint);
    const uniqueFingerprints = new Map<string, Fingerprint>();
    for (const fingerprint of fingerprints) {
        uniqueFingerprints.set(fingerprint.bytes.join(","), fingerprint);
    }
    const buckets: Bucket[] = Array.from({ length: BUCKET_COUNT }, () => ({
        low: Array.from({ length: FINGERPRINT_LENGTH }, () => new Set<number>()),
        high: Array.from({ length: FINGERPRINT_LENGTH }, () => new Set<number>()),
        isEmpty: true,
    }));
    // Put each fingerprint into the bucket that grows the least
    for (const fingerprint of uniqueFingerprints.values()) {
        let best: { bucket: Bucket; low: Set<number>[]; high: Set<number>[] } | undefined;
        let bestCost = Number.POSITIVE_INFINITY;
        for (const bucket of buckets) {
            const low: Set<number>[] = [];
            const high: Set<number>[] = [];
            for (let index = 0; index < FINGERPRINT_LENGTH; index++) {
                const nibbles = nibblesOfPosition(fingerprint, index);
                low.push(new Set([...(bucket.low[index] as Set<number>), ...nibbles.low]));
                high.push(new Set([...(bucket.high[index] as Set<number>), ...nibbles.high]));
            }
            const cost = bucket.isEmpty
                ? bucketSize(low, high)
                : bucketSize(low, high) - bucketSize(bucket.low, bucket.high);
            if (cost < bestCost) {
                bestCost = cost;
                best = { bucket, low, high };
            }
        }
        if (best !== undefined) {
            best.bucket.low = best.low;
            best.bucket.high = best.high;
            best.bucket.isEmpty = false;
        }
    }
    // The layout of MASKS of wasm/keyword-scan.c: [set][position][low or high][value of the 4 bits]
    const masks = new Uint8Array((BUCKET_COUNT / 8) * FINGERPRINT_LENGTH * 2 * 16);
    buckets.forEach((bucket, bucketIndex) => {
        const setOffset = (bucketIndex >> 3) * FINGERPRINT_LENGTH * 32;
        const bit = 1 << (bucketIndex & 7);
        for (let index = 0; index < FINGERPRINT_LENGTH; index++) {
            for (const value of bucket.low[index] as Set<number>) {
                masks[setOffset + index * 32 + value] = (masks[setOffset + index * 32 + value] as number) | bit;
            }
            for (const value of bucket.high[index] as Set<number>) {
                masks[setOffset + index * 32 + 16 + value] =
                    (masks[setOffset + index * 32 + 16 + value] as number) | bit;
            }
        }
    });
    let back = 0;
    let forward = 0;
    for (const fingerprint of fingerprints) {
        back = Math.max(back, fingerprint.offset);
        forward = Math.max(forward, fingerprint.keywordLength - fingerprint.offset);
    }
    return { masks, back, forward };
};

type KernelExports = {
    memory: WebAssembly.Memory;
    table(): number;
    classOfByte(): number;
    masks(): number;
    hitIndex(): number;
    hitState(): number;
    input(): number;
    maxHits(): number;
    configure(classCount: number, firstOutput: number, back: number, forward: number): void;
    scan(length: number): number;
};

let compiledModule: WebAssembly.Module | null | undefined;
/**
 * Compile the kernel once. Returns null if WebAssembly with SIMD is not available.
 */
const compileKernel = (): WebAssembly.Module | null => {
    if (compiledModule === undefined) {
        try {
            const binary = atob(KEYWORD_SCAN_WASM_BASE64);
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index++) {
                bytes[index] = binary.charCodeAt(index);
            }
            compiledModule = new WebAssembly.Module(bytes);
        } catch {
            // WebAssembly or SIMD is not supported, or the Content Security Policy does not allow WebAssembly
            compiledModule = null;
        }
    }
    return compiledModule;
};

/**
 * Create a kernel for the automaton, or return undefined if the kernel is not available for it.
 */
export const createKeywordScanKernel = (options: KeywordScanKernelOptions): KeywordScanKernel | undefined => {
    const { keywords, transitions, charClass, classCount, firstOutputOffset } = options;
    if (keywords.length === 0 || keywords.some((keyword) => keyword.length === 0)) {
        return undefined;
    }
    const module = compileKernel();
    if (module === null) {
        return undefined;
    }
    let kernel: KernelExports;
    let inputOffset: number;
    let maxHits: number;
    try {
        kernel = new WebAssembly.Instance(module, {}).exports as unknown as KernelExports;
        const { masks, back, forward } = createFilterTables(keywords);
        new Uint16Array(kernel.memory.buffer, kernel.table(), transitions.length).set(transitions);
        new Uint8Array(kernel.memory.buffer, kernel.classOfByte(), charClass.length).set(charClass);
        new Uint8Array(kernel.memory.buffer, kernel.masks(), masks.length).set(masks);
        kernel.configure(classCount, firstOutputOffset, back, forward);
        inputOffset = kernel.input();
        maxHits = kernel.maxHits();
    } catch {
        return undefined;
    }
    // The views of the memory. They are created again when the memory grows.
    let memoryBuffer: ArrayBufferLike | undefined;
    let input = new Uint8Array(0);
    let hitIndex = new Uint32Array(0);
    let hitState = new Uint16Array(0);
    const scan = (bytes: Uint8Array, start: number, onHit: (state: number, index: number) => void): boolean => {
        const length = bytes.length - start;
        if (length <= 0) {
            return true;
        }
        if (length > MAX_INPUT_SIZE) {
            return false;
        }
        try {
            const missing = inputOffset + length - kernel.memory.buffer.byteLength;
            if (missing > 0) {
                kernel.memory.grow(Math.ceil(missing / PAGE_SIZE));
            }
        } catch {
            // The memory can not grow
            return false;
        }
        if (memoryBuffer !== kernel.memory.buffer) {
            memoryBuffer = kernel.memory.buffer;
            input = new Uint8Array(memoryBuffer, inputOffset);
            hitIndex = new Uint32Array(memoryBuffer, kernel.hitIndex(), maxHits);
            hitState = new Uint16Array(memoryBuffer, kernel.hitState(), maxHits);
        }
        input.set(start === 0 ? bytes : bytes.subarray(start));
        const count = kernel.scan(length);
        if (count > maxHits) {
            // The kernel keeps only the first hits
            return false;
        }
        for (let index = 0; index < count; index++) {
            onHit(hitState[index] as number, (hitIndex[index] as number) + start);
        }
        return true;
    };
    return { scan };
};
