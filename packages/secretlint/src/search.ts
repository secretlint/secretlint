import { globby } from "globby";
import fs from "node:fs";
import path from "node:path";
import debug0 from "debug";
const debug = debug0("secretlint");
const DEFAULT_IGNORE_PATTERNS = Object.freeze([
    "**/.git/**",
    "**/node_modules/**",
    "**/.secretlintrc/**",
    "**/.secretlintrc.{json,yaml,yml,js}/**",
    "**/.secretlintignore*/**",
]);
export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
};

const mapGitIgnorePatternTo = (base: string) => (ignore: string) => {
    const mapped = ignore.startsWith("!")
        ? "!" + path.resolve(path.join(base, ignore.slice(1)))
        : path.resolve(path.join(base, ignore));
    return mapped.replace(/\\/g, "/");
};
/**
 * globby wrapper that support ignore options
 * @param patterns
 * @param options
 */
export const searchFiles = async (patterns: string[], options: SearchFilesOptions) => {
    const ignoredPatterns = [];
    ignoredPatterns.push(...DEFAULT_IGNORE_PATTERNS);
    if (options.ignoreFilePath) {
        const baseDir = path.relative(options.cwd, path.dirname(options.ignoreFilePath));
        const normalizeIgnoreFilePath = path.resolve(options.cwd, options.ignoreFilePath);
        debug("searchFiles ignore baseDir: %s, normalizeIgnoreFilePath: %s", baseDir, normalizeIgnoreFilePath);
        if (fs.existsSync(normalizeIgnoreFilePath)) {
            const ignored = fs
                .readFileSync(normalizeIgnoreFilePath, "utf-8")
                .split(/\r?\n/)
                .filter((line) => !/^\s*$/.test(line) && !/^\s*#/.test(line))
                .map(mapGitIgnorePatternTo(baseDir));
            debug("ignored: %o", ignored);
            ignoredPatterns.push(...ignored);
        }
    }
    debug("search patterns: %o", patterns);
    debug("search ignore patterns: %o", ignoredPatterns);
    const searchResultItems = await globby(patterns, {
        cwd: options.cwd,
        ignore: ignoredPatterns,
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
            await globby(patterns, {
                cwd: options.cwd,
                dot: true,
            })
        ).length > 0;
    return {
        ok: isEmptyResultIsHappenByIgnoring,
        items: [],
    };
};
