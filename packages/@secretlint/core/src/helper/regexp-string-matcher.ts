/**
 * Match a text with RegExp-like strings.
 * It is used for the `allows` option of rules.
 *
 * RegExp-like string:
 *
 * - `"str"`: match as a string
 * - `"/pattern/"`: match as a RegExp. `u` and `g` flags are always added
 * - `"/pattern/i"`: match as a RegExp with the flags
 *
 * This is compatible with `@textlint/regexp-string-matcher`.
 * https://github.com/textlint/regexp-string-matcher#regexp-like-string
 */
const REGEXP_LITERAL_PATTERN = /^\/(.+)\/([guimysd]*)$/;
const DEFAULT_FLAGS = "ug";
const REGEXP_SPECIAL_CHARACTERS = /[|\\{}()[\]^$+*?.]/g;

export type MatchPatternResult = {
    match: string;
    /**
     * captured results: [$1, $2 ...]
     */
    captures: string[];
    startIndex: number;
    endIndex: number;
};

const escapeStringRegexp = (str: string): string => {
    return str.replace(REGEXP_SPECIAL_CHARACTERS, "\\$&").replace(/-/g, "\\x2d");
};

const addDefaultFlags = (flags: string): string => {
    return Array.from(new Set(flags + DEFAULT_FLAGS)).join("");
};

/**
 * Create a RegExp from a RegExp-like string.
 * @throws if the string is empty or it is an invalid RegExp
 */
export const createRegExp = (patternString: string): RegExp => {
    if (patternString.length === 0) {
        throw new Error("Empty string can not handled");
    }
    const regExpLiteral = patternString.match(REGEXP_LITERAL_PATTERN);
    if (regExpLiteral) {
        return new RegExp(regExpLiteral[1], addDefaultFlags(regExpLiteral[2]));
    }
    return new RegExp(escapeStringRegexp(patternString), DEFAULT_FLAGS);
};

/**
 * The same pattern strings are used for every match of a rule, so cache the RegExp.
 * `String.prototype.matchAll` does not change `lastIndex` of the RegExp, so sharing the RegExp is safe.
 * The patterns come from the config, so the cache does not grow while linting.
 */
const regExpCache = new Map<string, RegExp>();
const getRegExp = (patternString: string): RegExp => {
    let regExp = regExpCache.get(patternString);
    if (regExp === undefined) {
        regExp = createRegExp(patternString);
        regExpCache.set(patternString, regExp);
    }
    return regExp;
};

/**
 * Match the text with RegExp-like strings, and return the results in the order of the position.
 * @param text target text
 * @param regExpLikeStrings an array of RegExp-like string
 */
export const matchPatterns = (text: string, regExpLikeStrings: string[]): MatchPatternResult[] => {
    const results: MatchPatternResult[] = [];
    for (const patternString of regExpLikeStrings) {
        for (const result of text.matchAll(getRegExp(patternString))) {
            const match = result[0];
            const startIndex = result.index;
            const endIndex = startIndex + match.length;
            // The same range is matched by another pattern
            if (results.some((item) => item.startIndex === startIndex && item.endIndex === endIndex)) {
                continue;
            }
            results.push({
                match,
                captures: result.slice(1),
                startIndex,
                endIndex,
            });
        }
    }
    // Array.prototype.sort is stable
    return results.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
};
