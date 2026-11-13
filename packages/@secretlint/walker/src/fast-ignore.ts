/**
 * A matcher for simple `.gitignore` rules that does not use regular expressions.
 *
 * Most `.gitignore` rules are a file name (`node_modules`), an extension
 * (`*.log`), or a path without wildcards (`build/Release`). This module
 * matches them with string comparisons, like the match strategies of
 * ripgrep's `globset` crate. When a rule uses anything else (`?`, `[...]`,
 * `\`, spaces, non-ASCII characters, ...), {@link compileFastIgnore}
 * returns null and the caller uses node-ignore for the rules.
 *
 * The matcher tests only the given path. It does not test the parent
 * directories of the path, because the walker does not descend into an
 * ignored directory.
 *
 * The walker tests every entry, so the rules are not tried one by one.
 * A rule for a file name (`node_modules`) or an extension
 * (`*.log`) is found by the name of the entry in a table. A rule for a
 * path (`build/Release`) is for the entries of some
 * directories, so {@link FastIgnore.forDirectory} picks the rules for a
 * directory once, and the entries of the other directories do not try it.
 *
 * Like node-ignore's default (`ignoreCase: true`), the matching is ASCII
 * case-insensitive. The rules are ASCII only, and a non-ASCII character
 * never matches an ASCII character in a case-insensitive regular expression
 * without the `u` flag, so lowercasing only A-Z gives the same result.
 */

/** A segment is a literal string, `**`, or a pattern that has `*` in it. */
type Segment = { type: "literal"; value: string } | { type: "globstar" } | { type: "star"; parts: string[] };

type FastRule = {
    negative: boolean;
    /** The rule ends with `/`, so it matches only directories. */
    dirOnly: boolean;
    /** The rule has a `/` at the beginning or in the middle, so it matches the path from the ignore file's directory. */
    anchored: boolean;
    segments: Segment[];
};

/**
 * The part of a rule that decides the result. `order` is the position of the rule in the ignore files:
 * the matching rule that has the largest `order` decides.
 */
type RuleResult = { order: number; negative: boolean; dirOnly: boolean };
/** A rule that is tried in order, because a table can not find it by the name of the entry */
type OrderedRule = RuleResult & {
    /** The segment that matches the name of the entry. undefined if the rule matches the path */
    nameSegment: Segment | undefined;
    rule: FastRule;
};

export type FastIgnoreResult = { ignored: boolean; unignored: boolean };

/**
 * The rules for the entries of a directory. See {@link FastIgnore.forDirectory}.
 */
export type DirectoryRules = {
    /** The directory relative to the ignore file's directory in lowercase, with a trailing `/`. "" for the ignore file's directory. */
    readonly relDir: string;
    /** The rules that are tried in order for an entry of the directory, sorted by `order` in descending order */
    readonly orderedRules: readonly OrderedRule[];
};

export type FastIgnore = {
    /**
     * Test a path relative to the ignore file's directory, in POSIX form.
     * A directory path ends with `/`, like node-ignore's `test()`.
     */
    test(relPosixPath: string): FastIgnoreResult;
    /**
     * Pick the rules for the entries of a directory.
     * @param relDir the directory relative to the ignore file's directory in POSIX form, with a trailing `/`.
     *        It is "" for the ignore file's directory.
     */
    forDirectory(relDir: string): DirectoryRules;
    /**
     * Test the entry `name` of the directory of `directoryRules`.
     * It is the same as `test(relDir + name)`, but it does not create the path for most rules.
     */
    testEntry(directoryRules: DirectoryRules, name: string, isDirectory: boolean): FastIgnoreResult;
};

const NO_MATCH: FastIgnoreResult = { ignored: false, unignored: false };
const IGNORED: FastIgnoreResult = { ignored: true, unignored: false };
const UNIGNORED: FastIgnoreResult = { ignored: false, unignored: true };

// Characters that have no special meaning in a gitignore rule.
const SAFE_SEGMENT = /^[A-Za-z0-9._\-@+~*]+$/;
const ASCII_UPPER = /[A-Z]/;

