import type { KeywordHits, KeywordMatcher } from "./helper/keyword-matcher.js";
import { formatGuardedKeyword, type KeywordGuard } from "./helper/keyword-guard.js";
import type {
    SecretLintCoreConfig,
    SecretLintCoreConfigRule,
    SecretLintCoreIgnoreMessage,
    SecretLintCoreResult,
    SecretLintCoreResultMessage,
    SecretLintRawSource,
    SecretLintRuleContext,
    SecretLintRuleLocaleTag,
    SecretLintRulePatternContext,
    SecretLintRuleReportHandler,
} from "@secretlint/types";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl.js";
import { ContextEvents, createRuleContext } from "./RuleContext.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { cleanupMessages } from "./messages/index.js";
import { getLintPlan, getPlanView, LintPlan, PlanPattern, PlanView, ViewRule } from "./LintPlan.js";
import { hasUtf8BOM, type KeywordScanPlan, type KeywordScanResult } from "./keyword-scan.js";
import { hasLineMatchInBytes, isKeywordFound, someKeywordLine } from "./helper/line-check.js";

export type { KeywordScanPlan, KeywordScanResult };
import debug0 from "debug";

const debug = debug0("@secretlint/core");
export type SecretLintSourceOptions = {
    /**
     * Lint target source
     */
    source: SecretLintRawSource;
    /**
     * The result of the keyword scan of `source.contentBytes`, from `createKeywordScanner()` of
     * `@secretlint/core/keyword-scan` with the plan of `getKeywordScanPlan()`.
     * If it is passed, `lintSource()` does not scan the bytes or check the lines that have a keyword again.
     * It is ignored if it is not for the keywords and the patterns of the config and the content type of the source,
     * so a result of another config costs time and does not change the result of the lint.
     * The caller passes it only if it scanned the same bytes as `source.contentBytes`.
     */
    keywordScanResult?: KeywordScanResult;
    options: {
        /**
         * local for translate
         * Default: "en"
         */
        locale?: SecretLintRuleLocaleTag;
        /**
         * If this is true, mask all message's data values
         * Replace data value with "****" strings
         * Default: false
         */
        maskSecrets?: boolean;
        /**
         * config present secretlintrc object
         */
        config: SecretLintCoreConfig;
        /**
         * If pass the `source` come from non-physical file such as stdin, you can set `noPhysicFilePath` to true.
         * This option affect to `context.getSourceFilePath()`.
         * If pass `noPhysicFilePath: true`, `context.getSourceFilePath()` return `undefined`.
         */
        noPhysicFilePath?: boolean;
    };
};

/**
 * Lines to run each "line" scope pattern on: `lines[pattern.index]` is pairs of [start, end] in the text.
 */
type KeywordLines = readonly (readonly number[])[];
const NO_KEYWORD_LINES: KeywordLines = [];
/**
 * Return the lines that have a keyword of each "line" scope pattern.
 * `hits` is the result of scanning the text.
 */
const collectKeywordLines = (view: PlanView, hits: KeywordHits, text: string): KeywordLines => {
    const lines: number[][] = view.keywordPatterns.map(() => []);
    someKeywordLine(
        view,
        hits,
        (index) => (index === 0 ? 0 : text.lastIndexOf("\n", index - 1) + 1),
        (index) => {
            const nextLineFeed = text.indexOf("\n", index);
            return nextLineFeed < 0 ? text.length : nextLineFeed + 1;
        },
        (lineStart, lineEnd, patterns) => {
            patterns.forEach((pattern) => (lines[pattern.index] as number[]).push(lineStart, lineEnd));
            return false;
        },
    );
    return lines;
};

/**
 * Call `report()` of the pattern for each match in the text.
 * `offset` is the index of the text in the source content.
 */
