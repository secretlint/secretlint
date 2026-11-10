/**
 * Find where keywords appear in a text or in UTF-8 bytes, in a single pass.
 *
 * This is the Aho-Corasick algorithm.
 * Keywords are matched ASCII case-insensitively: "a-z" and "A-Z" are the same character.
 * Non-ASCII characters never match a keyword character.
 * Keywords are ASCII only, so scanning the UTF-8 bytes finds the same keywords as scanning the decoded text.
 *
 * Rules declare keywords, and the core scans the content once for all keywords of all rules
 * instead of running each rule's regular expressions over the whole content.
 * Secret scanners such as gitleaks and TruffleHog use the same keyword pre-filter.
 */
export type KeywordHits = {
    /**
     * `found[i] === 1` if `keywords[i]` appears in the input
     */
    readonly found: Uint8Array;
    /**
     * Pairs of [state, index]. `index` is the index of the last character of a keyword in the input.
     * `matcher.keywordsOfState(state)` returns the keywords that end at the index.
     * Pairs are sorted by the index.
     */
    positions: Int32Array;
    /**
     * The number of the pairs in `positions`
     */
    count: number;
};
export type KeywordMatcher = {
    /**
     * Normalized keywords. `match()` returns flags in this order.
     */
    readonly keywords: readonly string[];
    /**
     * Return `found[i] === 1` if `keywords[i]` appears in the text.
     */
    match(text: string): Uint8Array;
    /**
     * Create a result holder for `scan()`. A holder can be reused for many scans.
     */
    createHits(): KeywordHits;
    /**
     * Find the keywords in the input from the `start` index, and write the result to `hits`.
     * The input is a string or UTF-8 bytes. Indexes are UTF-16 code units for a string, and bytes for bytes.
     * Return true if any keyword is found.
     */
    scan(input: string | Uint8Array, hits: KeywordHits, start?: number): boolean;
    /**
     * Return the indexes of the keywords that end at the state
     */
    keywordsOfState(state: number): readonly number[];
};

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

export const createKeywordMatcher = (keywords: readonly string[]): KeywordMatcher => {
    // Map each byte to a small character class. 0 means "not used by any keyword".
    // Non-ASCII bytes are always 0.
    const charClass = new Uint8Array(BYTE_SIZE);
    let classCount = 1;
    for (const keyword of keywords) {
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
    keywords.forEach((keyword, keywordIndex) => {
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

    const pushPosition = (hits: KeywordHits, offset: number, index: number): void => {
        const at = hits.count * 2;
        if (at >= hits.positions.length) {
            const positions = new Int32Array(hits.positions.length * 2);
            positions.set(hits.positions);
            hits.positions = positions;
        }
        hits.positions[at] = offset / classCount;
        hits.positions[at + 1] = index;
        hits.count++;
    };
    const scanBytes = (bytes: Uint8Array, hits: KeywordHits, start: number): void => {
        let offset = 0;
        for (let i = start, length = bytes.length; i < length; i++) {
            offset = transitions[offset + (charClass[bytes[i] as number] as number)] as number;
            if (offset >= firstOutputOffset) {
                pushPosition(hits, offset, i);
            }
        }
    };
    const scanText = (text: string, hits: KeywordHits, start: number): void => {
        let offset = 0;
        for (let i = start, length = text.length; i < length; i++) {
            const code = text.charCodeAt(i);
            offset = transitions[offset + (code < ASCII_SIZE ? (charClass[code] as number) : 0)] as number;
            if (offset >= firstOutputOffset) {
                pushPosition(hits, offset, i);
            }
        }
    };
    const createHits = (): KeywordHits => {
        return {
            found: new Uint8Array(keywords.length),
            positions: new Int32Array(INITIAL_POSITIONS_SIZE),
            count: 0,
        };
    };
    const scan = (input: string | Uint8Array, hits: KeywordHits, start: number = 0): boolean => {
        hits.count = 0;
        hits.found.fill(0);
        if (keywords.length === 0) {
            return false;
        }
        if (typeof input === "string") {
            scanText(input, hits, start);
        } else {
            scanBytes(input, hits, start);
        }
        const { found, positions } = hits;
        for (let i = 0, end = hits.count * 2; i < end; i += 2) {
            const output = outputs[positions[i] as number] as number[];
            for (let j = 0; j < output.length; j++) {
                found[output[j] as number] = 1;
            }
        }
        return hits.count > 0;
    };
    return {
        keywords,
        match(text: string): Uint8Array {
            const hits = createHits();
            scan(text, hits);
            return hits.found;
        },
        createHits,
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
export const getKeywordMatcher = (keywords: readonly string[]): KeywordMatcher => {
    const key = keywords.join("\n");
    const cached = matcherCache.get(key);
    if (cached) {
        return cached;
    }
    if (matcherCache.size >= MAX_CACHE_SIZE) {
        matcherCache.clear();
    }
    const matcher = createKeywordMatcher(keywords);
    matcherCache.set(key, matcher);
    return matcher;
};
