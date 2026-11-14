/**
 * The keyword scan: the first step of a lint.
 *
 * A lint has two steps:
 * 1. Scan the bytes of a source for the keywords of the rules.
 * 2. Run the rules that the keywords select.
 *
 * `lintSource()` does both steps. This module is the first step alone, so that a caller can run it somewhere else,
 * such as in a worker thread, and pass the result to `lintSource()`.
 * It also checks the lines that have a keyword with the regular expressions of the patterns,
 * so it tells if a rule runs for the source.
 * It does not import rules or config, and it does not depend on Node.js.
 */
import { getKeywordMatcher, type KeywordHits } from "./helper/keyword-matcher.js";
import { hasLineMatchInBytes, isKeywordFound, type LinePattern } from "./helper/line-check.js";

export type { KeywordHits };
/**
 * What the keyword scan looks for. It is plain data, so it can be sent to a worker thread.
 * `getKeywordScanPlan()` of `@secretlint/core` creates it from a config.
 */
export type KeywordScanPlan = {
    /**
     * It identifies the keywords and the patterns of the plan.
     * `lintSource()` uses a result only if it has the id of its own plan.
     */
    readonly id: string;
    readonly keywords: readonly string[];
    /**
     * `caseSensitive[i]` is true if `keywords[i]` is case-sensitive
     */
    readonly caseSensitive: readonly boolean[];
    /**
     * true if no rule runs for a source that has none of the keywords.
     * Then the result of the lint of such a source has no messages, and the caller does not need to lint it.
     * It is false if a rule or a pattern without keywords is enabled.
     */
    readonly requiresKeyword: boolean;
    /**
     * What decides if a rule runs for a source that has a keyword
     */
    readonly ruleCheck: KeywordScanRuleCheck;
};
/**
 * The data of the rules that the scan needs to tell if a rule runs for a source that has a keyword.
 * It has the regular expressions of the patterns as strings, not the rules.
 */
export type KeywordScanRuleCheck = {
    /**
     * Indexes of the keywords that select a rule or a pattern for the whole content
     */
    readonly contentKeywordIndexes: readonly number[];
    /**
     * The patterns that run on the lines that have their keywords
     */
    readonly linePatterns: readonly {
        readonly source: string;
        readonly flags: string;
        readonly keywordIndexes: readonly number[];
    }[];
};
/**
 * The result of the keyword scan of a source
 */
export type KeywordScanResult = {
    /**
     * `id` of the plan that the scan used
     */
    readonly planId: string;
    readonly hits: KeywordHits;
    /**
     * false if no rule that has keywords runs for the source:
     * the source has no keyword, or it has only keywords of patterns that do not match the lines of the keywords.
     * A rule or a pattern without keywords still runs. See `requiresKeyword` of the plan.
     */
    readonly runsRules: boolean;
    /**
     * true if a pattern matches a line that has its keyword. undefined if the scan did not check the lines.
     */
    readonly lineMatched?: boolean;
};

export const createKeywordScanPlan = ({
    keywords,
    caseSensitive,
    requiresKeyword,
    ruleCheck,
}: {
    keywords: readonly string[];
    caseSensitive: readonly boolean[];
    requiresKeyword: boolean;
    ruleCheck: KeywordScanRuleCheck;
}): KeywordScanPlan => {
    const flags = keywords.map((_, index) => caseSensitive[index] === true);
    // The keywords and the regular expressions may contain any character, so the id is the JSON of them
    return {
        id: JSON.stringify([keywords, flags, ruleCheck]),
        keywords: [...keywords],
        caseSensitive: flags,
        requiresKeyword,
        ruleCheck,
    };
};

export const hasUtf8BOM = (bytes: Uint8Array): boolean => {
    return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
};

export type KeywordScanner = {
    /**
     * Scan UTF-8 bytes for the keywords of the plan, and check the lines that have a keyword of a pattern.
     * The byte order mark is not scanned.
     */
    scan(bytes: Uint8Array): KeywordScanResult;
};

export const createKeywordScanner = (plan: KeywordScanPlan): KeywordScanner => {
    const matcher = getKeywordMatcher(plan.keywords, plan.caseSensitive);
    const ruleCheck = plan.ruleCheck;
    const linePatterns = ruleCheck.linePatterns.map((pattern) => {
        return { tester: new RegExp(pattern.source, pattern.flags), keywordIndexes: pattern.keywordIndexes };
    });
    const view = {
        matcher,
        linePatternsOfKeyword: plan.keywords.map((_, keywordIndex): LinePattern[] => {
            return linePatterns.filter((pattern) => pattern.keywordIndexes.includes(keywordIndex));
        }),
    };
    return {
        scan(bytes) {
            const contentStart = hasUtf8BOM(bytes) ? 3 : 0;
            const hits = matcher.scan(bytes, contentStart);
            // The lines are checked only if no keyword selects a rule for the whole content
            const selectsContent = hits.count > 0 && isKeywordFound(ruleCheck.contentKeywordIndexes, hits.found);
            const lineMatched =
                hits.count > 0 && !selectsContent ? hasLineMatchInBytes(view, hits, bytes, contentStart) : undefined;
            const runsRules = selectsContent || lineMatched === true;
            return { planId: plan.id, hits, runsRules, lineMatched };
        },
    };
};
