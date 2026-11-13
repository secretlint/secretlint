/**
 * Compile a pattern of `.gitignore` into a regular expression that gives the same result as Git.
 *
 * The syntax is the one of https://git-scm.com/docs/gitignore: `*`, `?`, `[...]`, `\`, and `**`.
 * The details that the manual leaves to fnmatch(3) are decided by what Git does:
 * the tests compare this module with the results of `git check-ignore`.
 *
 * Git matches bytes: `?` and a character class match one byte of UTF-8, and only A-Z are folded.
 * So a pattern or a text that has a non-ASCII character is converted to a string that has
 * one character for each byte ({@link toByteString}), and the regular expression has no `u` flag.
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

const hex = (code: number): string => `\\x${code.toString(16).padStart(2, "0")}`;
/** A character as a regular expression that matches only it */
const literal = (character: string): string => hex(character.charCodeAt(0));

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

type ClassItem = (c: number) => boolean;

/**
 * Parse a character class that starts at `pattern[start]` (`[`).
 * Returns the regular expression of the class and the index after the class,
 * or null if the class is not closed or has an unknown `[:name:]`: such a pattern matches nothing.
 */
const parseClass = (pattern: string, start: number, options: GlobOptions): { source: string; end: number } | null => {
    const length = pattern.length;
    let index = start + 1;
    const negated = pattern[index] === "!" || pattern[index] === "^";
    if (negated) {
        index++;
    }
    const items: ClassItem[] = [];
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
            items.push((c) => c === code);
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
            // The text is in lowercase when the case is folded, so `[A-Z]` also matches a lowercase letter.
            // A single letter of a class is not folded.
            items.push(
                (c) => (c >= low && c <= high) || (options.caseFold && isLower(c) && c - 32 >= low && c - 32 <= high),
            );
            previous = -1;
            index++;
        } else if (character === "[" && pattern[index + 1] === ":") {
            const nameStart = index + 2;
            const close = pattern.indexOf("]", nameStart);
            if (close === -1) return null;
            if (close - nameStart < 1 || pattern[close - 1] !== ":") {
                // Not `[:name:]`, so `[` is a member of the class
                items.push((c) => c === 91);
                previous = 91;
                index++;
            } else {
                const posixClass = POSIX_CLASSES[pattern.slice(nameStart, close - 1)];
                if (posixClass === undefined) return null;
                items.push((c) => posixClass(c, options.caseFold));
                previous = -1;
                index = close + 1;
            }
        } else {
            const code = pattern.charCodeAt(index);
            items.push((c) => c === code);
            previous = code;
            index++;
        }
    }
    // The class as ranges of the bytes that it matches
    let source = "";
    let rangeStart = -1;
    for (let code = 1; code <= 256; code++) {
        const matched =
            code < 256 &&
            items.some((item) => item(code)) !== negated &&
            // A class does not match `/` in a path
            !(options.pathname && code === 47);
        if (matched && rangeStart === -1) {
            rangeStart = code;
        } else if (!matched && rangeStart !== -1) {
            source += rangeStart === code - 1 ? hex(rangeStart) : `${hex(rangeStart)}-${hex(code - 1)}`;
            rangeStart = -1;
        }
    }
    return { source: source === "" ? "[^\\s\\S]" : `[${source}]`, end: index + 1 };
};

const ANY = "[\\s\\S]";
const NOT_SLASH = "[^/]";

/**
 * Compile a pattern into a regular expression for the whole text.
 * Test it with a text that {@link toByteString} converted, in lowercase if `caseFold` is true.
 * Returns null if the pattern matches nothing: it ends with a backslash, or a character class is not valid.
 */
export const compileGlob = (rawPattern: string, options: GlobOptions): RegExp | null => {
    const { pathname, caseFold } = options;
    const pattern = toByteString(rawPattern);
    const length = pattern.length;
    let source = "^";
    for (const character of toByteString(options.literalPrefix ?? "")) {
        source += literal(character);
    }
    let index = 0;
    while (index < length) {
        const character = pattern[index] as string;
        if (character === "\\") {
            index++;
            if (index >= length) return null;
            // An escaped letter is not folded
            source += literal(pattern[index] as string);
            index++;
        } else if (character === "?") {
            source += pathname ? NOT_SLASH : ANY;
            index++;
        } else if (character === "*") {
            const start = index;
            while (pattern[index] === "*") index++;
            if (!pathname) {
                source += `${ANY}*`;
            } else if (index - start === 1) {
                source += `${NOT_SLASH}*`;
            } else {
                // `**` matches directories only if it is a whole segment of the path
                const isAfterSlash = start === 0 || pattern[start - 1] === "/";
                const next = pattern[index];
                const isBeforeSlash =
                    next === undefined || next === "/" || (next === "\\" && pattern[index + 1] === "/");
                if (!isAfterSlash || !isBeforeSlash) {
                    source += `${NOT_SLASH}*`;
                } else if (next === "/") {
                    // `**/` also matches no directory
                    source += `(?:${ANY}*/)?`;
                    index++;
                } else {
                    source += `${ANY}*`;
                }
            }
        } else if (character === "[") {
            const parsed = parseClass(pattern, index, options);
            if (parsed === null) return null;
            source += parsed.source;
            index = parsed.end;
        } else {
            const code = pattern.charCodeAt(index);
            source += hex(caseFold && isUpper(code) ? code + 32 : code);
            index++;
        }
    }
    return new RegExp(`${source}$`);
};
