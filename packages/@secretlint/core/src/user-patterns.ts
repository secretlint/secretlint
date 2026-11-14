/**
 * User-defined patterns: the options of `@secretlint/secretlint-rule-pattern`, read as patterns of the lint plan.
 *
 * The rule has no `create()`. The core converts each entry of `options.patterns` to declarative patterns,
 * so the patterns have keywords as the patterns of the other built-in rules have, and the rule without entries
 * adds nothing to the lint.
 */
import type { SecretLintRulePattern } from "@secretlint/types";
import { createRegExp, matchPatterns } from "@textlint/regexp-string-matcher";
import { basename } from "./builtin/path-util.js";
import { matchFilePathGlobs, messages, type Options, type PatternType } from "./builtin/rules/pattern/index.js";
import { extractKeywords } from "./helper/extract-keywords.js";
import { normalizeKeyword } from "./helper/keyword-matcher.js";

export type UserPattern = {
    /**
     * The pattern. `keywords` is set only if the entry has them, or they are found in the pattern.
     */
    pattern: SecretLintRulePattern<Options>;
    /**
     * The name of the entry, for the profile
     */
    name: string;
    /**
     * Return false if the pattern does not run for the file path. undefined if it runs for any path.
     */
    filePathFilter: ((filePath: string | undefined) => boolean) | undefined;
    /**
     * true if the entry has only `filePathGlobs`: it reports the file without matching the content.
     */
    pathOnly: boolean;
};

const collectPatternStrings = (entry: PatternType): string[] => {
    if (entry.patterns && entry.patterns.length > 0) {
        return entry.patterns;
    }
    if (entry.pattern) {
        return [entry.pattern];
    }
    return [];
};

/**
 * Return the keywords of the entry, or undefined if the entry has no `keywords`.
 * `[]` means that the patterns have no keywords.
 */
const keywordsOfEntry = (entry: PatternType): string[] | undefined => {
    const keywords: unknown = entry.keywords;
    if (keywords === undefined) {
        return undefined;
    }
    if (!Array.isArray(keywords)) {
        throw new Error(`Pattern "${entry.name}" has "keywords" that is not an array of strings.`);
    }
    return keywords.map((keyword: unknown) => {
        // check the keyword in the same way as the keyword matcher. The matcher lower-cases it later.
        if (normalizeKeyword(keyword, true) === undefined) {
            throw new Error(
                `Pattern "${entry.name}" has a keyword that is not a non-empty ASCII string: ${JSON.stringify(keyword)}`,
            );
        }
        return keyword as string;
    });
};

const assertEntry = (entry: PatternType): void => {
    if (entry.patterns && entry.patterns.length > 0 && entry.pattern) {
        throw new Error(
            `Pattern "${entry.name}" cannot have both "patterns" and "pattern" specified. Use "patterns" array instead.`,
        );
    }
    const hasPatterns = (entry.patterns && entry.patterns.length > 0) || entry.pattern;
    const hasFilePathGlobs = entry.filePathGlobs && entry.filePathGlobs.length > 0;
    if (!hasPatterns && !hasFilePathGlobs) {
        throw new Error(
            `Pattern "${entry.name}" must have either "patterns", "pattern" (deprecated), or "filePathGlobs" specified`,
        );
    }
};

/**
 * Convert the options of `@secretlint/secretlint-rule-pattern` to patterns.
 * It throws if an entry is not valid, so that no file is linted with a wrong configuration.
 */
export const compileUserPatterns = (options: Options): UserPattern[] => {
    const globalAllows = options.allows ?? [];
    const entries = options.patterns ?? [];
    return entries.flatMap((entry): UserPattern[] => {
        assertEntry(entry);
        // validate `keywords` for every entry, even if a path-only entry does not use them
        const entryKeywords = keywordsOfEntry(entry);
        const filePathGlobs = entry.filePathGlobs && entry.filePathGlobs.length > 0 ? entry.filePathGlobs : undefined;
        // A source without a file path is not filtered by the globs, as the rule did before
        const filePathFilter = filePathGlobs
            ? (filePath: string | undefined) => !filePath || matchFilePathGlobs(filePath, filePathGlobs)
            : undefined;
        const patternStrings = collectPatternStrings(entry);
        if (patternStrings.length === 0) {
            // Only `filePathGlobs`: report the file itself
            return [
                {
                    name: entry.name,
                    filePathFilter,
                    pathOnly: true,
                    pattern: {
                        pattern: /(?:)/,
                        report(_match, context) {
                            const t = context.createTranslator(messages);
                            context.report({
                                message: t("PATTERN", {
                                    PATTERN_NAME: entry.name,
                                    CREDENTIAL: basename(context.source.filePath || ""),
                                }),
                                range: [0, context.source.content.length],
                            });
                        },
                    },
                },
            ];
        }
        const allows = [...globalAllows, ...(entry.allows ?? [])];
        return patternStrings.map((patternString): UserPattern => {
            // the same RegExp as `matchPatterns()` of @textlint/regexp-string-matcher creates
            const regex = createRegExp(patternString);
            const keywords = entryKeywords ?? extractKeywords(regex);
            return {
                name: entry.name,
                filePathFilter,
                pathOnly: false,
                pattern: {
                    pattern: regex,
                    // `[]` disables the pre-filter, so the pattern runs on every file
                    ...(keywords && keywords.length > 0 ? { keywords } : {}),
                    scope: "file",
                    report(match, context) {
                        if (allows.length > 0 && matchPatterns(match.text, allows).length > 0) {
                            return;
                        }
                        const t = context.createTranslator(messages);
                        context.report({
                            message: t("PATTERN", { PATTERN_NAME: entry.name, CREDENTIAL: match.text }),
                            range: match.range,
                        });
                    },
                },
            };
        });
    });
};
