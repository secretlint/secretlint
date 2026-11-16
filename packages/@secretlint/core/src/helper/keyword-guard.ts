/**
 * The guard of a keyword: a condition on the characters that follow the keyword.
 *
 * A pattern declares a guarded keyword as `{ keyword: "00", after: "[A-Za-z0-9_-]{40,}" }`.
 * `after` is one set of ASCII characters and one least count, in a small subset of the syntax of regular expressions:
 *
 * - The set is `[` and `]` around characters and ranges such as `a-z`.
 *   `\` is written only before `\` and `]`. A `-` as a character is the last item.
 * - The count is `{n,}`, and `n` is from 1 to 255.
 *
 * The syntax is strict: a guard has one way to write it, apart from the order of the items of the set.
 * Anything else is an error, so that a form of a newer secretlint is never read in another way.
 * The set is compared with the content as it is written: `[a-f]` does not have `A`.
 *
 * This module has no dependency, because the core also runs in browsers.
 */
const ASCII_SIZE = 128;
/**
 * The scan reads at most this number of characters after a keyword
 */
export const MAX_GUARD_MIN = 255;

/**
 * A parsed guard. It is plain data, so it can be sent to a worker thread.
 */
export type KeywordGuard = {
    /**
     * The characters of the set, sorted, without duplicates
     */
    readonly chars: string;
    /**
     * The least count of the characters of the set after the keyword
     */
    readonly min: number;
};
/**
 * A keyword of the keyword matcher: a keyword, and its guard if it has one
 */
export type GuardedKeyword = {
    /**
     * The keyword as the pattern declares it
     */
    readonly keyword: string;
    readonly after: string;
    readonly guard: KeywordGuard;
};

const isAscii = (text: string): boolean => {
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) >= ASCII_SIZE) {
            return false;
        }
    }
    return true;
};

const SHORT_CLASSES: Record<string, string> = {
    d: "0-9",
    w: "A-Za-z0-9_",
};

/**
 * Parse the set at the start of `after`.
 * Return the characters of the set and the index after `]`.
 */
const parseSet = (after: string): { chars: string; end: number } => {
    if (after[0] !== "[") {
        throw new Error("It should start with a set of characters, such as `[A-Za-z0-9]`.");
    }
    if (after[1] === "^") {
        throw new Error("A set with `^` is not supported. Write the characters that follow the keyword.");
    }
    // Read the items of the set: a character, or "-" between two characters
    const items: string[] = [];
    let index = 1;
    for (; ; index++) {
        const char = after[index];
        if (char === undefined) {
            throw new Error("The set has no `]`.");
        }
        if (char === "]") {
            break;
        }
        if (char === "\\") {
            const escaped = after[index + 1];
            if (escaped === "\\" || escaped === "]") {
                // "\\" marks a character, so that it is not read as "-" of a range
                items.push(`\\${escaped}`);
                index++;
                continue;
            }
            const shortClass = escaped === undefined ? undefined : SHORT_CLASSES[escaped];
            if (shortClass !== undefined) {
                throw new Error(`\`\\${escaped}\` is not supported. Write \`${shortClass}\`.`);
            }
            if (escaped === "-") {
                throw new Error("`\\-` is not supported. Write `-` as the last item of the set.");
            }
            throw new Error(
                `\`\\${escaped ?? ""}\` is not supported. In a set, \`\\\` is written only before \`\\\` and \`]\`.`,
            );
        }
        items.push(char);
    }
    const end = index + 1;
    const codes: number[] = [];
    const add = (code: number): void => {
        if (codes.includes(code)) {
            throw new Error(`The set has ${JSON.stringify(String.fromCharCode(code))} twice.`);
        }
        codes.push(code);
    };
    const codeOf = (item: string): number => item.charCodeAt(item.length - 1);
    for (let i = 0; i < items.length; i++) {
        const item = items[i] as string;
        if (item === "-") {
            if (i !== items.length - 1) {
                throw new Error(
                    "A `-` that is a character of the set should be the last item, such as `[A-Za-z0-9_-]`.",
                );
            }
            add(codeOf(item));
            continue;
        }
        const next = items[i + 1];
        const last = items[i + 2];
        if (next === "-" && last !== undefined) {
            if (last === "-") {
                throw new Error("A range can not end with `-`.");
            }
            const from = codeOf(item);
            const to = codeOf(last);
            if (from >= to) {
                throw new Error(`The range \`${item}-${last}\` is not in order.`);
            }
            for (let code = from; code <= to; code++) {
                add(code);
            }
            i += 2;
            continue;
        }
        add(codeOf(item));
    }
    if (codes.length === 0) {
        throw new Error("The set is empty.");
    }
    codes.sort((a, b) => a - b);
    return { chars: String.fromCharCode(...codes), end };
};

/**
 * Parse the count after the set. It is `{n,}`.
 */
const parseCount = (count: string): number => {
    const setExample = "[...]";
    if (count === "+") {
        throw new Error(`\`+\` is not supported. Write \`${setExample}{1,}\`.`);
    }
    const alwaysTrue = (): never => {
        throw new Error(`\`${count}\` makes the guard always true. The count should be \`{n,}\`, and n is 1 or more.`);
    };
    if (count === "*" || count === "?") {
        return alwaysTrue();
    }
    // `{n}`, `{n,}`, or `{n,m}`. Each part of the regular expression can match in one way only
    const matched = /^\{(\d+)(,(\d*))?\}$/.exec(count);
    if (!matched) {
        if (count === "") {
            throw new Error("The set should be followed by a count, such as `{40,}`.");
        }
        throw new Error(`\`${count}\` is not supported. After the set, only a count such as \`{40,}\` is supported.`);
    }
    const least = matched[1] as string;
    if (Number(least) === 0) {
        return alwaysTrue();
    }
    if (matched[2] === undefined) {
        throw new Error(
            `\`${count}\` is not supported, because the guard does not check where the characters end. Write \`{${least},}\`.`,
        );
    }
    if (matched[3] !== "") {
        throw new Error(
            `\`${count}\` is not supported, because the guard does not check the most count. Write \`{${least},}\`.`,
        );
    }
    if (least.startsWith("0")) {
        throw new Error(`\`${count}\` is not supported. Write the count without \`0\` at its start.`);
    }
    const min = Number(least);
    if (min > MAX_GUARD_MIN) {
        throw new Error(`The count should be ${MAX_GUARD_MIN} or less.`);
    }
    return min;
};

