/**
 * A matcher for the rules of a `.gitignore` file. It gives the same result as Git.
 *
 * The format is the "PATTERN FORMAT" of https://git-scm.com/docs/gitignore.
 * The details follow `dir.c` and `wildmatch.c` of Git (v2.43.0): how a line is parsed,
 * how a rule without `/` matches the name of an entry, and how a rule with `/` matches the path.
 *
 * This is not a port of the code of Git. The tests compare the results with `git check-ignore`.
 *
 * Most rules of real `.gitignore` files are a file name (`node_modules`), an extension
 * (`*.log`), or a path without wildcards (`build/Release`), so they are matched with string
 * comparisons, like the match strategies of ripgrep's `globset` crate.
 * The other rules are matched with a regular expression of {@link compileGlob}.
 *
 * The matcher tests only the given path. It does not test the parent
 * directories of the path, because a walker does not descend into an
 * ignored directory.
 *
 * A walker tests every entry, so the rules are not tried one by one.
 * A rule for a file name (`node_modules`) or an extension
 * (`*.log`) is found by the name of the entry in a table. A rule for a
 * path (`build/Release`) is for the entries of some
 * directories, so {@link Gitignore.forDirectory} picks the rules for a
 * directory once, and the entries of the other directories do not try it.
 *
 * Git matches case-insensitively when `core.ignoreCase` is true. `git init` sets it for
 * a case-insensitive file system. The `ignoreCase` option is the same switch. Like Git, it folds only A-Z.
 *
 * This module does not depend on Node.js or on other packages.
 */
import { compileGlob, toByteString } from "./glob.js";

/**
 * A segment of a rule: a part of the pattern between `/`, which is matched against a name.
 */
type Segment =
    | { type: "literal"; value: string }
    | { type: "globstar" }
    | { type: "star"; parts: string[] }
    /** A pattern that has `?`, a character class, or an escaped character */
    | { type: "glob"; regexp: RegExp };

type Rule = {
    negative: boolean;
    /** The rule ends with `/`, so it matches only directories. */
    dirOnly: boolean;
    /** The rule has no `/` except at the end, so it matches the name of an entry at any depth. */
    nameOnly: boolean;
    /**
     * The segments of the rule, if each segment can be matched alone.
     * null for a rule with `/` that is matched with the whole path by `pathRegExp`.
     */
    segments: Segment[] | null;
    /** For a rule with `/`: the beginning of the pattern that has no wildcard. The path starts with it. */
    prefix: string;
    /** For a rule with `/` that has no `segments`: the regular expression for the whole path */
    pathRegExp: RegExp | undefined;
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
    rule: Rule;
};

export type GitignoreResult = { ignored: boolean; unignored: boolean };

/**
 * The rules for the entries of a directory. See {@link Gitignore.forDirectory}.
 */
export type DirectoryRules = {
    /** The directory relative to the ignore file's directory, with a trailing `/`. "" for the ignore file's directory. */
    readonly relDir: string;
    /** The rules that are tried in order for an entry of the directory, sorted by `order` in descending order */
    readonly orderedRules: readonly OrderedRule[];
};

export type GitignoreOptions = {
    /**
     * Match case-insensitively, like `core.ignoreCase` of Git. Only A-Z are folded.
     * Default: false
     */
    ignoreCase?: boolean;
};

export type Gitignore = {
    /**
     * Test a path relative to the ignore file's directory, in POSIX form.
     * A directory path ends with `/`.
     */
    test(relPosixPath: string): GitignoreResult;
    /**
     * Pick the rules for the entries of a directory.
     * @param relDir the directory relative to the ignore file's directory in POSIX form, with a trailing `/`.
     *        It is "" for the ignore file's directory.
     */
    forDirectory(relDir: string): DirectoryRules;
    /**
     * Test the entry of the directory of `directoryRules`.
     * It is the same as `test(relDir + name)`, but it does not create the path for most rules.
     * @param foldedName the name of the entry that {@link foldName} converted. A caller that has some matchers converts it once.
     */
    testEntry(directoryRules: DirectoryRules, foldedName: string, isDirectory: boolean): GitignoreResult;
};

const NO_MATCH: GitignoreResult = { ignored: false, unignored: false };
const IGNORED: GitignoreResult = { ignored: true, unignored: false };
const UNIGNORED: GitignoreResult = { ignored: false, unignored: true };

const NON_ASCII = /[^\x00-\x7f]/;
const toAsciiLowerCase = (value: string): string => {
    if (NON_ASCII.test(value)) {
        // `toLowerCase()` also converts a non-ASCII character, and the result can have an ASCII character
        return value.replace(/[A-Z]+/g, (match) => match.toLowerCase());
    }
    return value.toLowerCase();
};

/**
 * Convert a name or a path to the form that the matcher compares: A-Z in lowercase if `ignoreCase` is true.
 */
export const foldName = (value: string, ignoreCase: boolean): string => {
    return ignoreCase ? toAsciiLowerCase(value) : value;
};

