import type { KeywordHits } from "./helper/keyword-matcher.js";
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
import debug0 from "debug";

const debug = debug0("@secretlint/core");
export type SecretLintSourceOptions = {
    /**
     * Lint target source
     */
    source: SecretLintRawSource;
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

const LINE_FEED = 0x0a;
const hasUtf8BOM = (bytes: Uint8Array): boolean => {
    return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
};
// TextDecoder is in browsers and Node.js. `ignoreBOM: true` keeps a BOM as a character, as `Buffer#toString` does
const textDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
/**
 * Decode a part of UTF-8 bytes.
 * The part is a line: it starts after a line feed and ends with a line feed,
 * so the result is the same as the part of the decoded whole content.
 */
const decodeBytes = (bytes: Uint8Array, start: number, end: number): string => {
    // Buffer of Node.js decodes a part of it without creating a view
    const utf8Slice = (bytes as { utf8Slice?: (start: number, end: number) => string }).utf8Slice;
    if (typeof utf8Slice === "function") {
        return utf8Slice.call(bytes, start, end);
    }
    return textDecoder.decode(bytes.subarray(start, end));
};

const isKeywordFound = (keywordIndexes: readonly number[], found: Readonly<Uint8Array>): boolean => {
    return keywordIndexes.some((keywordIndex) => found[keywordIndex] === 1);
};

/**
 * Call `visit` for each line that has a keyword of a "line" scope pattern, with the patterns of the keywords.
 * A line is [start, end), and it includes its line feed.
 * Stop and return true if `visit` returns true.
 */
const someKeywordLine = (
    view: PlanView,
    hits: KeywordHits,
    lineStartOf: (index: number) => number,
    lineEndOf: (index: number) => number,
    visit: (lineStart: number, lineEnd: number, patterns: readonly PlanPattern[]) => boolean,
): boolean => {
    const { matcher, linePatternsOfKeyword } = view;
    if (!matcher) {
        return false;
    }
    const positions = hits.positions;
    const end = hits.count * 2;
    // Add the "line" scope patterns of the keywords of the state to `patterns` of a line.
    // It is written with loops because it runs for each hit.
    const addLinePatterns = (patterns: PlanPattern[], state: number): void => {
        const keywordIndexes = matcher.keywordsOfState(state);
        for (let i = 0; i < keywordIndexes.length; i++) {
            const linePatterns = linePatternsOfKeyword[keywordIndexes[i] as number] as readonly PlanPattern[];
            for (let j = 0; j < linePatterns.length; j++) {
                const pattern = linePatterns[j] as PlanPattern;
                if (!patterns.includes(pattern)) {
                    patterns.push(pattern);
                }
            }
        }
    };
    // `cursor` is the first hit of a line. Each turn takes all hits of the line.
    for (let cursor = 0; cursor < end; ) {
        const patterns: PlanPattern[] = [];
        addLinePatterns(patterns, positions[cursor] as number);
        if (patterns.length === 0) {
            // the keyword is not for a "line" scope pattern
            cursor += 2;
            continue;
        }
        const index = positions[cursor + 1] as number;
        const lineStart = lineStartOf(index);
        const lineEnd = lineEndOf(index);
        cursor += 2;
        for (; cursor < end && (positions[cursor + 1] as number) < lineEnd; cursor += 2) {
            addLinePatterns(patterns, positions[cursor] as number);
        }
        if (visit(lineStart, lineEnd, patterns)) {
            return true;
        }
    }
    return false;
};

/**
 * Return true if a "line" scope pattern matches a line that has its keyword.
 * It decodes only the lines that have a keyword, so the whole content is not decoded for the files without secrets.
 * `hits` is the result of scanning the bytes.
 */
const hasLineMatchInBytes = (view: PlanView, hits: KeywordHits, bytes: Uint8Array, contentStart: number): boolean => {
    return someKeywordLine(
        view,
        hits,
        (index) => Math.max((index === 0 ? -1 : bytes.lastIndexOf(LINE_FEED, index - 1)) + 1, contentStart),
        (index) => {
            const nextLineFeed = bytes.indexOf(LINE_FEED, index);
            return nextLineFeed < 0 ? bytes.length : nextLineFeed + 1;
        },
        (lineStart, lineEnd, patterns) => {
            const line = decodeBytes(bytes, lineStart, lineEnd);
            if (secretLintProfiler.isEnabled) {
                return patterns.some((pattern) => {
                    const startTime = secretLintProfiler.now();
                    const matched = pattern.tester.test(line);
                    secretLintProfiler.record("@core>pattern-line-test", pattern.profileId, startTime);
                    return matched;
                });
            }
            return patterns.some((pattern) => pattern.tester.test(line));
        },
    );
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
 * 1. Scan the bytes once for the keywords of all rules.
 * 2. Check the patterns on the lines that have a keyword, without decoding the whole content.
 */
const checkBytes = (view: PlanView, bytes: Uint8Array): BytesCheck | undefined => {
    const matcher = view.matcher;
    if (!matcher) {
        return undefined;
    }
    const contentStart = hasUtf8BOM(bytes) ? 3 : 0;
    const profiling = secretLintProfiler.isEnabled;
    const scanStartTime = profiling ? secretLintProfiler.now() : 0;
    const hits = matcher.scan(bytes, contentStart);
    if (profiling) {
        secretLintProfiler.record("@core>keyword-scan", undefined, scanStartTime);
    }
    const hasKeyword = hits.count > 0;
    const hasFilePatternKeyword = (): boolean => {
        return view.keywordPatterns.some((pattern) => {
            return pattern.scope === "file" && isKeywordFound(pattern.keywordIndexes as readonly number[], hits.found);
        });
    };
    const hasLineMatch = (): boolean => {
        if (!profiling) {
            return hasLineMatchInBytes(view, hits, bytes, contentStart);
        }
        const startTime = secretLintProfiler.now();
        const matched = hasLineMatchInBytes(view, hits, bytes, contentStart);
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
): Promise<SecretLintCoreResult> => {
    const contentType = source.contentType;
    const view = getPlanView(plan, contentType);
    const matcher = view.matcher;
    // The bytes may be available only at the start of the lint. See createFileSourceReader() of source-creator
    const bytes = source.contentBytes;
    // Check the bytes if the source has them, because decoding the content costs more than scanning it.
    const bytesCheck = bytes === undefined ? undefined : checkBytes(view, bytes);
    if (bytes !== undefined && !bytesCheck?.hasKeyword && !view.hasAlwaysPattern && !view.hasAlwaysRule) {
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
        return hits;
    };
    const textHits = scanText();
    const found = textHits?.found ?? bytesCheck?.found;
    const runsPatterns =
        view.hasAlwaysPattern ||
        (bytes === undefined ? textHits !== undefined && textHits.count > 0 : bytesCheck?.runsPatterns === true);
    const keywordLines =
        runsPatterns && textHits !== undefined
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
    const targetsOfPattern = (pattern: PlanPattern): "content" | readonly number[] => {
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
            secretLintProfiler.mark({
                type: "@core>rule-handler::start",
                id: ruleId,
            });
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
                secretLintProfiler.mark({
                    type: "@core>rule-handler::end",
                    id: ruleId,
                });
            } else {
                const file = ruleToRun.handler.file;
                // Most handlers are synchronous. Do not create a promise for them, because it costs for each file
                const returned: unknown = file ? file(sourceCode) : undefined;
                if (returned !== undefined && typeof (returned as PromiseLike<void>).then === "function") {
                    promises.push(
                        Promise.resolve(returned as PromiseLike<void>).then(() => {
                            secretLintProfiler.mark({
                                type: "@core>rule-handler::end",
                                id: ruleId,
                            });
                        }),
                    );
                } else {
                    secretLintProfiler.mark({
                        type: "@core>rule-handler::end",
                        id: ruleId,
                    });
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

export const lintSource = ({ source, options }: SecretLintSourceOptions): Promise<SecretLintCoreResult> => {
    secretLintProfiler.mark({
        type: "@core>lint::start",
        id: source.filePath,
    });
    debug(`source filePath: %O`, source.filePath);
    debug(`options: %O`, options);
    const plan = getLintPlan(options.config, options.locale ?? "en");
    const promise = lintWithPlan(plan, source, {
        maskSecrets: options.maskSecrets ?? false,
        noPhysicFilePath: options.noPhysicFilePath ?? false,
    });
    if (!secretLintProfiler.isEnabled) {
        return promise;
    }
    return promise.finally(() => {
        secretLintProfiler.mark({
            type: "@core>lint::end",
            id: source.filePath,
        });
    });
};
