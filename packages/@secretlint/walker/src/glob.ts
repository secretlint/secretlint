/**
 * Compile a pattern of `.gitignore` into a matcher that gives the same result as Git.
 *
 * The syntax is the one of https://git-scm.com/docs/gitignore: `*`, `?`, `[...]`, `\`, and `**`.
 * The details that the manual leaves to fnmatch(3) are decided by what Git does:
 * the tests compare this module with the results of `git check-ignore`.
 *
 * Git matches bytes: `?` and a character class match one byte of UTF-8, and only A-Z are folded.
 * So a pattern or a text that has a non-ASCII character is converted to a string that has
 * one character for each byte ({@link toByteString}).
 *
 * The matcher does not use a regular expression, and it does not try all the ways to match `*`:
 * a pattern such as `*a*a*a*a*b` would take exponential time with them, and an ignore file can come
 * from a repository that the user does not trust. When a match fails, only the last `*` and the last `**`
 * are moved forward, which is enough to find a match if there is one. See {@link compileGlob}.
 *
 * This module does not depend on Node.js or on other modules.
 */

export type GlobOptions = {
    /**
     * The text is a path: `*`, `?`, and a character class do not match `/`,
     * and `**` between slashes matches any number of directories.
     * If false, the text is a name, and `**` is the same as `*`.
     */
    pathname: boolean;
    /** The text is compared case-insensitively. Only A-Z are folded, and the text is already in lowercase. */
    caseFold: boolean;
    /**
     * The beginning of the pattern that is compared as it is, without wildcards.
     * `**` just after it is handled like `**` after a slash, as Git does for the part of a pattern
     * that follows the beginning without wildcards.
     */
    literalPrefix?: string;
};

const isAscii = (value: string): boolean => {
    for (let index = 0; index < value.length; index++) {
        if (value.charCodeAt(index) > 127) return false;
    }
    return true;
};

let encoder: TextEncoder | undefined;
/**
 * Convert a string to a string that has one character for each byte of its UTF-8 form.
 * An ASCII string is returned as it is.
 */
export const toByteString = (value: string): string => {
    if (isAscii(value)) {
        return value;
    }
    encoder ??= new TextEncoder();
    let result = "";
    for (const byte of encoder.encode(value)) {
        result += String.fromCharCode(byte);
    }
    return result;
};

const isUpper = (c: number): boolean => c >= 65 && c <= 90;
const isLower = (c: number): boolean => c >= 97 && c <= 122;
const isDigit = (c: number): boolean => c >= 48 && c <= 57;
const isAlpha = (c: number): boolean => isUpper(c) || isLower(c);
const isGraph = (c: number): boolean => c >= 33 && c <= 126;

/** The classes of `[[:name:]]`. They are for ASCII, like the C locale. */
const POSIX_CLASSES: Record<string, (c: number, caseFold: boolean) => boolean> = {
    alnum: (c) => isAlpha(c) || isDigit(c),
    alpha: (c) => isAlpha(c),
    blank: (c) => c === 32 || c === 9,
    cntrl: (c) => c < 32 || c === 127,
    digit: (c) => isDigit(c),
    graph: (c) => isGraph(c),
    lower: (c) => isLower(c),
    print: (c) => c >= 32 && c <= 126,
    punct: (c) => isGraph(c) && !isAlpha(c) && !isDigit(c),
    space: (c) => c === 32 || (c >= 9 && c <= 13),
    // The text is in lowercase when the case is folded, so a lowercase letter is an uppercase one too
    upper: (c, caseFold) => isUpper(c) || (caseFold && isLower(c)),
    xdigit: (c) => isDigit(c) || (c >= 65 && c <= 70) || (c >= 97 && c <= 102),
};

/** The bytes that each `[[:name:]]` matches, by `name` and `caseFold` */
const posixClassTables = new Map<string, Uint8Array | null>();
const getPosixClassTable = (name: string, caseFold: boolean): Uint8Array | null => {
    const key = `${caseFold ? "i" : "s"}:${name}`;
    let table = posixClassTables.get(key);
    if (table === undefined) {
        const posixClass = Object.hasOwn(POSIX_CLASSES, name) ? POSIX_CLASSES[name] : undefined;
        if (posixClass === undefined) {
            table = null;
        } else {
            table = new Uint8Array(256);
            for (let code = 1; code < 256; code++) {
                if (posixClass(code, caseFold)) table[code] = 1;
            }
        }
        posixClassTables.set(key, table);
    }
    return table;
};

