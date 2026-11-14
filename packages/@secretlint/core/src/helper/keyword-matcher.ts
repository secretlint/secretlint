/**
 * Find where keywords appear in a text or in UTF-8 bytes, in a single pass.
 *
 * This is the Aho-Corasick algorithm.
 * Keywords are always matched ASCII case-insensitively: "a-z" and "A-Z" are the same character.
 * A keyword can have a guard: a set of ASCII characters and a least count of them after the keyword.
 * The guard is checked in the scan loop, and a place whose guard is not met is not recorded.
 * Non-ASCII characters never match a keyword character.
 * Keywords are ASCII only, so scanning the UTF-8 bytes finds the same keywords as scanning the decoded text.
 *
 * Rules declare keywords, and the core scans the content once for all keywords of all rules
 * instead of running each rule's regular expressions over the whole content.
 * Secret scanners such as gitleaks and TruffleHog use the same keyword pre-filter.
 */
import {
    createGuardTable,
    isGuardMetInBytes,
    isGuardMetInText,
    type KeywordGuard,
    keywordGuardKey,
} from "./keyword-guard.js";

/**
 * The result of a scan. It is not changed after the scan.
 */
export type KeywordHits = {
    /**
     * `found[i] === 1` if `keywords[i]` appears in the input
     */
    readonly found: Readonly<Uint8Array>;
    /**
     * Pairs of [state, index]. `index` is the index of the last character of a keyword in the input.
     * `matcher.keywordsOfState(state)` returns the keywords that end at the index.
     * `state` is an id for a set of keywords. It is not always a state of the automaton.
     * Pairs are sorted by the index.
     */
    readonly positions: Readonly<Int32Array>;
    /**
     * The number of the pairs in `positions`
     */
    readonly count: number;
};
export type KeywordMatcher = {
    /**
     * The keywords, lower-cased. `found` of the hits is in this order.
     * A keyword can be in the list more than once, with different guards.
     */
    readonly keywords: readonly string[];
    /**
     * `guards[i]` is the guard of `keywords[i]`, or undefined
     */
    readonly guards: readonly (KeywordGuard | undefined)[];
    /**
     * Return `found[i] === 1` if `keywords[i]` appears in the text.
     */
    match(text: string): Readonly<Uint8Array>;
    /**
     * Find the keywords in the input from the `start` index.
     * The input is a string or UTF-8 bytes. Indexes are UTF-16 code units for a string, and bytes for bytes.
     * It returns a new result for each scan. `count` is 0 if no keyword is found.
     */
    scan(input: string | Uint8Array, start?: number): KeywordHits;
    /**
     * Return the indexes of the keywords that end at the state
     */
    keywordsOfState(state: number): readonly number[];
    /**
     * For each keyword with a guard, the number of the places where the keyword was found
     * and where its guard was met. It is counted only if the matcher was created with `countGuards: true`.
     */
    guardCounts(): KeywordGuardCount[];
};
export type KeywordGuardCount = { keywordIndex: number; found: number; met: number };

const ASCII_SIZE = 128;
const BYTE_SIZE = 256;
const INITIAL_POSITIONS_SIZE = 64;

/**
 * Normalize a keyword for matching.
 * Return `undefined` if the keyword can not be matched by {@link KeywordMatcher}.
 */
export const normalizeKeyword = (keyword: unknown): string | undefined => {
    if (typeof keyword !== "string" || keyword.length === 0) {
        return undefined;
    }
    for (let i = 0; i < keyword.length; i++) {
        if (keyword.charCodeAt(i) >= ASCII_SIZE) {
            return undefined;
        }
    }
    return keyword.toLowerCase();
};

/**
 * Create a matcher for the keywords.
 * Keywords should be lower-cased by {@link normalizeKeyword}.
 * If `guards[i]` is defined, `keywords[i]` is found only where the guard is met.
 */
