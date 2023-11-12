import { globby } from "globby";
import debug0 from "debug";

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
    // glob pattern should be used "/" as path separator
    const globPatterns = patterns.map((pattern) => {
        return pattern.replace(/\\/g, "/");
    });
    debug("search patterns: %o", globPatterns);
    debug("search DEFAULT_IGNORE_PATTERNS: %o", DEFAULT_IGNORE_PATTERNS);
    debug("search ignoreFilePath: %s", options.ignoreFilePath);
    const searchResultItems = await globby(globPatterns, {
        cwd: options.cwd,
        ignore: DEFAULT_IGNORE_PATTERNS,
        ignoreFiles: options.ignoreFilePath ? [options.ignoreFilePath] : undefined,
        dot: true,
        absolute: true,
    });
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
    const isEmptyResultIsHappenByIgnoring =
        (
            await globby(globPatterns, {
                cwd: options.cwd,
                dot: true,
            })
        ).length > 0;
    return {
        ok: isEmptyResultIsHappenByIgnoring,
        items: [],
    };
};