/**
 * Parse a character class that starts at `pattern[start]` (`[`).
 * Returns the bytes that the class matches (`table[byte] === 1`) and the index after the class,
 * or null if the class is not closed or has an unknown `[:name:]`: such a pattern matches nothing.
 */
const parseClass = (
    pattern: string,
    start: number,
    options: GlobOptions,
): { table: Uint8Array; end: number } | null => {
    const length = pattern.length;
    let index = start + 1;
    const negated = pattern[index] === "!" || pattern[index] === "^";
    if (negated) {
        index++;
    }
    // The bytes that the items of the class match, before the negation
    const members = new Uint8Array(256);
    // The character that can be the start of a range, or -1
    let previous = -1;
    // `]` just after `[` or `[!` is a member of the class
    let isFirst = true;
    for (;;) {
        if (index >= length) {
            return null;
        }
        const character = pattern[index] as string;
        if (character === "]" && !isFirst) {
            break;
        }
        isFirst = false;
        if (character === "\\") {
            index++;
            if (index >= length) return null;
            const code = pattern.charCodeAt(index);
            members[code] = 1;
            previous = code;
            index++;
        } else if (character === "-" && previous !== -1 && index + 1 < length && pattern[index + 1] !== "]") {
            index++;
            if (pattern[index] === "\\") {
                index++;
                if (index >= length) return null;
            }
            const low = previous;
            const high = pattern.charCodeAt(index);
            for (let code = low; code <= high; code++) {
                members[code] = 1;
                // The text is in lowercase when the case is folded, so `[A-Z]` also matches a lowercase letter.
                // A single letter of a class is not folded.
                if (options.caseFold && isUpper(code)) members[code + 32] = 1;
            }
            previous = -1;
            index++;
        } else if (character === "[" && pattern[index + 1] === ":") {
            const nameStart = index + 2;
            const close = pattern.indexOf("]", nameStart);
            if (close === -1) return null;
            if (close - nameStart < 1 || pattern[close - 1] !== ":") {
                // Not `[:name:]`, so `[` is a member of the class
                members[91] = 1;
                previous = 91;
                index++;
            } else {
                const posixTable = getPosixClassTable(pattern.slice(nameStart, close - 1), options.caseFold);
                if (posixTable === null) return null;
                for (let code = 1; code < 256; code++) {
                    if (posixTable[code] === 1) members[code] = 1;
                }
                previous = -1;
                index = close + 1;
            }
        } else {
            const code = pattern.charCodeAt(index);
            members[code] = 1;
            previous = code;
            index++;
        }
    }
    const table = new Uint8Array(256);
    for (let code = 1; code < 256; code++) {
        // A class does not match `/` in a path
        if ((members[code] === 1) !== negated && !(options.pathname && code === 47)) {
            table[code] = 1;
        }
    }
    return { table, end: index + 1 };
};

/** A matcher of a compiled pattern */
export type Glob = {
    /**
     * Test the whole text. The text is converted by {@link toByteString}, and it is in lowercase if `caseFold` is true.
     */
    test(text: string): boolean;
};

// The kinds of the parts of a compiled pattern
/** One byte. The argument is the byte. */
const CHAR = 0;
/** `?`: any one byte, but not `/` in a path */
const ANY_ONE = 1;
/** `[...]`: one byte of the table. The argument is the table. */
const CLASS = 2;
/** `*`: any bytes, but not `/` in a path */
const STAR = 3;
/** `**` as a whole segment at the end, or outside a path: any bytes */
const GLOBSTAR = 4;
/** A segment `**` and the slash after it: nothing, or any bytes that end with `/` */
const GLOBSTAR_DIRECTORIES = 5;

/**
 * Compile a pattern into a matcher for the whole text.
 * Returns null if the pattern matches nothing: it ends with a backslash, or a character class is not valid.
 *
 * The time of a test is limited by (length of the text)² × (length of the pattern) in the worst case,
 * and it is (length of the text) × (length of the pattern) without `**`.
 * When the rest of the pattern does not match, the matcher moves only the last `*` one byte forward,
 * and when that `*` can not move, the last `**`:
 * - The parts between two `*` match a fixed number of bytes. If they match at two places, the next `*`
 *   can also match the bytes between the places, so the first place is enough.
 * - `**` is after a `/` of the pattern (or at its beginning), so the same is true for the parts between two `**`.
 */