export const createKeywordMatcher = (
    keywords: readonly string[],
    guards: readonly (KeywordGuard | undefined)[] = [],
    options: { countGuards?: boolean } = {},
): KeywordMatcher => {
    const trieKeywords = keywords.map((keyword) => keyword.toLowerCase());
    // Map each byte to a small character class. 0 means "not used by any keyword".
    // Non-ASCII bytes are always 0.
    const charClass = new Uint8Array(BYTE_SIZE);
    let classCount = 1;
    for (const keyword of trieKeywords) {
        for (let i = 0; i < keyword.length; i++) {
            const code = keyword.charCodeAt(i);
            if (charClass[code] === 0) {
                charClass[code] = classCount++;
            }
        }
    }
    // keywords are lower-cased, so map upper-case letters to the same class
    for (let code = 0x41; code <= 0x5a; code++) {
        charClass[code] = charClass[code + 0x20] ?? 0;
    }
    // Build the trie
    const children: Int32Array[] = [new Int32Array(classCount).fill(-1)];
    const trieOutputs: number[][] = [[]];
    trieKeywords.forEach((keyword, keywordIndex) => {
        let state = 0;
        for (let i = 0; i < keyword.length; i++) {
            const cls = charClass[keyword.charCodeAt(i)] ?? 0;
            const stateChildren = children[state] as Int32Array;
            let next = stateChildren[cls] ?? -1;
            if (next < 0) {
                next = children.length;
                stateChildren[cls] = next;
                children.push(new Int32Array(classCount).fill(-1));
                trieOutputs.push([]);
            }
            state = next;
        }
        (trieOutputs[state] as number[]).push(keywordIndex);
    });
    // Build the transitions with failure links (breadth-first)
    const stateCount = children.length;
    const trieTransitions = new Int32Array(stateCount * classCount);
    const failure = new Int32Array(stateCount);
    const queue: number[] = [];
    const rootChildren = children[0] as Int32Array;
    for (let cls = 0; cls < classCount; cls++) {
        const next = rootChildren[cls] ?? -1;
        if (next > 0) {
            trieTransitions[cls] = next;
            queue.push(next);
        }
    }
    for (let head = 0; head < queue.length; head++) {
        const state = queue[head] as number;
        const fail = failure[state] ?? 0;
        trieOutputs[state] = (trieOutputs[state] as number[]).concat(trieOutputs[fail] as number[]);
        const stateChildren = children[state] as Int32Array;
        for (let cls = 0; cls < classCount; cls++) {
            const next = stateChildren[cls] ?? -1;
            const failTransition = trieTransitions[fail * classCount + cls] ?? 0;
            if (next >= 0) {
                failure[next] = failTransition;
                trieTransitions[state * classCount + cls] = next;
                queue.push(next);
            } else {
                trieTransitions[state * classCount + cls] = failTransition;
            }
        }
    }
    // Renumber the states: the states that complete a keyword go last.
    // The scan loop finds a hit with one comparison, without reading another table.
    const order: number[] = [];
    for (let state = 0; state < stateCount; state++) {
        if ((trieOutputs[state] as number[]).length === 0) {
            order.push(state);
        }
    }
    const firstOutputState = order.length;
    for (let state = 0; state < stateCount; state++) {
        if ((trieOutputs[state] as number[]).length > 0) {
            order.push(state);
        }
    }
    const newState = new Int32Array(stateCount);
    order.forEach((oldState, state) => {
        newState[oldState] = state;
    });
    // Pre-multiply states by classCount to save a multiplication per character.
    // A small table fits in the CPU cache, so use 16 bits per entry if possible.
    const tableSize = stateCount * classCount;
    const transitions = tableSize <= 0xffff ? new Uint16Array(tableSize) : new Int32Array(tableSize);
    const outputs: number[][] = [];
    order.forEach((oldState, state) => {
        for (let cls = 0; cls < classCount; cls++) {
            transitions[state * classCount + cls] =
                (newState[trieTransitions[oldState * classCount + cls] as number] as number) * classCount;
        }
        outputs.push(trieOutputs[oldState] as number[]);
    });
    const firstOutputOffset = firstOutputState * classCount;
    // Keywords with a guard: when the automaton completes a keyword, `checkGuards()` reads the characters after it
    // and returns the id of the keywords whose guard is met (or that have no guard).
    // `outputs` gets a new entry for each subset of the keywords of a state, so an id is `state` or an added entry.
    const guardTables = keywords.map((_, index) => {
        const guard = guards[index];
        return guard === undefined ? undefined : createGuardTable(guard);
    });
    const guardMins = keywords.map((_, index) => guards[index]?.min ?? 0);
    const hasGuards = guardTables.some((table) => table !== undefined);
    const needsCheck = new Uint8Array(stateCount);
    outputs.forEach((output, state) => {
        if (output.some((keywordIndex) => guardTables[keywordIndex] !== undefined)) {
            needsCheck[state] = 1;
        }
    });
    // [found, met] for each keyword. It is counted only for the profile
    const guardCounts = options.countGuards ? new Float64Array(keywords.length * 2) : undefined;
    const subsetIds = new Map<string, number>();
    /**
     * Return the id of the keywords of the state that are found at the place, or -1 if none is found.
     * `lastIndex` is the index of the last character of the keywords.
     * It reads at most 255 characters after the place for each guard, and it does not change the state of the scan.
     */
    const checkGuards = (input: string | Uint8Array, state: number, lastIndex: number): number => {
        const output = outputs[state] as number[];
        const isText = typeof input === "string";
        let metCount = 0;
        for (let i = 0; i < output.length; i++) {
            const keywordIndex = output[i] as number;
            const table = guardTables[keywordIndex];
            if (table === undefined) {
                metCount++;
                continue;
            }
            const min = guardMins[keywordIndex] as number;
            const met = isText
                ? isGuardMetInText(input, lastIndex + 1, table, min)
                : isGuardMetInBytes(input, lastIndex + 1, table, min);
            if (guardCounts) {
                (guardCounts[keywordIndex * 2] as number)++;
                if (met) {
                    (guardCounts[keywordIndex * 2 + 1] as number)++;
                }
            }
            if (met) {
                metCount++;
            }
        }
        if (metCount === output.length) {
            return state;
        }
        if (metCount === 0) {
            return -1;
        }
        // Some keywords of the state are found: the id is for these keywords.
        // This is rare: two patterns share a keyword and differ in the guard
        const matched = output.filter((keywordIndex) => {
            const table = guardTables[keywordIndex];
            if (table === undefined) {
                return true;
            }
            const min = guardMins[keywordIndex] as number;
            return isText
                ? isGuardMetInText(input, lastIndex + 1, table, min)
                : isGuardMetInBytes(input, lastIndex + 1, table, min);
        });
        const key = `${state}:${matched.join(",")}`;
        const knownId = subsetIds.get(key);
        if (knownId !== undefined) {
            return knownId;
        }
        const id = outputs.length;
        outputs.push(matched);
        subsetIds.set(key, id);
        return id;
    };
    // The scan loops write the hits to this buffer, and `scan()` returns a copy of the used part.
    // It is the only state of the matcher that changes, and it is not visible from outside:
    // a scan runs to the end synchronously, so two scans never use the buffer at the same time.
    let buffer = new Int32Array(INITIAL_POSITIONS_SIZE);
    const growBuffer = (): void => {
        const grown = new Int32Array(buffer.length * 2);
        grown.set(buffer);
        buffer = grown;
    };
    /**
     * Write [state, index] of the hits to the buffer, and return the length of the written part
     */
    const scanBytes = (bytes: Uint8Array, start: number): number => {
        let offset = 0;
        let written = 0;
        for (let i = start, length = bytes.length; i < length; i++) {
            offset = transitions[offset + (charClass[bytes[i] as number] as number)] as number;
            if (offset >= firstOutputOffset) {
                let id = offset / classCount;
                if (hasGuards && needsCheck[id] === 1) {
                    id = checkGuards(bytes, id, i);
                    if (id < 0) {
                        // no keyword is found here: nothing is recorded
                        continue;
                    }
                }
                if (written >= buffer.length) {
                    growBuffer();
                }
                buffer[written] = id;
                buffer[written + 1] = i;
                written += 2;
            }
        }
        return written;
    };
    const scanText = (text: string, start: number): number => {
        let offset = 0;
        let written = 0;
        for (let i = start, length = text.length; i < length; i++) {
            const code = text.charCodeAt(i);
            offset = transitions[offset + (code < ASCII_SIZE ? (charClass[code] as number) : 0)] as number;
            if (offset >= firstOutputOffset) {
                let id = offset / classCount;
                if (hasGuards && needsCheck[id] === 1) {
                    id = checkGuards(text, id, i);
                    if (id < 0) {
                        continue;
                    }
                }
                if (written >= buffer.length) {
                    growBuffer();
                }
                buffer[written] = id;
                buffer[written + 1] = i;
                written += 2;
            }
        }
        return written;
    };
    const noHits: KeywordHits = {
        found: new Uint8Array(keywords.length),
        positions: new Int32Array(0),
        count: 0,
    };
    const scan = (input: string | Uint8Array, start: number = 0): KeywordHits => {
        if (keywords.length === 0) {
            return noHits;
        }
        const length = typeof input === "string" ? scanText(input, start) : scanBytes(input, start);
        if (length === 0) {
            // Most inputs have no keyword. Nothing is created for them
            return noHits;
        }
        const positions = buffer.slice(0, length);
        const found = new Uint8Array(keywords.length);
        for (let i = 0; i < length; i += 2) {
            const output = outputs[positions[i] as number] as number[];
            for (let j = 0; j < output.length; j++) {
                found[output[j] as number] = 1;
            }
        }
        return { found, positions, count: length / 2 };
    };
    return {
        keywords,
        guards: keywords.map((_, index) => guards[index]),
        guardCounts(): KeywordGuardCount[] {
            if (!guardCounts) {
                return [];
            }
            const counts: KeywordGuardCount[] = [];
            guardTables.forEach((table, keywordIndex) => {
                if (table !== undefined) {
                    counts.push({
                        keywordIndex,
                        found: guardCounts[keywordIndex * 2] as number,
                        met: guardCounts[keywordIndex * 2 + 1] as number,
                    });
                }
            });
            return counts;
        },
        match(text: string): Readonly<Uint8Array> {
            return scan(text).found;
        },
        scan,
        keywordsOfState(state: number): readonly number[] {
            return outputs[state] ?? [];
        },
    };
};

const MAX_CACHE_SIZE = 32;
const matcherCache = new Map<string, KeywordMatcher>();
/**
 * Return a cached matcher for the keywords.
 */
export const getKeywordMatcher = (
    keywords: readonly string[],
    guards: readonly (KeywordGuard | undefined)[] = [],
): KeywordMatcher => {
    // keywords may contain "\n", so join() is ambiguous
    const key = JSON.stringify([keywords, keywords.map((_, index) => keywordGuardKey(guards[index]))]);
    const cached = matcherCache.get(key);
    if (cached) {
        return cached;
    }
    if (matcherCache.size >= MAX_CACHE_SIZE) {
        matcherCache.clear();
    }
    const matcher = createKeywordMatcher(keywords, guards);
    matcherCache.set(key, matcher);
    return matcher;
};