// The characters that have a special meaning in a pattern: `is_glob_special()` of Git
const GLOB_SPECIAL = /[*?[\\]/;
/** The length of the beginning of the pattern that has no wildcard: `simple_length()` of Git */
const simpleLength = (pattern: string): number => {
    const index = pattern.search(GLOB_SPECIAL);
    return index === -1 ? pattern.length : index;
};

/**
 * Parse the pattern of a rule without `/`. It matches the name of an entry, and `**` is the same as `*`.
 */
const parseNameSegment = (pattern: string, ignoreCase: boolean): Segment | null => {
    if (!GLOB_SPECIAL.test(pattern)) {
        return { type: "literal", value: foldName(pattern, ignoreCase) };
    }
    if (!/[?[\\]/.test(pattern)) {
        return { type: "star", parts: foldName(pattern, ignoreCase).split(/\*+/) };
    }
    const regexp = compileGlob(pattern, { pathname: false, caseFold: ignoreCase });
    return regexp === null ? null : { type: "glob", regexp };
};

/**
 * Parse a segment of a rule with `/`.
 * Returns null if the segment can not be matched alone:
 * `**` in `a**b` depends on the characters around it, and `/` can be a part of a character class or escaped (`[a/b]`, `a\/b`).
 */
const parsePathSegment = (segment: string, ignoreCase: boolean): Segment | null => {
    if (segment === "") {
        return null;
    }
    if (segment === "**") {
        return { type: "globstar" };
    }
    if (segment.includes("**")) {
        return null;
    }
    if (!GLOB_SPECIAL.test(segment)) {
        return { type: "literal", value: foldName(segment, ignoreCase) };
    }
    if (!/[?[\\]/.test(segment)) {
        return { type: "star", parts: foldName(segment, ignoreCase).split("*") };
    }
    // A segment that is not complete alone ends with a backslash or has a character class that is not closed
    const regexp = compileGlob(segment, { pathname: true, caseFold: ignoreCase });
    return regexp === null ? null : { type: "glob", regexp };
};

/**
 * Remove the trailing spaces that are not escaped with a backslash: `trim_trailing_spaces()` of Git
 */
const trimTrailingSpaces = (line: string): string => {
    if (!line.endsWith(" ")) {
        return line;
    }
    let lastSpace = -1;
    for (let index = 0; index < line.length; index++) {
        const character = line[index];
        if (character === " ") {
            if (lastSpace === -1) lastSpace = index;
        } else {
            if (character === "\\") {
                index++;
                if (index >= line.length) return line;
            }
            lastSpace = -1;
        }
    }
    return lastSpace === -1 ? line : line.slice(0, lastSpace);
};

/**
 * Parse one line of an ignore file: `parse_path_pattern()` of Git.
 * Returns undefined for a blank line, a comment, or a rule that matches nothing.
 * A rule that matches nothing has no effect, because only a matching rule decides.
 */
const parseLine = (rawLine: string, ignoreCase: boolean): Rule | undefined => {
    if (rawLine === "" || rawLine.startsWith("#")) {
        return undefined;
    }
    let pattern = trimTrailingSpaces(rawLine);
    const negative = pattern.startsWith("!");
    if (negative) {
        pattern = pattern.slice(1);
    }
    // The length of the beginning that has no wildcard is counted before the trailing slash is removed
    let prefixLength = simpleLength(pattern);
    const dirOnly = pattern.endsWith("/");
    if (dirOnly) {
        pattern = pattern.slice(0, -1);
    }
    prefixLength = Math.min(prefixLength, pattern.length);
    if (!pattern.includes("/")) {
        if (pattern === "") {
            // No name is empty
            return undefined;
        }
        const segment = parseNameSegment(pattern, ignoreCase);
        if (segment === null) {
            return undefined;
        }
        return { negative, dirOnly, nameOnly: true, segments: [segment], prefix: "", pathRegExp: undefined };
    }
    if (pattern.startsWith("/")) {
        pattern = pattern.slice(1);
        prefixLength--;
    }
    if (pattern === "") {
        return undefined;
    }
    let segments: Segment[] | null = [];
    for (const rawSegment of pattern.split("/")) {
        const segment = parsePathSegment(rawSegment, ignoreCase);
        if (segment === null) {
            segments = null;
            break;
        }
        segments.push(segment);
    }
    const prefix = foldName(pattern.slice(0, prefixLength), ignoreCase);
    if (segments !== null) {
        return { negative, dirOnly, nameOnly: false, segments, prefix, pathRegExp: undefined };
    }
    const pathRegExp = compileGlob(pattern.slice(prefixLength), {
        pathname: true,
        caseFold: ignoreCase,
        literalPrefix: prefix,
    });
    if (pathRegExp === null) {
        return undefined;
    }
    return { negative, dirOnly, nameOnly: false, segments, prefix, pathRegExp };
};

/**
 * Split the content of an ignore file into lines, like `add_patterns_from_buffer()` of Git:
 * a BOM at the beginning and a CR before a line feed are removed.
 */
const splitLines = (content: string): string[] => {
    const text = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
    return text.split("\n").map((line) => (line.endsWith("\r") ? line.slice(0, -1) : line));
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

/**
 * Compile the content of ignore files into a matcher.
 * The rules of a later content, and of a later line, are stronger.
 */
export const compileGitignore = (contents: readonly string[], options: GitignoreOptions = {}): Gitignore => {
    const ignoreCase = options.ignoreCase === true;
    const rules: Rule[] = [];
    for (const content of contents) {
        for (const line of splitLines(content)) {
            const rule = parseLine(line, ignoreCase);
            if (rule !== undefined) {
                rules.push(rule);
            }
        }
    }
    /** Match a segment against a name in the folded form */
    const matchSegment = (segment: Segment, value: string): boolean => {
        switch (segment.type) {
            case "literal":
                return segment.value === value;
            case "star":
                return matchStar(segment.parts, value);
            case "glob":
                return segment.regexp.test(toByteString(value));
            default:
                return true;
        }
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
    // The rule matches the name of the entry at any depth: `name`, or `**/name`
    const getNameSegment = (rule: Rule): Segment | undefined => {
        if (rule.segments === null) {
            return undefined;
        }
        if (rule.nameOnly) {
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
        const rule = rules[order] as Rule;
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
        const globstarIndex = segments === null ? -1 : segments.findIndex((segment) => segment.type === "globstar");
        const hasOneGlobstar =
            segments !== null &&
            globstarIndex !== -1 &&
            globstarIndex === segments.findLastIndex((s) => s.type === "globstar");
        // The directories of the beginning of the pattern that has no wildcard, with a trailing `/`
        const prefix = orderedRule.rule.prefix;
        const prefixDir = prefix.slice(0, prefix.lastIndexOf("/") + 1);
        return { orderedRule, segments, globstarIndex, hasOneGlobstar, prefixDir };
    });
    /**
     * Return the rule for the entries of the directory, or undefined if the rule matches no entry of the directory.
     * The segments before the first `**` match the first names of the directory, or the rule is not for the directory.
     * If only the last segment is left, the rule has it as `nameSegment` and it is tested with the name of the entry.
     */
    const getRuleOfDirectory = (
        pathRule: (typeof pathRules)[number],
        relDir: string,
        dirSegments: string[],
    ): OrderedRule | undefined => {
        const { orderedRule, segments, globstarIndex, hasOneGlobstar, prefixDir } = pathRule;
        if (segments === null) {
            // The rule is tested with the path of the entry, and the path starts with `prefixDir`
            return relDir.startsWith(prefixDir) ? orderedRule : undefined;
        }
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
        const foldedRelDir = foldName(relDir, ignoreCase);
        if (pathRules.length === 0) {
            return foldedRelDir === "" ? rootDirectoryRules : { relDir: foldedRelDir, orderedRules: nameOrderedRules };
        }
        const dirSegments = foldedRelDir === "" ? [] : foldedRelDir.slice(0, -1).split("/");
        // The rules for a path that can match an entry of the directory, sorted by `order` in descending order
        let rulesOfDirectory: OrderedRule[] | undefined;
        for (let index = 0; index < pathRules.length; index++) {
            const rule = getRuleOfDirectory(pathRules[index] as (typeof pathRules)[number], foldedRelDir, dirSegments);
            if (rule !== undefined) {
                (rulesOfDirectory ??= []).push(rule);
            }
        }
        if (rulesOfDirectory === undefined) {
            return { relDir: foldedRelDir, orderedRules: nameOrderedRules };
        }
        if (nameOrderedRules.length === 0) {
            return { relDir: foldedRelDir, orderedRules: rulesOfDirectory };
        }
        return {
            relDir: foldedRelDir,
            orderedRules: [...nameOrderedRules, ...rulesOfDirectory].sort((a, b) => b.order - a.order),
        };
    };
    const testEntry = (directoryRules: DirectoryRules, foldedName: string, isDirectory: boolean): GitignoreResult => {
        if (rules.length === 0) {
            return NO_MATCH;
        }
        const orderedRules = directoryRules.orderedRules;
        // The last matching rule decides: `best` is the matching rule that has the largest `order`
        let best = findResult(nameTable.get(foldedName), isDirectory);
        if (hasExtensionTable) {
            const dotIndex = foldedName.lastIndexOf(".");
            if (dotIndex !== -1) {
                const result = findResult(extensionTable.get(foldedName.slice(dotIndex)), isDirectory);
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
                matched = matchSegment(orderedRule.nameSegment, foldedName);
            } else if (orderedRule.rule.segments === null) {
                matched = (orderedRule.rule.pathRegExp as RegExp).test(
                    toByteString(directoryRules.relDir + foldedName),
                );
            } else {
                values ??= (directoryRules.relDir + foldedName).split("/");
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
        test(relPosixPath: string): GitignoreResult {
            const isDirectory = relPosixPath.endsWith("/");
            const path = isDirectory ? relPosixPath.slice(0, -1) : relPosixPath;
            const slashIndex = path.lastIndexOf("/");
            return testEntry(
                forDirectory(path.slice(0, slashIndex + 1)),
                foldName(path.slice(slashIndex + 1), ignoreCase),
                isDirectory,
            );
        },
        forDirectory,
        testEntry,
    };
};
