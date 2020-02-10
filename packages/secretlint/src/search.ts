import globby from "globby";
import fs from "fs";
import path from "path";

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
        console.log("normalizeIgnoreFilePath", normalizeIgnoreFilePath);
        if (fs.existsSync(normalizeIgnoreFilePath)) {
            const ignored = fs
                .readFileSync(normalizeIgnoreFilePath, "utf-8")
                .split(/\r?\n/)
                .filter(line => !/^\s*$/.test(line) && !/^\s*#/.test(line));
            ignoredPatterns.push(...ignored);
        }
    }
    console.log(patterns, ignoredPatterns);
    return globby(patterns, {
        ignore: ignoredPatterns,
        cwd: options.cwd
    });
};
