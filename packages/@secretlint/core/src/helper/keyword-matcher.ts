/**
 * Find which keywords appear in a text, in a single pass over the text.
 *
 * This is the Aho-Corasick algorithm over UTF-16 code units.
 * Keywords are matched ASCII case-insensitively: "a-z" and "A-Z" are the same character.
 * Non-ASCII characters in the text never match a keyword character.
 *
 * Rules declare `meta.keywords`, and the core scans the content once for all keywords of all rules
 * instead of running each rule's regular expressions over the whole content.
 * Secret scanners such as gitleaks and TruffleHog use the same keyword pre-filter.
 */
export type KeywordMatcher = {
    /**
     * Normalized keywords. `match()` returns flags in this order.
     */
    readonly keywords: readonly string[];
    /**
     * Return `found[i] === 1` if `keywords[i]` appears in the text.
     */
    match(text: string): Uint8Array;
};

const ASCII_SIZE = 128;

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
    // Map each ASCII character to a small character class. 0 means "not used by any keyword".
    const charClass = new Uint8Array(ASCII_SIZE);
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
    const outputs: number[][] = [[]];
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
                outputs.push([]);
            }
            state = next;
        }
        (outputs[state] as number[]).push(keywordIndex);
    });
    // Build the transition table with failure links (breadth-first)
    const stateCount = children.length;
    const transitions = new Int32Array(stateCount * classCount);
    const failure = new Int32Array(stateCount);
    const queue: number[] = [];
    const rootChildren = children[0] as Int32Array;
    for (let cls = 0; cls < classCount; cls++) {
        const next = rootChildren[cls] ?? -1;
        if (next > 0) {
            transitions[cls] = next;
            queue.push(next);
        }
    }
    for (let head = 0; head < queue.length; head++) {
        const state = queue[head] as number;
        const fail = failure[state] ?? 0;
        outputs[state] = (outputs[state] as number[]).concat(outputs[fail] as number[]);
        const stateChildren = children[state] as Int32Array;
        for (let cls = 0; cls < classCount; cls++) {
            const next = stateChildren[cls] ?? -1;
            const failTransition = transitions[fail * classCount + cls] ?? 0;
            if (next >= 0) {
                failure[next] = failTransition;
                transitions[state * classCount + cls] = next;
                queue.push(next);
            } else {
                transitions[state * classCount + cls] = failTransition;
            }
        }
    }
    // Pre-multiply states by classCount to save a multiplication per character
    for (let i = 0; i < transitions.length; i++) {
        transitions[i] = (transitions[i] ?? 0) * classCount;
    }
    // hasOutput[offset] is 1 if the state at the offset completes any keyword
    const hasOutput = new Uint8Array(stateCount * classCount);
    for (let state = 0; state < stateCount; state++) {
        if ((outputs[state] as number[]).length > 0) {
            hasOutput[state * classCount] = 1;
        }
    }
    return {
        keywords,
        match(text: string): Uint8Array {
            const found = new Uint8Array(keywords.length);
            let offset = 0;
            for (let i = 0, length = text.length; i < length; i++) {
                const code = text.charCodeAt(i);
                offset = transitions[offset + (code < ASCII_SIZE ? (charClass[code] as number) : 0)] as number;
                if (hasOutput[offset] === 1) {
                    const output = outputs[offset / classCount] as number[];
                    for (let j = 0; j < output.length; j++) {
                        found[output[j] as number] = 1;
                    }
                }
            }
            return found;
        },
    };
};

const MAX_CACHE_SIZE = 32;
const matcherCache = new Map<string, KeywordMatcher>();
/**
 * Return a cached matcher for the keywords.
 * `lintSource()` registers rules for each file, so the matcher is cached by its keywords.
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
