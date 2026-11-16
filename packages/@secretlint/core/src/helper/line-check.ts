/**
 * The check of the lines that have a keyword. It does not import rules or config:
 * `lintSource()` uses it, and the keyword scan of a worker thread uses it with patterns that are created from data.
 */
import type { KeywordHits, KeywordMatcher } from "./keyword-matcher.js";

export type LinePattern = {
    /**
     * It has no state: `test()` does not depend on the calls before it
     */
    readonly tester: RegExp;
};
export type LineCheckView<P> = {
    readonly matcher: KeywordMatcher | undefined;
    /**
     * "line" scope patterns for each keyword index
     */
    readonly linePatternsOfKeyword: readonly (readonly P[])[];
};

const LINE_FEED = 0x0a;
// TextDecoder is in browsers and Node.js. `ignoreBOM: true` keeps a BOM as a character, as `Buffer#toString` does
const textDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
/**
 * Decode a part of UTF-8 bytes.
 * The part is a line: it starts after a line feed and ends with a line feed,
 * so the result is the same as the part of the decoded whole content.
 */
const decodeBytes = (bytes: Uint8Array, start: number, end: number): string => {
    // Buffer of Node.js decodes a part of it without creating a view
    const utf8Slice = (bytes as { utf8Slice?: (start: number, end: number) => string }).utf8Slice;
    if (typeof utf8Slice === "function") {
        return utf8Slice.call(bytes, start, end);
    }
    return textDecoder.decode(bytes.subarray(start, end));
};

export const isKeywordFound = (keywordIndexes: readonly number[], found: Readonly<Uint8Array>): boolean => {
    return keywordIndexes.some((keywordIndex) => found[keywordIndex] === 1);
};

/**
 * Call `visit` for each line that has a keyword of a "line" scope pattern, with the patterns of the keywords.
 * A line is [start, end), and it includes its line feed.
 * Stop and return true if `visit` returns true.
 */
export const someKeywordLine = <P>(
    view: LineCheckView<P>,
    hits: KeywordHits,
    lineStartOf: (index: number) => number,
    lineEndOf: (index: number) => number,
    visit: (lineStart: number, lineEnd: number, patterns: readonly P[]) => boolean,
): boolean => {
    const { matcher, linePatternsOfKeyword } = view;
    if (!matcher) {
        return false;
    }
    const positions = hits.positions;
    const end = hits.count * 2;
    // Add the "line" scope patterns of the keywords of the state to `patterns` of a line.
    // It is written with loops because it runs for each hit.
    const addLinePatterns = (patterns: P[], state: number): void => {
        const keywordIndexes = matcher.keywordsOfState(state);
        for (let i = 0; i < keywordIndexes.length; i++) {
            const linePatterns = linePatternsOfKeyword[keywordIndexes[i] as number] as readonly P[];
            for (let j = 0; j < linePatterns.length; j++) {
                const pattern = linePatterns[j] as P;
                if (!patterns.includes(pattern)) {
                    patterns.push(pattern);
                }
            }
        }
    };
    // `cursor` is the first hit of a line. Each turn takes all hits of the line.
    for (let cursor = 0; cursor < end; ) {
        const patterns: P[] = [];
        addLinePatterns(patterns, positions[cursor] as number);
        if (patterns.length === 0) {
            // the keyword is not for a "line" scope pattern
            cursor += 2;
            continue;
        }
        const index = positions[cursor + 1] as number;
        const lineStart = lineStartOf(index);
        const lineEnd = lineEndOf(index);
        cursor += 2;
        for (; cursor < end && (positions[cursor + 1] as number) < lineEnd; cursor += 2) {
            addLinePatterns(patterns, positions[cursor] as number);
        }
        if (visit(lineStart, lineEnd, patterns)) {
            return true;
        }
    }
    return false;
};

/**
 * Return true if a "line" scope pattern matches a line that has its keyword.
 * It decodes only the lines that have a keyword, so the whole content is not decoded for the files without secrets.
 * `hits` is the result of scanning the bytes.
 */
export const hasLineMatchInBytes = <P extends LinePattern>(
    view: LineCheckView<P>,
    hits: KeywordHits,
    bytes: Uint8Array,
    contentStart: number,
    test: (pattern: P, line: string) => boolean = (pattern, line) => pattern.tester.test(line),
): boolean => {
    return someKeywordLine(
        view,
        hits,
        (index) => Math.max((index === 0 ? -1 : bytes.lastIndexOf(LINE_FEED, index - 1)) + 1, contentStart),
        (index) => {
            const nextLineFeed = bytes.indexOf(LINE_FEED, index);
            return nextLineFeed < 0 ? bytes.length : nextLineFeed + 1;
        },
        (lineStart, lineEnd, patterns) => {
            const line = decodeBytes(bytes, lineStart, lineEnd);
            return patterns.some((pattern) => test(pattern, line));
        },
    );
};
