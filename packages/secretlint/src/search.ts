import { globby, isDynamicPattern, convertPathToPattern } from "globby";
import debug0 from "debug";
import fs from "fs";
import path from "path";

const debug = debug0("secretlint");
const DEFAULT_IGNORE_PATTERNS = [
    "**/.git/**",
    "**/node_modules/**",
    "**/.secretlintrc/**",
    "**/.secretlintrc.{json,yaml,yml,js}/**",
    "**/.secretlintignore*/**",
];

/**
 * Search files using glob patterns with fallback for literal files containing special characters
 * This abstraction hides globby implementation details and makes it easier to replace in the future
 *
 * WORKAROUND: This implements a 2-pass approach to handle files with multiple special characters
 * like `(group).[test].md` that are incorrectly detected as dynamic patterns by isDynamicPattern
 * but are actually literal file paths that need escaping.
 * See: https://github.com/secretlint/secretlint/issues/1057
 */
async function searchFilesWithGlob(
    normalizedPatterns: Array<{
        originalPattern: string;
        normalizedPattern: string;
        escapedPattern: string;
        isDynamic: boolean;
    }>,
    options: { cwd: string; ignoreFilePath?: string }
): Promise<string[]> {
    const globOptions = {
        cwd: options.cwd,
        ignore: DEFAULT_IGNORE_PATTERNS,
        ignoreFiles: options.ignoreFilePath ? [options.ignoreFilePath] : undefined,
        dot: true,
        absolute: true,
    };

    const originalGlobPatterns = normalizedPatterns.map((pattern) =>
        pattern.isDynamic ? pattern.originalPattern : pattern.escapedPattern
    );

    let searchResultItems = await globby(originalGlobPatterns, globOptions);

    if (searchResultItems.length === 0) {
        // Fallback: Check if any "dynamic" patterns are actually literal files with special characters
        // exists as a literal file on disk, and if so, treat it as a literal path that needs escaping.
        // Related to issue: https://github.com/secretlint/secretlint/issues/1057
        const literalFilePatterns = normalizedPatterns.filter((p) => {
            if (!p.isDynamic) return false;

            const fullPath = path.resolve(options.cwd, p.normalizedPattern);
            return fs.existsSync(fullPath);
        });

        if (literalFilePatterns.length > 0) {
            const fallbackGlobPatterns = literalFilePatterns.map((pattern) => pattern.escapedPattern);
            const fallbackResults = await globby(fallbackGlobPatterns, globOptions);

            if (fallbackResults.length > 0) {
                searchResultItems = fallbackResults;
                debug("Used escaped patterns as fallback for literal files: %o", fallbackGlobPatterns);
            }
        }
    }

    return searchResultItems;
}
export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
};

/**
 * globby wrapper that support ignore options
 * @param patterns
 * @param options
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    // secretelint support glob pattern
    const normalizedPatterns = patterns.map((pattern) => {
        // glob can not handle Windows style path separator
        // So, replace path separator to POSIX style
        // https://github.com/secretlint/secretlint/issues/816
        const normalizedPattern = process.platform === "win32" ? pattern.replace(/\\/g, "/") : pattern;
        // isDynamicPattern arguments should be posix path
        // isDynamicPattern("C:\\path\\to\\file") => true
        // If pattern includes glob pattern, just return `pattern`
        // Because user need to use `secretint "**/*"` in any platform(Windows, macOS, Linux)
        const isPatternGlobStyle = isDynamicPattern(normalizedPattern);

        return {
            originalPattern: pattern,
            normalizedPattern: normalizedPattern,
            escapedPattern: convertPathToPattern(normalizedPattern),
            isDynamic: isPatternGlobStyle,
        };
    });

    debug("search patterns: %o", normalizedPatterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFilePath: %s", options.ignoreFilePath);

    const searchResultItems = await searchFilesWithGlob(normalizedPatterns, options);

    if (searchResultItems.length > 0) {
        return {
            ok: true,
            items: searchResultItems,
        };
    }

    /**
     * If globby result with ignoring is empty and globby result is not empty, Secretlint suppress "not found target file" error.
     * It is valid case.
     * It aim to avoid error that is caused by ignore files and not found target file.
     * TODO: This is also performance issue. we need to more reasonable mechanism.
     */
    const finalGlobPatterns = normalizedPatterns.map((pattern) => pattern.escapedPattern);
    const isEmptyResultIsHappenByIgnoring =
        (
            await globby(finalGlobPatterns, {
                cwd: options.cwd,
                dot: true,
            })
        ).length > 0;
    return {
        ok: isEmptyResultIsHappenByIgnoring,
        items: [],
    };
};
