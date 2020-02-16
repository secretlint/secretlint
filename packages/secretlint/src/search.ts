import globby from "globby";
import fs from "fs";
import path from "path";

const debug = require("debug")("secretlint");
const DEFAULT_IGNORE_PATTERNS = Object.freeze([
    "**/node_modules/**",
    "**/.secretlintrc*/**",
    "**/.secretlintignore*/**"
]);
export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
};
/**
 * root option support of https://github.com/isaacs/node-glob#options
 * /packages -> packages
 * fast-glob ignore /dir. It is workaround.
 * @param filePath
 */
const replaceRootDir = (filePath: string): string => {
    if (filePath[0] === path.sep) {
        return filePath.slice(1);
    }
    return filePath;
};
const mapGitIgnorePatternTo = (base: string) => (ignore: string) => {
    if (ignore.startsWith("!")) {
        return "!" + path.posix.join(base, ignore.slice(1));
    }

    return replaceRootDir(path.posix.join(base, ignore));
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
                .filter(line => !/^\s*$/.test(line) && !/^\s*#/.test(line))
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
        dot: true
    });
    if (searchResultItems.length > 0) {
        return {
            ok: true,
            items: searchResultItems
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
                dot: true
            })
        ).length > 0;
    return {
        ok: isEmptyResultIsHappenByIgnoring,
        items: []
    };
};
