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
        if (isPatternGlobStyle) {
            return {
                pattern: pattern,
                isDynamic: true,
            };
        }
        // static path should be escaped special characters
        return {
            pattern: convertPathToPattern(normalizedPattern),
            isDynamic: false,
        };
    });
    debug("search patterns: %o", normalizedPatterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFilePath: %s", options.ignoreFilePath);
    debug("search cwd: %s", options.cwd);
    const globPatterns = normalizedPatterns.map((pattern) => pattern.pattern);
    debug("globPatterns for main search: %o", globPatterns);
    const searchResultItems = await globby(globPatterns, {
        cwd: options.cwd,
        ignore: DEFAULT_IGNORE_PATTERNS,
        ignoreFiles: options.ignoreFilePath ? [options.ignoreFilePath] : undefined,
        dot: true,
        absolute: true,
    });
    debug("searchResultItems: %o", searchResultItems);

    // Fallback: If no results and there are dynamic patterns that exist as literal files,
    // try with escaped patterns. This handles files with multiple special characters
    // Related to issue: https://github.com/secretlint/secretlint/issues/1057
    // This is a workaround for fast-glob's convertPathToPattern limitation with combined special characters
    if (searchResultItems.length === 0) {
        const dynamicPatterns = normalizedPatterns.filter((p) => p.isDynamic);

        const literalFilePatterns = dynamicPatterns.filter((p) => {
            const fullPath = path.resolve(options.cwd, p.pattern);
            return fs.existsSync(fullPath);
        });

        if (literalFilePatterns.length > 0) {
            const fallbackGlobPatterns = literalFilePatterns.map((pattern) => convertPathToPattern(pattern.pattern));

            const fallbackResults = await globby(fallbackGlobPatterns, {
                cwd: options.cwd,
                ignore: DEFAULT_IGNORE_PATTERNS,
                ignoreFiles: options.ignoreFilePath ? [options.ignoreFilePath] : undefined,
                dot: true,
                absolute: true,
            });

            if (fallbackResults.length > 0) {
                searchResultItems.push(...fallbackResults);
                debug("Used escaped patterns as fallback for literal files: %o", fallbackGlobPatterns);
            }
        }
    }

    if (searchResultItems.length > 0) {
        debug("returning success with items: %o", searchResultItems);
        return {
            ok: true,
            items: searchResultItems,
        };
    }
    debug("searchResultItems is empty, checking fallback and ignore logic");
    /**
     * If globby result with ignoring is empty and globby result is not empty, Secretlint suppress "not found target file" error.
     * It is valid case.
     * It aim to avoid error that is caused by ignore files and not found target file.
     * TODO: This is also performance issue. we need to more reasonable mechanism.
     */
    const ignoreCheckResults = await globby(globPatterns, {
        cwd: options.cwd,
        dot: true,
        ignore: [],
    });
    debug("ignoreCheckResults (without ignore patterns): %o", ignoreCheckResults);
    const isEmptyResultIsHappenByIgnoring = ignoreCheckResults.length > 0;
    debug("isEmptyResultIsHappenByIgnoring: %o", isEmptyResultIsHappenByIgnoring);
    return {
        ok: isEmptyResultIsHappenByIgnoring,
        items: [],
    };
};
