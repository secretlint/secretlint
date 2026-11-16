/**
 * Find keywords in a regular expression: strings that every match of the regular expression contains.
 *
 * The keywords are used by the keyword pre-filter, so a wrong keyword makes a pattern miss a match.
 * This reads the pattern conservatively: it keeps only the characters that every match consumes one after another,
 * and it returns `undefined` for any syntax that it does not know.
 * Search tools use the same idea to find the literals that a match requires, such as the trigram index of
 * Google Code Search (https://swtch.com/~rsc/regexp/regexp4.html) and `regex_syntax::hir::literal` of Rust.
 */

/**
 * A keyword shorter than this is not used, because it is found in most files and makes the scan report many positions.
 */
const MIN_KEYWORD_LENGTH = 3;

/**
 * A set of keywords: the content contains at least one of them.
 */
type KeywordSet = string[];

class UnsupportedSyntax extends Error {}

type Parser = {
    readonly source: string;
    readonly ignoreCase: boolean;
    index: number;
};

const scoreOf = (set: KeywordSet): number => {
    let min = Infinity;
    for (const keyword of set) {
        min = Math.min(min, keyword.length);
    }
    return min;
};
/**
 * Return the set whose shortest keyword is the longest, or undefined if no set is long enough.
 */
const bestSet = (sets: readonly KeywordSet[]): KeywordSet | undefined => {
    let best: KeywordSet | undefined;
    for (const set of sets) {
        if (scoreOf(set) < MIN_KEYWORD_LENGTH) {
            continue;
        }
        if (best === undefined || scoreOf(set) > scoreOf(best)) {
            best = set;
        }
    }
    return best;
};
/**
 * A match takes one of the alternatives, so the keywords are the union of the best set of each alternative.
 * Return undefined if an alternative has no keyword.
 */
const unionOfAlternatives = (alternatives: readonly (readonly KeywordSet[])[]): KeywordSet | undefined => {
    const union = new Set<string>();
    for (const sets of alternatives) {
        const best = bestSet(sets);
        if (best === undefined) {
            return undefined;
        }
        best.forEach((keyword) => union.add(keyword));
    }
    return [...union];
};

/**
 * Parse alternatives until ")" or the end, and return the keyword sets of each alternative
 */
const parseAlternatives = (parser: Parser): KeywordSet[][] => {
    const alternatives: KeywordSet[][] = [parseSequence(parser)];
    while (parser.source[parser.index] === "|") {
        parser.index++;
        alternatives.push(parseSequence(parser));
    }
    return alternatives;
};

type Atom = { kind: "char"; char: string } | { kind: "other" } | { kind: "group"; alternatives: KeywordSet[][] };

const indexAfter = (parser: Parser, char: string, from: number): number => {
    const index = parser.source.indexOf(char, from);
    if (index < 0) {
        throw new UnsupportedSyntax();
    }
    return index + 1;
};

const parseEscape = (parser: Parser): Atom => {
    const { source } = parser;
    const start = parser.index;
    const escaped = source[start + 1];
    if (escaped === undefined) {
        throw new UnsupportedSyntax();
    }
    if (!/[0-9A-Za-z]/.test(escaped)) {
        // an escaped punctuation character, such as "\." or "\/"
        parser.index = start + 2;
        return { kind: "char", char: escaped };
    }
    // "\d", "\w", "\s", "\b", "\x41", "A", "\cX", "\k<name>", "\1", "\p{...}": not a literal of the keyword
    switch (escaped) {
        case "x":
            parser.index = start + 4;
            break;
        case "u":
            parser.index = source[start + 2] === "{" ? indexAfter(parser, "}", start) : start + 6;
            break;
        case "c":
            parser.index = start + 3;
            break;
        case "p":
        case "P":
            parser.index = indexAfter(parser, "}", start);
            break;
        case "k":
            parser.index = indexAfter(parser, ">", start);
            break;
        default: {
            let next = start + 2;
            if (/[0-9]/.test(escaped)) {
                while (/[0-9]/.test(source[next] ?? "")) {
                    next++;
                }
            }
            parser.index = next;
        }
    }
    return { kind: "other" };
};

const skipClass = (parser: Parser): Atom => {
    const { source } = parser;
    let index = parser.index + 1;
    while (index < source.length && source[index] !== "]") {
        index += source[index] === "\\" ? 2 : 1;
    }
    if (index >= source.length) {
        throw new UnsupportedSyntax();
    }
    parser.index = index + 1;
    return { kind: "other" };
};