export const compileGlob = (rawPattern: string, options: GlobOptions): Glob | null => {
    const { pathname, caseFold } = options;
    const pattern = toByteString(rawPattern);
    const length = pattern.length;
    const kinds: number[] = [];
    const codes: number[] = [];
    const tables: (Uint8Array | undefined)[] = [];
    const push = (kind: number, code: number = 0, table?: Uint8Array): void => {
        kinds.push(kind);
        codes.push(code);
        tables.push(table);
    };
    const literalPrefix = toByteString(options.literalPrefix ?? "");
    for (let index = 0; index < literalPrefix.length; index++) {
        push(CHAR, literalPrefix.charCodeAt(index));
    }
    let index = 0;
    while (index < length) {
        const character = pattern[index] as string;
        if (character === "\\") {
            index++;
            if (index >= length) return null;
            // An escaped letter is not folded
            push(CHAR, pattern.charCodeAt(index));
            index++;
        } else if (character === "?") {
            push(ANY_ONE);
            index++;
        } else if (character === "*") {
            const start = index;
            while (pattern[index] === "*") index++;
            if (!pathname) {
                push(STAR);
            } else if (index - start === 1) {
                push(STAR);
            } else {
                // `**` matches directories only if it is a whole segment of the path
                const isAfterSlash = start === 0 || pattern[start - 1] === "/";
                const next = pattern[index];
                const isBeforeSlash =
                    next === undefined || next === "/" || (next === "\\" && pattern[index + 1] === "/");
                if (!isAfterSlash || !isBeforeSlash) {
                    push(STAR);
                } else if (next === "/") {
                    // `**/` also matches no directory
                    push(GLOBSTAR_DIRECTORIES);
                    index++;
                } else {
                    push(GLOBSTAR);
                }
            }
        } else if (character === "[") {
            const parsed = parseClass(pattern, index, options);
            if (parsed === null) return null;
            push(CLASS, 0, parsed.table);
            index = parsed.end;
        } else {
            const code = pattern.charCodeAt(index);
            push(CHAR, caseFold && isUpper(code) ? code + 32 : code);
            index++;
        }
    }
    const partCount = kinds.length;
    const test = (text: string): boolean => {
        const textLength = text.length;
        let partIndex = 0;
        let textIndex = 0;
        // The part after the last `*`, and the place of the text where the parts after it are tried. -1 if there is no `*` to move
        let starPartIndex = -1;
        let starTextIndex = 0;
        // The same for the last `**`
        let globstarPartIndex = -1;
        let globstarTextIndex = 0;
        let globstarIsDirectories = false;
        for (;;) {
            if (partIndex < partCount) {
                const kind = kinds[partIndex] as number;
                if (kind === STAR) {
                    partIndex++;
                    starPartIndex = partIndex;
                    starTextIndex = textIndex;
                    continue;
                }
                if (kind === GLOBSTAR || kind === GLOBSTAR_DIRECTORIES) {
                    partIndex++;
                    globstarPartIndex = partIndex;
                    globstarTextIndex = textIndex;
                    globstarIsDirectories = kind === GLOBSTAR_DIRECTORIES;
                    starPartIndex = -1;
                    continue;
                }
                if (textIndex < textLength) {
                    const code = text.charCodeAt(textIndex);
                    const matched =
                        kind === CHAR
                            ? code === codes[partIndex]
                            : kind === ANY_ONE
                              ? !pathname || code !== 47
                              : code < 256 && (tables[partIndex] as Uint8Array)[code] === 1;
                    if (matched) {
                        partIndex++;
                        textIndex++;
                        continue;
                    }
                }
            } else if (textIndex === textLength) {
                return true;
            }
            // The rest does not match: move the last `*` one byte forward. `*` does not match `/` in a path
            if (
                starPartIndex !== -1 &&
                starTextIndex < textLength &&
                (!pathname || text.charCodeAt(starTextIndex) !== 47)
            ) {
                starTextIndex++;
                partIndex = starPartIndex;
                textIndex = starTextIndex;
                continue;
            }
            // Or move the last `**` forward
            if (globstarPartIndex !== -1) {
                let nextTextIndex = -1;
                if (globstarIsDirectories) {
                    // to the place after the next `/`
                    const slashIndex = text.indexOf("/", globstarTextIndex);
                    if (slashIndex !== -1) nextTextIndex = slashIndex + 1;
                } else if (globstarTextIndex < textLength) {
                    nextTextIndex = globstarTextIndex + 1;
                }
                if (nextTextIndex !== -1) {
                    globstarTextIndex = nextTextIndex;
                    partIndex = globstarPartIndex;
                    textIndex = nextTextIndex;
                    starPartIndex = -1;
                    continue;
                }
            }
            return false;
        }
    };
    return { test };
};