/**
 * Parse `after` of a keyword object.
 * It throws an error that tells what is not supported, and the supported form if there is one.
 */
export const parseKeywordGuard = (after: string): KeywordGuard => {
    if (!isAscii(after)) {
        throw new Error("It should have only ASCII characters.");
    }
    const { chars, end } = parseSet(after);
    return { chars, min: parseCount(after.slice(end)) };
};

const KEYWORD_OBJECT_PROPERTIES: ReadonlySet<string> = new Set(["keyword", "after"]);
/**
 * Read a keyword object `{ keyword, after }` of `keywords` of a pattern.
 * It throws if the object is not a guarded keyword that this version of secretlint supports.
 * The message of the error does not have the rule: the caller adds it.
 */
export const parseKeywordObject = (item: object): GuardedKeyword => {
    const describe = (): string => {
        try {
            return JSON.stringify(item) ?? String(item);
        } catch {
            return String(item);
        }
    };
    const fail = (reason: string, cause?: unknown): never => {
        throw new Error(
            `The keyword ${describe()} is not supported. ${reason}
A keyword with a guard is written as { keyword: "00", after: "[A-Za-z0-9_-]{40,}" }.`,
            cause === undefined ? undefined : { cause },
        );
    };
    const unknownProperties = Object.keys(item).filter((property) => !KEYWORD_OBJECT_PROPERTIES.has(property));
    if (unknownProperties.length > 0) {
        return fail(
            `It has unknown properties: ${unknownProperties.join(", ")}. If they are properties of a newer secretlint, please update secretlint.`,
        );
    }
    const { keyword, after } = item as { keyword?: unknown; after?: unknown };
    if (typeof keyword !== "string" || keyword.length === 0 || !isAscii(keyword)) {
        return fail("`keyword` should be a non-empty ASCII string.");
    }
    if (after === undefined) {
        return fail(
            `\`after\` is required. A keyword without a guard is written as the string ${JSON.stringify(keyword)}.`,
        );
    }
    if (typeof after !== "string") {
        return fail("`after` should be a string.");
    }
    try {
        return { keyword, after, guard: parseKeywordGuard(after) };
    } catch (error) {
        return fail(`\`after\`: ${error instanceof Error ? error.message : String(error)}`, error);
    }
};

/**
 * Create the table of the set: `table[code] === 1` if the character is in the set.
 * It has 256 entries, so a byte that is not ASCII is never in the set.
 */
export const createGuardTable = (guard: KeywordGuard): Uint8Array => {
    const table = new Uint8Array(256);
    for (let i = 0; i < guard.chars.length; i++) {
        table[guard.chars.charCodeAt(i)] = 1;
    }
    return table;
};
/**
 * Return true if the `min` bytes from `start` are all in the set.
 * It reads at most `min` bytes, and it fails at the end of the bytes.
 */
export const isGuardMetInBytes = (bytes: Uint8Array, start: number, table: Uint8Array, min: number): boolean => {
    const end = start + min;
    if (end > bytes.length) {
        return false;
    }
    for (let i = start; i < end; i++) {
        if (table[bytes[i] as number] !== 1) {
            return false;
        }
    }
    return true;
};
/**
 * Return true if the `min` characters from `start` are all in the set.
 * A character that is not ASCII is never in the set, so the result is the same as for the UTF-8 bytes of the text.
 */
export const isGuardMetInText = (text: string, start: number, table: Uint8Array, min: number): boolean => {
    const end = start + min;
    if (end > text.length) {
        return false;
    }
    for (let i = start; i < end; i++) {
        // `table[code]` is undefined for a code over 255
        if (table[text.charCodeAt(i)] !== 1) {
            return false;
        }
    }
    return true;
};
/**
 * Write the guard in the syntax of `after`, with the keyword before it: `00 [0-9A-Za-z_-]{40,}`.
 * It is the name of a guarded keyword in the profile.
 */
export const formatGuardedKeyword = (keyword: string, guard: KeywordGuard): string => {
    const codes = Array.from(guard.chars, (char) => char.charCodeAt(0)).filter((code) => code !== 0x2d);
    const write = (code: number): string => {
        const char = String.fromCharCode(code);
        return char === "\\" || char === "]" ? `\\${char}` : char;
    };
    let set = "";
    for (let i = 0; i < codes.length; ) {
        let end = i;
        while (end + 1 < codes.length && codes[end + 1] === (codes[end] as number) + 1) {
            end++;
        }
        // three or more characters in a row are written as a range
        if (end - i >= 2) {
            set += `${write(codes[i] as number)}-${write(codes[end] as number)}`;
        } else {
            for (let j = i; j <= end; j++) {
                set += write(codes[j] as number);
            }
        }
        i = end + 1;
    }
    return `${keyword} [${set}${guard.chars.includes("-") ? "-" : ""}]{${guard.min},}`;
};
/**
 * The key of a guard: two guards with the same key check the same thing
 */
export const keywordGuardKey = (guard: KeywordGuard | undefined): string => {
    return guard === undefined ? "" : `${guard.min}:${guard.chars}`;
};