const runPattern = (
    pattern: PlanPattern,
    text: string,
    offset: number,
    context: SecretLintRulePatternContext<any>,
): void => {
    const profiling = secretLintProfiler.isEnabled;
    const startTime = profiling ? secretLintProfiler.now() : 0;
    let matchCount = 0;
    // matchAll works on its own copy of the regular expression, so `pattern.regex` is never changed
    for (const match of text.matchAll(pattern.regex)) {
        matchCount++;
        const matchedText = match[0];
        const startIndex = offset + match.index;
        pattern.report(
            {
                text: matchedText,
                range: [startIndex, startIndex + matchedText.length],
                captures: match,
                groups: match.groups,
            },
            context,
        );
    }
    if (profiling) {
        // the time includes `report()` of the pattern
        secretLintProfiler.record("@core>pattern", pattern.profileId, startTime);
        if (matchCount > 0) {
            secretLintProfiler.count("@core>pattern-match", pattern.profileId, matchCount);
        }
    }
};

/**
 * Call `report()` of a path pattern once for the file, with the whole content as the match
 */
const reportPath = (pattern: PlanPattern, content: string, context: SecretLintRulePatternContext<any>): void => {
    const startTime = secretLintProfiler.isEnabled ? secretLintProfiler.now() : 0;
    pattern.report(
        {
            text: content,
            range: [0, content.length],
            captures: [content],
            groups: undefined,
        },
        context,
    );
    secretLintProfiler.record("@core>pattern", pattern.profileId, startTime);
};

/**
 * The result of checking UTF-8 bytes without decoding the whole content
 */
type BytesCheck = {
    /**
     * `found[i] === 1` if the keyword of the index is in the bytes
     */
    readonly found: Readonly<Uint8Array>;
    readonly hasKeyword: boolean;
    /**
     * true if a pattern may match, so the patterns should run on the decoded content
     */
    readonly runsPatterns: boolean;
};
/**
 * Add the places of the keywords with a guard to the profile.
 * The matcher counts them only if it was created for the profile.
 */
const recordGuardCounts = (matcher: KeywordMatcher): void => {
    for (const { keywordIndex, found, met } of matcher.takeGuardCounts()) {
        const id = formatGuardedKeyword(
            matcher.keywords[keywordIndex] as string,
            matcher.guards[keywordIndex] as KeywordGuard,
        );
        secretLintProfiler.count("@core>keyword-guard", id, found);
        secretLintProfiler.count("@core>keyword-guard-met", id, met);
    }
};
/**
 * 1. Scan the bytes once for the keywords of all rules.
 * 2. Check the patterns on the lines that have a keyword, without decoding the whole content.
 */
const checkBytes = (
    view: PlanView,
    bytes: Uint8Array,
    keywordScanResult: KeywordScanResult | undefined,
): BytesCheck | undefined => {
    const matcher = view.matcher;
    if (!matcher) {
        return undefined;
    }
    const profiling = secretLintProfiler.isEnabled;
    const found = (keywordIndexes: Readonly<Uint8Array>): (() => boolean) => {
        return () => {
            return view.keywordPatterns.some((pattern) => {
                return (
                    pattern.scope === "file" &&
                    isKeywordFound(pattern.keywordIndexes as readonly number[], keywordIndexes)
                );
            });
        };
    };
    // Use the result of the caller only if it is for the same keywords and patterns.
    // The result has the check of the lines, so the bytes are not scanned here
    if (keywordScanResult !== undefined && keywordScanResult.planId === view.keywordScanPlan?.id) {
        const hasFilePatternKeyword = found(keywordScanResult.found);
        return {
            found: keywordScanResult.found,
            hasKeyword: keywordScanResult.hasKeyword,
            runsPatterns:
                view.hasAlwaysPattern ||
                (keywordScanResult.hasKeyword &&
                    ((view.hasFilePattern && hasFilePatternKeyword()) || keywordScanResult.lineMatched)),
        };
    }
    const contentStart = hasUtf8BOM(bytes) ? 3 : 0;
    const scanStartTime = profiling ? secretLintProfiler.now() : 0;
    const hits = matcher.scan(bytes, contentStart);
    if (profiling) {
        secretLintProfiler.record("@core>keyword-scan", undefined, scanStartTime);
        recordGuardCounts(matcher);
    }
    const hasKeyword = hits.count > 0;
    const hasFilePatternKeyword = found(hits.found);
    const hasLineMatch = (): boolean => {
        if (!profiling) {
            return hasLineMatchInBytes(view, hits, bytes, contentStart);
        }
        const startTime = secretLintProfiler.now();
        const matched = hasLineMatchInBytes(view, hits, bytes, contentStart, (pattern, line) => {
            const testStartTime = secretLintProfiler.now();
            const lineMatched = pattern.tester.test(line);
            secretLintProfiler.record("@core>pattern-line-test", pattern.profileId, testStartTime);
            return lineMatched;
        });
        secretLintProfiler.record("@core>line-check", undefined, startTime);
        return matched;
    };
    const runsPatterns =
        view.hasAlwaysPattern || (hasKeyword && ((view.hasFilePattern && hasFilePatternKeyword()) || hasLineMatch()));
    return { found: hits.found, hasKeyword, runsPatterns };
};

