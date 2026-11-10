import type { KeywordHits } from "./helper/keyword-matcher.js";
import type {
    SecretLintCoreConfig,
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
let textDecoder: TextDecoder | undefined;
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
    if (textDecoder === undefined) {
        textDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
    }
    return textDecoder.decode(bytes.subarray(start, end));
};

const isKeywordFound = (keywordIndexes: number[], found: Uint8Array): boolean => {
    for (let i = 0; i < keywordIndexes.length; i++) {
        if (found[keywordIndexes[i] as number] === 1) {
            return true;
        }
    }
    return false;
};

/**
 * Return true if a "line" scope pattern matches a line that has its keyword.
 * It decodes only the lines that have a keyword, so the whole content is not decoded for the files without secrets.
 * `view.hits` is the result of scanning the bytes.
 */
const hasLineMatchInBytes = (view: PlanView, bytes: Uint8Array, contentStart: number): boolean => {
    const { matcher, hits, linePatternsOfKeyword } = view;
    if (!matcher || !hits) {
        return false;
    }
    for (const pattern of view.keywordPatterns) {
        pattern.lastLineEnd = -1;
    }
    const positions = hits.positions;
    let lineStart = 0;
    let lineEnd = -1;
    let line: string | undefined;
    for (let i = 0, end = hits.count * 2; i < end; i += 2) {
        const index = positions[i + 1] as number;
        const keywordIndexes = matcher.keywordsOfState(positions[i] as number);
        for (let j = 0; j < keywordIndexes.length; j++) {
            const patterns = linePatternsOfKeyword[keywordIndexes[j] as number] as PlanPattern[];
            for (let k = 0; k < patterns.length; k++) {
                const pattern = patterns[k] as PlanPattern;
                if (index < pattern.lastLineEnd) {
                    // the pattern is already checked for the line
                    continue;
                }
                if (index >= lineEnd) {
                    const previousLineFeed = index === 0 ? -1 : bytes.lastIndexOf(LINE_FEED, index - 1);
                    lineStart = Math.max(previousLineFeed + 1, contentStart);
                    const nextLineFeed = bytes.indexOf(LINE_FEED, index);
                    lineEnd = nextLineFeed < 0 ? bytes.length : nextLineFeed + 1;
                    line = undefined;
                }
                pattern.lastLineEnd = lineEnd;
                if (line === undefined) {
                    line = decodeBytes(bytes, lineStart, lineEnd);
                }
                pattern.regex.lastIndex = 0;
                if (pattern.regex.test(line)) {
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * Collect the lines that have a keyword of each "line" scope pattern into `pattern.lines`.
 * `view.hits` is the result of scanning the text.
 */
const collectKeywordLines = (view: PlanView, text: string): void => {
    const { matcher, hits, linePatternsOfKeyword } = view;
    for (const pattern of view.keywordPatterns) {
        pattern.lastLineEnd = -1;
        pattern.lines.length = 0;
    }
    if (!matcher || !hits) {
        return;
    }
    const positions = hits.positions;
    let lineStart = 0;
    let lineEnd = -1;
    for (let i = 0, end = hits.count * 2; i < end; i += 2) {
        const index = positions[i + 1] as number;
        const keywordIndexes = matcher.keywordsOfState(positions[i] as number);
        for (let j = 0; j < keywordIndexes.length; j++) {
            const patterns = linePatternsOfKeyword[keywordIndexes[j] as number] as PlanPattern[];
            for (let k = 0; k < patterns.length; k++) {
                const pattern = patterns[k] as PlanPattern;
                if (index < pattern.lastLineEnd) {
                    continue;
                }
                if (index >= lineEnd) {
                    lineStart = index === 0 ? 0 : text.lastIndexOf("\n", index - 1) + 1;
                    const nextLineFeed = text.indexOf("\n", index);
                    lineEnd = nextLineFeed < 0 ? text.length : nextLineFeed + 1;
                }
                pattern.lastLineEnd = lineEnd;
                pattern.lines.push(lineStart, lineEnd);
            }
        }
    }
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
    const regex = pattern.regex;
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];
        const startIndex = offset + match.index;
        // `report()` may run another regular expression, but it does not use this copy
        const nextIndex = regex.lastIndex;
        pattern.report(
            {
                text: matchedText,
                range: [startIndex, startIndex + matchedText.length],
                captures: match,
                groups: match.groups,
            },
            context,
        );
        if (matchedText.length === 0) {
            // an empty match does not advance lastIndex. Advance by a character, as String#matchAll does
            const code = text.codePointAt(nextIndex);
            regex.lastIndex = nextIndex + (regex.unicode && code !== undefined && code > 0xffff ? 2 : 1);
        } else {
            regex.lastIndex = nextIndex;
        }
    }
};

type RuleToRun =
    | {
          type: "patterns";
          viewRule: ViewRule;
      }
    | {
          type: "handler";
          viewRule: ViewRule;
          handler: SecretLintRuleReportHandler;
      };

/**
 * Create the result of the lint.
 * `bytes` is `contentBytes` of the source at the start of the lint.
 */
const createResult = (
    source: SecretLintRawSource,
    bytes: Uint8Array | undefined,
    messages: SecretLintCoreResultMessage[],
): SecretLintCoreResult => {
    const contentType = source.contentType;
    if (contentType !== "text") {
        // binary content should be skipped
        return { filePath: source.filePath, sourceContent: undefined, sourceContentType: contentType, messages };
    }
    if (bytes === undefined) {
        return {
            filePath: source.filePath,
            sourceContent: source.content,
            sourceContentType: contentType,
            messages,
        };
    }
    // `source.content` may decode the bytes lazily. Do not read it until the result is used
    return {
        filePath: source.filePath,
        get sourceContent() {
            return source.content;
        },
        sourceContentType: contentType,
        messages,
    };
};

const lintWithPlan = (
    plan: LintPlan,
    source: SecretLintRawSource,
    options: { maskSecrets: boolean; noPhysicFilePath: boolean },
): Promise<SecretLintCoreResult> => {
    const contentType = source.contentType;
    const view = getPlanView(plan, contentType);
    // The bytes may be available only at the start of the lint. See createFileSourceReader() of source-creator
    const bytes = source.contentBytes;
    // 1. Scan the content once for the keywords of all rules.
    //    Scan the bytes if the source has them, because decoding the content costs more than scanning it.
    const { matcher, hits } = view;
    let isTextScanned = false;
    let found: Uint8Array | undefined;
    let runsPatterns = view.hasAlwaysPattern;
    let hasKeywordInBytes = false;
    if (bytes !== undefined) {
        const contentStart = hasUtf8BOM(bytes) ? 3 : 0;
        hasKeywordInBytes = matcher !== undefined && hits !== undefined && matcher.scan(bytes, hits, contentStart);
        if (!hasKeywordInBytes && !view.hasAlwaysPattern && !view.hasAlwaysRule) {
            // Most files end here: no rule runs, and nothing is created for the file except the result
            return Promise.resolve(createResult(source, bytes, []));
        }
        if (hasKeywordInBytes && !runsPatterns) {
            // 2. Check the patterns on the lines that have a keyword, without decoding the whole content
            for (const pattern of view.keywordPatterns) {
                if (
                    pattern.scope === "file" &&
                    isKeywordFound(pattern.keywordIndexes as number[], (hits as KeywordHits).found)
                ) {
                    runsPatterns = true;
                    break;
                }
            }
            runsPatterns = runsPatterns || hasLineMatchInBytes(view, bytes, contentStart);
        }
    }
    // Create a SourceCode for linting.
    // Defer reading the content, because it may be decoded lazily and most files do not need it
    const sourceCode = new SecretLintSourceCodeImpl({
        content: () => source.content,
        filePath: source.filePath,
        physicalFilePath: options.noPhysicFilePath ? undefined : source.filePath,
        ext: source.ext || "",
        contentType,
    });
    if (matcher && hits) {
        found = hits.found;
        if (bytes === undefined) {
            runsPatterns = matcher.scan(sourceCode.content, hits) || runsPatterns;
            isTextScanned = true;
        }
    }
    // Create the rules without patterns that run for the source code.
    // The rules that do not run are not created, so `create()` of the rule is not called for the source code.
    // If `create()` of a rule throws, no handler has started and lintSource throws synchronously.
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
    const rulesToRun: RuleToRun[] = [];
    for (const viewRule of view.rules) {
        if (viewRule.patterns) {
            if (runsPatterns) {
                rulesToRun.push({ type: "patterns", viewRule });
            }
            continue;
        }
        if (viewRule.keywordIndexes !== undefined && !(found && isKeywordFound(viewRule.keywordIndexes, found))) {
            continue;
        }
        const descriptorRule = viewRule.rule.descriptorRule;
        rulesToRun.push({
            type: "handler",
            viewRule,
            // If option is not defined Options is {} by default
            handler: descriptorRule.rule.create(createContext(viewRule), descriptorRule.options || {}),
        });
    }
    if (rulesToRun.length === 0) {
        return Promise.resolve(createResult(source, bytes, []));
    }
    // 3. Run the rules in the registered order
    const promises: Promise<void>[] = [];
    try {
        if (runsPatterns && matcher && hits) {
            if (!isTextScanned) {
                // Indexes of the hits in the bytes are different from the indexes in the text
                matcher.scan(sourceCode.content, hits);
            }
            collectKeywordLines(view, sourceCode.content);
        }
        for (const ruleToRun of rulesToRun) {
            const viewRule = ruleToRun.viewRule;
            const ruleId = viewRule.rule.descriptorRule.rule.meta.id;
            secretLintProfiler.mark({
                type: "@core>rule-handler::start",
                id: ruleId,
            });
            if (ruleToRun.type === "patterns") {
                let context: SecretLintRulePatternContext<any> | undefined;
                const getContext = () => {
                    if (context === undefined) {
                        context = {
                            ...createContext(viewRule),
                            options: viewRule.rule.descriptorRule.options || {},
                            source: sourceCode,
                        };
                    }
                    return context;
                };
                for (const pattern of viewRule.patterns as PlanPattern[]) {
                    if (pattern.keywordIndexes === undefined) {
                        runPattern(pattern, sourceCode.content, 0, getContext());
                    } else if (pattern.scope === "file") {
                        if (found && isKeywordFound(pattern.keywordIndexes, found)) {
                            runPattern(pattern, sourceCode.content, 0, getContext());
                        }
                    } else {
                        const lines = pattern.lines;
                        for (let i = 0; i < lines.length; i += 2) {
                            const lineStart = lines[i] as number;
                            const line = sourceCode.content.slice(lineStart, lines[i + 1] as number);
                            runPattern(pattern, line, lineStart, getContext());
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
            return createResult(source, bytes, []);
        }
        return createResult(
            source,
            bytes,
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
