const DYNAMIC_RE = /[*?[\]{}]/;

export const isDynamicPattern = (pattern: string): boolean => {
    return DYNAMIC_RE.test(pattern);
};

/**
 * Split a glob pattern into a static walk root and the remaining match pattern.
 *
 * Examples:
 *   "src/**\/*.ini" → { rootDir: "src", matchPattern: "**\/*.ini" }
 *   "**\/*.ini"     → { rootDir: "",    matchPattern: "**\/*.ini" }
 *   "src/foo.ts"    → { rootDir: "src", matchPattern: "foo.ts" }
 *
 * The walker uses `rootDir` as the directory to descend into and `matchPattern`
 * as the relative-path pattern to match files against.
 */
export const splitGlobRoot = (pattern: string): { rootDir: string; matchPattern: string } => {
    const segments = pattern.split("/");
    const staticSegments: string[] = [];
    for (const segment of segments) {
        if (isDynamicPattern(segment)) break;
        staticSegments.push(segment);
    }
    if (staticSegments.length === segments.length) {
        // Fully static path: treat last segment as match pattern, the rest as rootDir.
        return {
            rootDir: staticSegments.slice(0, -1).join("/"),
            matchPattern: staticSegments[staticSegments.length - 1] ?? "",
        };
    }
    return {
        rootDir: staticSegments.join("/"),
        matchPattern: segments.slice(staticSegments.length).join("/"),
    };
};