type RuleToRun =
    | {
          type: "patterns";
          viewRule: ViewRule;
          patterns: readonly PlanPattern[];
      }
    | {
          type: "handler";
          viewRule: ViewRule;
          handler: SecretLintRuleReportHandler;
      };

/**
 * Create the result of the lint.
 *
 * The result does not have the content of the source.
 * Most files have no message, and their bytes are never decoded: decoding them only for the result
 * would cost more than the lint. The caller has the source, and it can pass the content to a formatter.
 */
const createResult = (source: SecretLintRawSource, messages: SecretLintCoreResultMessage[]): SecretLintCoreResult => {
    return {
        filePath: source.filePath,
        sourceContentType: source.contentType,
        messages,
    };
};

/**
 * Call `create()` of the rule that has no patterns.
 */
const createHandler = (
    descriptorRule: SecretLintCoreConfigRule,
    context: SecretLintRuleContext,
): SecretLintRuleReportHandler => {
    const create = descriptorRule.rule.create;
    if (typeof create !== "function") {
        throw new Error(`The rule should have \`create\` function or \`patterns\`: ${descriptorRule.id}`);
    }
    // If option is not defined Options is {} by default
    return create.call(descriptorRule.rule, context, descriptorRule.options || {});
};

const lintWithPlan = (
    plan: LintPlan,
    source: SecretLintRawSource,
    options: { maskSecrets: boolean; noPhysicFilePath: boolean },
    keywordScanResult?: KeywordScanResult,
): Promise<SecretLintCoreResult> => {
    const contentType = source.contentType;
    const view = getPlanView(plan, contentType);
    const matcher = view.matcher;
    // The bytes may be available only at the start of the lint. See createFileSourceReader() of source-creator
    const bytes = source.contentBytes;
    // Check the bytes if the source has them, because decoding the content costs more than scanning it.
    const bytesCheck = bytes === undefined ? undefined : checkBytes(view, bytes, keywordScanResult);
    const isPathPatternTarget = (pattern: PlanPattern): boolean => {
        return pattern.filePathFilter === undefined || pattern.filePathFilter(source.filePath);
    };
    // A path pattern reports the file by its path, so it runs without keywords
    const hasPathMatch = view.pathPatterns.some(isPathPatternTarget);
    if (
        bytes !== undefined &&
        !bytesCheck?.hasKeyword &&
        !view.hasAlwaysPattern &&
        !view.hasAlwaysRule &&
        !hasPathMatch
    ) {
        // Most files end here: no rule runs, and nothing is created for the file except the result
        return Promise.resolve(createResult(source, []));
    }
    // Create a SourceCode for linting.
    // Defer reading the content, because it may be decoded lazily and most files do not need it
    const sourceCode = new SecretLintSourceCodeImpl({
        content: () => source.content,
        filePath: source.filePath,
        physicalFilePath: options.noPhysicFilePath ? undefined : source.filePath,
        ext: source.ext || "",
        contentType,
        contentBytes: bytes,
    });
    // Scan the text if the source has no bytes, or if the patterns run:
    // the patterns need the indexes in the text, which are different from the indexes in the bytes.
    const needsTextHits = bytes === undefined || bytesCheck?.runsPatterns === true || view.hasAlwaysPattern;
    const scanText = (): KeywordHits | undefined => {
        if (matcher === undefined || !needsTextHits) {
            return undefined;
        }
        if (!secretLintProfiler.isEnabled) {
            return matcher.scan(sourceCode.content);
        }
        // Decode the content before the scan, so that the time of the scan does not include the decoding
        const content = sourceCode.content;
        const startTime = secretLintProfiler.now();
        const hits = matcher.scan(content);
        secretLintProfiler.record("@core>keyword-scan", undefined, startTime);
        recordGuardCounts(matcher);
        return hits;
    };
    const textHits = scanText();
    const found = textHits?.found ?? bytesCheck?.found;
    const runsContentPatterns =
        view.hasAlwaysPattern ||
        (bytes === undefined ? textHits !== undefined && textHits.count > 0 : bytesCheck?.runsPatterns === true);
    const runsPatterns = runsContentPatterns || hasPathMatch;
    const keywordLines =
        runsContentPatterns && textHits !== undefined
            ? collectKeywordLines(view, textHits, sourceCode.content)
            : NO_KEYWORD_LINES;
    const reportedMessages: SecretLintCoreResultMessage[] = [];
    const ignoredMessages: SecretLintCoreIgnoreMessage[] = [];
    const contextEvents: ContextEvents = {
        report(message) {
            reportedMessages.push(message);
        },
        ignore(message) {
            ignoredMessages.push(message);
        },
    };
    const sharedOptions = plan.config.sharedOptions ?? {};
    const createContext = (viewRule: ViewRule): SecretLintRuleContext => {
        const { descriptorRule, ruleParentId } = viewRule.rule;
        return createRuleContext({
            ruleId: descriptorRule.id,
            ruleParentId,
            severity: descriptorRule.severity,
            meta: descriptorRule.rule.meta,
            sourceCode,
            contextEvents,
            sharedOptions,
            locale: plan.locale,
        });
    };
    const isKeywordInContent = (keywordIndexes: readonly number[]): boolean => {
        return found !== undefined && isKeywordFound(keywordIndexes, found);
    };
    // Create the rules without patterns that run for the source code.
    // The rules that do not run are not created, so `create()` of the rule is not called for the source code.
    // If `create()` of a rule throws, no handler has started and lintSource throws synchronously.
    const rulesToRun = view.rules
        .filter((viewRule) => {
            if (viewRule.patterns) {
                return runsPatterns;
            }
            return viewRule.keywordIndexes === undefined || isKeywordInContent(viewRule.keywordIndexes);
        })
        .map((viewRule): RuleToRun => {
            if (viewRule.patterns) {
                return { type: "patterns", viewRule, patterns: viewRule.patterns };
            }
            const descriptorRule = viewRule.rule.descriptorRule;
            return {
                type: "handler",
                viewRule,
                // If option is not defined Options is {} by default
                handler: createHandler(descriptorRule, createContext(viewRule)),
            };
        });
    if (rulesToRun.length === 0) {
        return Promise.resolve(createResult(source, []));
    }
    /**
     * Return where the pattern runs: the whole content, some lines, or nowhere
     */
    const targetsOfPattern = (pattern: PlanPattern): "path" | "content" | readonly number[] => {
        if (pattern.filePathFilter !== undefined && !pattern.filePathFilter(source.filePath)) {
            return [];
        }
        if (pattern.pathOnly) {
            return "path";
        }
        if (!runsContentPatterns) {
            return [];
        }
        if (pattern.keywordIndexes === undefined) {
            return "content";
        }
        if (pattern.scope === "file") {
            return isKeywordInContent(pattern.keywordIndexes) ? "content" : [];
        }
        return keywordLines[pattern.index] ?? [];
    };
    // 3. Run the rules in the registered order
    const promises: Promise<void>[] = [];
    try {
        for (const ruleToRun of rulesToRun) {
            const viewRule = ruleToRun.viewRule;
            const ruleId = viewRule.rule.descriptorRule.rule.meta.id;
            // Each call has its own start time, because the calls for different sources can overlap
            const ruleStartTime = secretLintProfiler.isEnabled ? secretLintProfiler.now() : 0;
            if (ruleToRun.type === "patterns") {
                const targets = ruleToRun.patterns
                    .map((pattern) => ({ pattern, target: targetsOfPattern(pattern) }))
                    .filter(({ target }) => target.length > 0);
                if (targets.length > 0) {
                    const content = sourceCode.content;
                    const context: SecretLintRulePatternContext<any> = {
                        ...createContext(viewRule),
                        options: viewRule.rule.descriptorRule.options || {},
                        source: sourceCode,
                    };
                    for (const { pattern, target } of targets) {
                        if (target === "path") {
                            reportPath(pattern, content, context);
                            continue;
                        }
                        if (target === "content") {
                            runPattern(pattern, content, 0, context);
                            continue;
                        }
                        for (let i = 0; i < target.length; i += 2) {
                            const lineStart = target[i] as number;
                            runPattern(pattern, content.slice(lineStart, target[i + 1] as number), lineStart, context);
                        }
                    }
                }
                secretLintProfiler.record("@core>rule-handler", ruleId, ruleStartTime);
            } else {
                const file = ruleToRun.handler.file;
                // Most handlers are synchronous. Do not create a promise for them, because it costs for each file
                const returned: unknown = file ? file(sourceCode) : undefined;
                if (returned !== undefined && typeof (returned as PromiseLike<void>).then === "function") {
                    promises.push(
                        Promise.resolve(returned as PromiseLike<void>).then(() => {
                            secretLintProfiler.record("@core>rule-handler", ruleId, ruleStartTime);
                        }),
                    );
                } else {
                    secretLintProfiler.record("@core>rule-handler", ruleId, ruleStartTime);
                }
            }
        }
    } catch (error) {
        // wait for the started handlers, then report the error of the pattern or the handler
        return Promise.allSettled(promises).then(() => {
            throw error;
        });
    }
    const finish = (): SecretLintCoreResult => {
        if (reportedMessages.length === 0) {
            return createResult(source, []);
        }
        return createResult(
            source,
            cleanupMessages({
                reportedMessages,
                ignoredMessages,
                allowMessageIds: plan.allowMessageIds,
                maskSecrets: options.maskSecrets,
            }),
        );
    };
    if (promises.length === 0) {
        return Promise.resolve(finish());
    }
    return Promise.all(promises).then(finish);
};