const parseGroup = (parser: Parser): Atom => {
    const { source } = parser;
    let index = parser.index + 1;
    let negative = false;
    if (source[index] === "?") {
        const next = source[index + 1];
        const afterNext = source[index + 2];
        if (next === ":" || next === "=") {
            // a non-capturing group, or a positive lookahead: its text must be in the content
            index += 2;
        } else if (next === "!") {
            negative = true;
            index += 2;
        } else if (next === "<" && afterNext === "=") {
            index += 3;
        } else if (next === "<" && afterNext === "!") {
            negative = true;
            index += 3;
        } else if (next === "<") {
            // a named group
            index = indexAfter(parser, ">", index);
        } else {
            // a group with modifiers such as "(?i:...)"
            throw new UnsupportedSyntax();
        }
    }
    parser.index = index;
    const alternatives = parseAlternatives(parser);
    if (source[parser.index] !== ")") {
        throw new UnsupportedSyntax();
    }
    parser.index++;
    return negative ? { kind: "other" } : { kind: "group", alternatives };
};

/**
 * Parse a quantifier after an atom, and return the minimum number of repetitions, or undefined if there is no quantifier
 */
const parseQuantifier = (parser: Parser): number | undefined => {
    const { source } = parser;
    const char = source[parser.index];
    let min: number | undefined;
    if (char === "?" || char === "*") {
        min = 0;
        parser.index++;
    } else if (char === "+") {
        min = 1;
        parser.index++;
    } else if (char === "{") {
        const matched = /^\{(\d+)(?:,\d*)?\}/.exec(source.slice(parser.index));
        if (!matched) {
            throw new UnsupportedSyntax();
        }
        min = Number(matched[1]);
        parser.index += matched[0].length;
    }
    if (min !== undefined && source[parser.index] === "?") {
        // a lazy quantifier
        parser.index++;
    }
    return min;
};

/**
 * Parse a sequence until "|", ")", or the end, and return its keyword sets.
 * Every match of the sequence contains at least one keyword of each set.
 */
const parseSequence = (parser: Parser): KeywordSet[] => {
    const { source, ignoreCase } = parser;
    const sets: KeywordSet[] = [];
    let run = "";
    const endRun = () => {
        if (run.length > 0) {
            sets.push([run]);
        }
        run = "";
    };
    while (parser.index < source.length && source[parser.index] !== "|" && source[parser.index] !== ")") {
        const char = source[parser.index] as string;
        let atom: Atom;
        if (char === "\\") {
            atom = parseEscape(parser);
        } else if (char === "[") {
            atom = skipClass(parser);
        } else if (char === "(") {
            atom = parseGroup(parser);
        } else if (char === "." || char === "^" || char === "$") {
            parser.index++;
            atom = { kind: "other" };
        } else if (char === "?" || char === "*" || char === "+" || char === "{" || char === "}" || char === "]") {
            throw new UnsupportedSyntax();
        } else {
            parser.index++;
            atom = { kind: "char", char };
        }
        const min = parseQuantifier(parser);
        if (atom.kind === "char") {
            // Keywords are ASCII only
            if (atom.char.charCodeAt(0) >= 128 || min === 0) {
                endRun();
            } else {
                run += ignoreCase ? atom.char.toLowerCase() : atom.char;
                if (min !== undefined) {
                    // "a+" contains "a", but the next character may not follow it
                    endRun();
                }
            }
        } else if (atom.kind === "group") {
            endRun();
            if (min === undefined || min >= 1) {
                const union = unionOfAlternatives(atom.alternatives);
                if (union !== undefined) {
                    sets.push(union);
                }
            }
        } else {
            endRun();
        }
    }
    endRun();
    return sets;
};

/**
 * Return keywords that every match of the regular expression contains, or `undefined` if no keyword is found.
 * The keywords are ASCII, and lower-cased if the regular expression has the "i" flag.
 * At least one of the keywords is in the content when the regular expression matches it,
 * except for a match of the "i" flag with a non-ASCII character that folds to an ASCII letter, such as "K" for "k".
 */
export const extractKeywords = (regex: RegExp): string[] | undefined => {
    if (regex.flags.includes("v")) {
        return undefined;
    }
    const parser: Parser = { source: regex.source, ignoreCase: regex.flags.includes("i"), index: 0 };
    try {
        const alternatives = parseAlternatives(parser);
        if (parser.index !== regex.source.length) {
            return undefined;
        }
        return unionOfAlternatives(alternatives);
    } catch (error) {
        if (error instanceof UnsupportedSyntax) {
            return undefined;
        }
        throw error;
    }
};