export const toAsciiLowerCase = (value: string): string => {
    return ASCII_UPPER.test(value) ? value.replace(/[A-Z]+/g, (match) => match.toLowerCase()) : value;
};

const parseSegment = (segment: string): Segment | null => {
    if (!SAFE_SEGMENT.test(segment) || segment === "." || segment === "..") {
        return null;
    }
    if (segment === "**") {
        return { type: "globstar" };
    }
    if (!segment.includes("*")) {
        return { type: "literal", value: toAsciiLowerCase(segment) };
    }
    // `**` inside a segment, like `a**b`, is not supported
    if (segment.includes("**")) {
        return null;
    }
    return { type: "star", parts: toAsciiLowerCase(segment).split("*") };
};

/**
 * Parse one line of an ignore file.
 * Returns undefined for a blank line or a comment, and null for a rule that is not supported.
 */
const parseLine = (line: string): FastRule | undefined | null => {
    if (line === "" || line.startsWith("#")) {
        return undefined;
    }
    let body = line;
    const negative = body.startsWith("!");
    if (negative) {
        body = body.slice(1);
    }
    const dirOnly = body.endsWith("/");
    if (dirOnly) {
        body = body.slice(0, -1);
    }
    const leadingSlash = body.startsWith("/");
    if (leadingSlash) {
        body = body.slice(1);
    }
    if (body === "") {
        return null;
    }
    const rawSegments = body.split("/");
    const anchored = leadingSlash || rawSegments.length > 1;
    const segments: Segment[] = [];
    for (const rawSegment of rawSegments) {
        const segment = parseSegment(rawSegment);
        if (segment === null) {
            return null;
        }
        segments.push(segment);
    }
    if (!anchored && segments[0]?.type === "globstar") {
        // a lone `**`
        return null;
    }
    return { negative, dirOnly, anchored, segments };
};

const matchStar = (parts: string[], value: string): boolean => {
    const first = parts[0] as string;
    const last = parts[parts.length - 1] as string;
    if (value.length < first.length + last.length || !value.startsWith(first) || !value.endsWith(last)) {
        return false;
    }
    let position = first.length;
    const end = value.length - last.length;
    for (let index = 1; index < parts.length - 1; index++) {
        const part = parts[index] as string;
        const found = value.indexOf(part, position);
        if (found === -1 || found + part.length > end) {
            return false;
        }
        position = found + part.length;
    }
    return true;
};

const matchSegment = (segment: Segment, value: string): boolean => {
    if (segment.type === "literal") {
        return segment.value === value;
    }
    if (segment.type === "star") {
        return matchStar(segment.parts, value);
    }
    return true;
};

/**
 * Match the rule segments against the path segments.
 * `**` matches zero or more segments, except that a trailing `**` matches one or more segments.
 */
const matchSegments = (segments: Segment[], si: number, values: string[], vi: number): boolean => {
    while (si < segments.length) {
        const segment = segments[si] as Segment;
        if (segment.type === "globstar") {
            if (si === segments.length - 1) {
                return vi < values.length;
            }
            for (let next = vi; next <= values.length; next++) {
                if (matchSegments(segments, si + 1, values, next)) {
                    return true;
                }
            }
            return false;
        }
        if (vi >= values.length || !matchSegment(segment, values[vi] as string)) {
            return false;
        }
        si++;
        vi++;
    }
    return vi === values.length;
};

/**
 * Compile the content of ignore files into a matcher.
 * Returns null when a rule is not supported, so the caller can use node-ignore instead.
 */
