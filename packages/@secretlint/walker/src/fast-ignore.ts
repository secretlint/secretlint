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
    /** The lowercased path when the rule is anchored and has only literal segments */
    literalPath: string | undefined;
};

export type FastIgnoreResult = { ignored: boolean; unignored: boolean };

export type FastIgnore = {
    /**
     * Test a path relative to the ignore file's directory, in POSIX form.
     * A directory path ends with `/`, like node-ignore's `test()`.
     */
    test(relPosixPath: string): FastIgnoreResult;
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
    const literalPath =
        anchored && segments.every((segment) => segment.type === "literal")
            ? segments.map((segment) => (segment as { value: string }).value).join("/")
            : undefined;
    return { negative, dirOnly, anchored, segments, literalPath };
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
    return {
        test(relPosixPath: string): FastIgnoreResult {
            if (rules.length === 0) {
                return NO_MATCH;
            }
            const isDir = relPosixPath.endsWith("/");
            const path = toAsciiLowerCase(isDir ? relPosixPath.slice(0, -1) : relPosixPath);
            const slashIndex = path.lastIndexOf("/");
            const basename = slashIndex === -1 ? path : path.slice(slashIndex + 1);
            let values: string[] | undefined;
            // The last matching rule decides
            for (let index = rules.length - 1; index >= 0; index--) {
                const rule = rules[index] as FastRule;
                if (rule.dirOnly && !isDir) {
                    continue;
                }
                let matched: boolean;
                if (rule.literalPath !== undefined) {
                    matched = rule.literalPath === path;
                } else if (rule.anchored) {
                    values ??= path.split("/");
                    matched = matchSegments(rule.segments, 0, values, 0);
                } else {
                    matched = matchSegment(rule.segments[0] as Segment, basename);
                }
                if (matched) {
                    return rule.negative ? UNIGNORED : IGNORED;
                }
            }
            return NO_MATCH;
        },
    };
};
