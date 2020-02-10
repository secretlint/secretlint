import globby from "globby";
import fs from "fs";
import path from "path";

const debug = require("debug")("secretlint");
export type SearchFilesOptions = {
    cwd: string;
    ignoreFilePath?: string;
};

/**
 * globby wrapper that support ignore options
 * @param patterns
 * @param options
 */
export const searchFiles = (patterns: string[], options: SearchFilesOptions) => {
    const ignoredPatterns = [];
    if (options.ignoreFilePath) {
        const normalizeIgnoreFilePath = path.resolve(options.cwd, options.ignoreFilePath);
        if (fs.existsSync(normalizeIgnoreFilePath)) {
            const ignored = fs
                .readFileSync(normalizeIgnoreFilePath, "utf-8")
                .split(/\r?\n/)
                .filter(line => !/^\s*$/.test(line) && !/^\s*#/.test(line));
            ignoredPatterns.push(...ignored);
        }
    }
    debug("search patterns: %o", patterns);
    debug("search ignore patterns: %o", ignoredPatterns);
    return globby(patterns, {
        ignore: ignoredPatterns,
        cwd: options.cwd
    });
};