export const compileFastIgnore = (contents: readonly string[]): FastIgnore | null => {
    const rules: FastRule[] = [];
    for (const content of contents) {
        for (const line of content.split(/\r?\n/)) {
            const rule = parseLine(line);
            if (rule === undefined) {
                continue;
            }
            if (rule === null) {
                return null;
            }
            rules.push(rule);
        }
    }
    // The rule matches the name of the entry at any depth: `name`, or `**/name`
    const getNameSegment = (rule: FastRule): Segment | undefined => {
        if (!rule.anchored) {
            return rule.segments[0];
        }
        const [first, second] = rule.segments;
        if (rule.segments.length === 2 && first?.type === "globstar" && second && second.type !== "globstar") {
            return second;
        }
        return undefined;
    };
    // `*.ext` is found by the extension, if the extension has no other dot: `*.tar.gz` is not
    const getExtension = (segment: Segment): string | undefined => {
        if (segment.type !== "star" || segment.parts.length !== 2 || segment.parts[0] !== "") {
            return undefined;
        }
        const extension = segment.parts[1] as string;
        return extension.lastIndexOf(".") === 0 && extension.length > 1 ? extension : undefined;
    };
    // The results in each list are sorted by `order` in descending order
    const nameTable = new Map<string, RuleResult[]>();
    const extensionTable = new Map<string, RuleResult[]>();
    // The rules that match the name of the entry, but are not in a table: `foo*`
    const nameOrderedRules: OrderedRule[] = [];
    // The rules that match the path: `build/Release`, `packages/*/lib`, `test/**/fixtures`
    const pathOrderedRules: OrderedRule[] = [];
    const addToTable = (table: Map<string, RuleResult[]>, key: string, result: RuleResult): void => {
        const results = table.get(key);
        if (results) {
            results.push(result);
        } else {
            table.set(key, [result]);
        }
    };
    for (let order = rules.length - 1; order >= 0; order--) {
        const rule = rules[order] as FastRule;
        const result: RuleResult = { order, negative: rule.negative, dirOnly: rule.dirOnly };
        const nameSegment = getNameSegment(rule);
        const extension = nameSegment && getExtension(nameSegment);
        if (nameSegment?.type === "literal") {
            addToTable(nameTable, nameSegment.value, result);
        } else if (extension !== undefined) {
            addToTable(extensionTable, extension, result);
        } else if (nameSegment !== undefined) {
            nameOrderedRules.push({ ...result, nameSegment, rule });
        } else {
            pathOrderedRules.push({ ...result, nameSegment: undefined, rule });
        }
    }
    const hasExtensionTable = extensionTable.size > 0;
    /**
     * Return the first result of the list that is for the entry. It has the largest `order` of them.
     */
    const findResult = (results: RuleResult[] | undefined, isDirectory: boolean): RuleResult | undefined => {
        if (results === undefined) {
            return undefined;
        }
        for (let index = 0; index < results.length; index++) {
            const result = results[index] as RuleResult;
            if (!result.dirOnly || isDirectory) {
                return result;
            }
        }
        return undefined;
    };
    // `**` matches any name, so a rule that matches all entries of a directory has it as `nameSegment`
    const ANY_NAME: Segment = { type: "globstar" };
    const pathRules = pathOrderedRules.map((orderedRule) => {
        const segments = orderedRule.rule.segments;
        const globstarIndex = segments.findIndex((segment) => segment.type === "globstar");
        const hasOneGlobstar =
            globstarIndex !== -1 && globstarIndex === segments.findLastIndex((s) => s.type === "globstar");
        return { orderedRule, segments, globstarIndex, hasOneGlobstar };
    });
    /**
     * Return the rule for the entries of the directory, or undefined if the rule matches no entry of the directory.
     * The segments before the first `**` match the first names of the directory, or the rule is not for the directory.
     * If only the last segment is left, the rule has it as `nameSegment` and it is tested with the name of the entry.
     */
    const getRuleOfDirectory = (
        pathRule: (typeof pathRules)[number],
        dirSegments: string[],
    ): OrderedRule | undefined => {
        const { orderedRule, segments, globstarIndex, hasOneGlobstar } = pathRule;
        const lastIndex = segments.length - 1;
        // The number of the segments that match the directory one by one
        const prefixLength = globstarIndex === -1 ? lastIndex : globstarIndex;
        if (globstarIndex === -1 ? dirSegments.length !== prefixLength : dirSegments.length < prefixLength) {
            return undefined;
        }
        for (let index = 0; index < prefixLength; index++) {
            if (!matchSegment(segments[index] as Segment, dirSegments[index] as string)) {
                return undefined;
            }
        }
        if (globstarIndex === -1) {
            // `a/b`: the entry `b` of the directory `a/`
            return { ...orderedRule, nameSegment: segments[lastIndex] };
        }
        if (hasOneGlobstar && globstarIndex === lastIndex) {
            // `a/**`: all entries under the directory `a/`
            return { ...orderedRule, nameSegment: ANY_NAME };
        }
        if (hasOneGlobstar && globstarIndex === lastIndex - 1) {
            // `a/**/b`: the entry `b` under the directory `a/`
            return { ...orderedRule, nameSegment: segments[lastIndex] };
        }
        // The rule is tested with the path of the entry
        return orderedRule;
    };
    const rootDirectoryRules: DirectoryRules = { relDir: "", orderedRules: nameOrderedRules };
    const forDirectory = (relDir: string): DirectoryRules => {
        const lowerRelDir = toAsciiLowerCase(relDir);
        if (pathRules.length === 0) {
            return lowerRelDir === "" ? rootDirectoryRules : { relDir: lowerRelDir, orderedRules: nameOrderedRules };
        }
        const dirSegments = lowerRelDir === "" ? [] : lowerRelDir.slice(0, -1).split("/");
        // The rules for a path that can match an entry of the directory, sorted by `order` in descending order
        let rulesOfDirectory: OrderedRule[] | undefined;
        for (let index = 0; index < pathRules.length; index++) {
            const rule = getRuleOfDirectory(pathRules[index] as (typeof pathRules)[number], dirSegments);
            if (rule !== undefined) {
                (rulesOfDirectory ??= []).push(rule);
            }
        }
        if (rulesOfDirectory === undefined) {
            return { relDir: lowerRelDir, orderedRules: nameOrderedRules };
        }
        if (nameOrderedRules.length === 0) {
            return { relDir: lowerRelDir, orderedRules: rulesOfDirectory };
        }
        return {
            relDir: lowerRelDir,
            orderedRules: [...nameOrderedRules, ...rulesOfDirectory].sort((a, b) => b.order - a.order),
        };
    };
    const testEntry = (directoryRules: DirectoryRules, name: string, isDirectory: boolean): FastIgnoreResult => {
        if (rules.length === 0) {
            return NO_MATCH;
        }
        const orderedRules = directoryRules.orderedRules;
        const lowerName = toAsciiLowerCase(name);
        // The last matching rule decides: `best` is the matching rule that has the largest `order`
        let best = findResult(nameTable.get(lowerName), isDirectory);
        if (hasExtensionTable) {
            const dotIndex = lowerName.lastIndexOf(".");
            if (dotIndex !== -1) {
                const result = findResult(extensionTable.get(lowerName.slice(dotIndex)), isDirectory);
                if (result !== undefined && (best === undefined || result.order > best.order)) {
                    best = result;
                }
            }
        }
        let values: string[] | undefined;
        for (let index = 0; index < orderedRules.length; index++) {
            const orderedRule = orderedRules[index] as OrderedRule;
            if (best !== undefined && orderedRule.order < best.order) {
                break;
            }
            if (orderedRule.dirOnly && !isDirectory) {
                continue;
            }
            let matched: boolean;
            if (orderedRule.nameSegment !== undefined) {
                matched = matchSegment(orderedRule.nameSegment, lowerName);
            } else {
                values ??= (directoryRules.relDir + lowerName).split("/");
                matched = matchSegments(orderedRule.rule.segments, 0, values, 0);
            }
            if (matched) {
                best = orderedRule;
                break;
            }
        }
        if (best === undefined) {
            return NO_MATCH;
        }
        return best.negative ? UNIGNORED : IGNORED;
    };
    return {
        test(relPosixPath: string): FastIgnoreResult {
            const isDirectory = relPosixPath.endsWith("/");
            const path = isDirectory ? relPosixPath.slice(0, -1) : relPosixPath;
            const slashIndex = path.lastIndexOf("/");
            return testEntry(forDirectory(path.slice(0, slashIndex + 1)), path.slice(slashIndex + 1), isDirectory);
        },
        forDirectory,
        testEntry,
    };
};