/**
 * Get what the keyword scan looks for with the config, for sources of the content type.
 * Pass it to `createKeywordScanner()` of `@secretlint/core/keyword-scan`.
 * It returns undefined if no rule has keywords: then there is nothing to scan.
 */
export const getKeywordScanPlan = ({
    config,
    locale,
    contentType = "text",
}: {
    config: SecretLintCoreConfig;
    locale?: SecretLintRuleLocaleTag;
    contentType?: SecretLintRawSource["contentType"];
}): KeywordScanPlan | undefined => {
    return getPlanView(getLintPlan(config, locale ?? "en"), contentType).keywordScanPlan;
};

export const lintSource = ({
    source,
    options,
    keywordScanResult,
}: SecretLintSourceOptions): Promise<SecretLintCoreResult> => {
    // Each call has its own start time, because the calls can overlap
    const startTime = secretLintProfiler.isEnabled ? secretLintProfiler.now() : 0;
    debug(`source filePath: %O`, source.filePath);
    debug(`options: %O`, options);
    const plan = getLintPlan(options.config, options.locale ?? "en");
    const promise = lintWithPlan(
        plan,
        source,
        {
            maskSecrets: options.maskSecrets ?? false,
            noPhysicFilePath: options.noPhysicFilePath ?? false,
        },
        keywordScanResult,
    );
    if (!secretLintProfiler.isEnabled) {
        return promise;
    }
    return promise.finally(() => {
        secretLintProfiler.record("@core>lint", source.filePath, startTime);
    });
};
