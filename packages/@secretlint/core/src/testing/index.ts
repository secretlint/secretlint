import * as fs from "node:fs";
import * as path from "node:path";
import * as assert from "node:assert";
import { pathToFileURL } from "node:url";
import type {
    SecretLintCoreResult,
    SecretLintConfigDescriptor,
    SecretLintConfigDescriptorRulePreset,
    SecretLintCoreConfig,
    SecretLintCoreConfigUnionRule,
    SecretLintRawSource,
    SecretLintRuleCreator,
    SecretLintRulePatternKeyword,
    SecretLintRulePresetCreator,
} from "@secretlint/types";
import { createGuardTable, isGuardMetInText, keywordGuardKey, parseKeywordObject } from "../helper/keyword-guard.js";
import { getKeywordScanPlan, lintSource } from "../index.js";
import { getBuiltinRule } from "../builtin/index.js";
import { creator as rulePattern, type Options as RulePatternOptions } from "../builtin/rules/pattern/index.js";

/**
 * Snapshot testing of secretlint rules: `@secretlint/core/testing`.
 * `@secretlint/tester` wraps this, and the tests of the built-in rules in `@secretlint/core` use this directly,
 * because `@secretlint/tester` depends on `@secretlint/core`.
 *
 * Each directory in the snapshot directory is a test case:
 * - `input*`: the file to lint
 * - `.secretlintrc.json` (optional): the config. Otherwise, `defaultConfig` is used
 * - `options.{js,json,ts}` (optional): `{ inputFilePath }`
 * - `output.json`: the expected result. `UPDATE_SNAPSHOT=1` or `updateSnapshot: true` writes it
 */
export type SnapshotOptions = {
    /**
     * The directory that has the test case directories
     */
    snapshotDirectory: string;
    /**
     * The config for a test case that does not have `.secretlintrc.json`
     */
    defaultConfig: SecretLintCoreConfig;
    /**
     * Write `output.json` instead of comparing it. `UPDATE_SNAPSHOT=1` also turns on this option.
     */
    updateSnapshot?: boolean;
    /**
     * Create the source of the input file. `createRawSource` of `@secretlint/source-creator`.
     */
    createRawSource: (filePath: string) => Promise<SecretLintRawSource>;
    /**
     * Load `.secretlintrc.json` of a test case.
     * Default: resolve the rule ids from the built-in rules of `@secretlint/core`.
     */
    loadConfig?: (configFilePath: string) => Promise<SecretLintCoreConfig>;
};
export type SecretLintTestCaseOptions = {
    inputFilePath?: string;
};

const canResolve = (filePath: string): boolean => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};
const defaultInterop = (module: any) => {
    return "default" in module ? module.default : module;
};
const loadTestCaseOptions = async (testCaseDir: string): Promise<SecretLintTestCaseOptions> => {
    if (canResolve(path.join(testCaseDir, "options.js"))) {
        return defaultInterop(await import(pathToFileURL(path.join(testCaseDir, "options.js")).href)).options;
    } else if (canResolve(path.join(testCaseDir, "options.json"))) {
        return JSON.parse(await fs.promises.readFile(path.join(testCaseDir, "options.json"), "utf-8"));
    } else if (canResolve(path.join(testCaseDir, "options.ts"))) {
        return defaultInterop(await import(pathToFileURL(path.join(testCaseDir, "options.ts")).href)).options;
    }
    return {};
};

/**
 * Load `.secretlintrc.json` in the same way as `loadConfig()` of `@secretlint/config-loader`,
 * but resolve the rules only from the built-in rules.
 */
export const loadBuiltinConfig = async (configFilePath: string): Promise<SecretLintCoreConfig> => {
    const descriptor: SecretLintConfigDescriptor = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    const rules = descriptor.rules.map((descriptorRule): SecretLintCoreConfigUnionRule => {
        const rule = getBuiltinRule(descriptorRule.id);
        if (!rule) {
            throw new Error(`${descriptorRule.id} is not a built-in rule. ${configFilePath}`);
        }
        if (rule.meta.type === "preset") {
            const presetDescriptor = descriptorRule as SecretLintConfigDescriptorRulePreset;
            return {
                id: descriptorRule.id,
                rule: rule as SecretLintRulePresetCreator,
                rules: presetDescriptor.rules?.map((presetRule) => ({ ...presetRule, type: "rule" })),
                options: descriptorRule.options,
                disabled: descriptorRule.disabled,
            } as SecretLintCoreConfigUnionRule;
        }
        return {
            id: descriptorRule.id,
            rule: rule as SecretLintRuleCreator,
            options: descriptorRule.options,
            severity: "severity" in descriptorRule ? descriptorRule.severity : undefined,
            disabled: descriptorRule.disabled,
            allowMessageIds: "allowMessageIds" in descriptorRule ? descriptorRule.allowMessageIds : undefined,
        } as SecretLintCoreConfigUnionRule;
    });
    return {
        sharedOptions: descriptor.sharedOptions,
        rules,
    };
};

const sortObject = <T extends { [index: string]: any }>(object: T) => {
    return Object.keys(object)
        .sort()
        .reduce((result, key: keyof T) => {
            result[key] = object[key];
            return result;
        }, {} as T);
};

/**
 * Return the rule that does not use keywords and scopes.
 * secretlint runs the returned rule for all content, and the rule checks the whole content.
 */
const toUnoptimizedRule = <T>(rule: SecretLintRuleCreator<T>): SecretLintRuleCreator<T> => {
    const meta = { ...rule.meta, keywords: undefined };
    if (rule.patterns === undefined) {
        return rule.meta.keywords === undefined ? rule : { ...rule, meta };
    }
    return {
        ...rule,
        meta,
        patterns: rule.patterns.map((pattern) => {
            // `when` is not an optimization: it decides whether the pattern is a part of the rule
            return {
                pattern: pattern.pattern,
                scope: "file",
                when: pattern.when,
                report: pattern.report,
            };
        }),
    };
};
const toUnoptimizedRulePreset = <T>(preset: SecretLintRulePresetCreator<T>): SecretLintRulePresetCreator<T> => {
    return {
        ...preset,
        create(context, options) {
            return preset.create(
                {
                    ...context,
                    registerRule(rule, defaultValue) {
                        return context.registerRule(toUnoptimizedRule(rule), defaultValue);
                    },
                },
                options,
            );
        },
    };
};
const toUnoptimizedConfig = (config: SecretLintCoreConfig): SecretLintCoreConfig => {
    return {
        ...config,
        rules: config.rules.map((descriptor) => {
            if (descriptor.rule === rulePattern) {
                // The core reads the options of the pattern rule as its patterns: `keywords: []` runs them on every file
                const options = (descriptor.options ?? {}) as RulePatternOptions;
                return {
                    ...descriptor,
                    options: {
                        ...options,
                        patterns: options.patterns?.map((entry) => ({ ...entry, keywords: [] })),
                    },
                } as SecretLintCoreConfigUnionRule;
            }
            return {
                ...descriptor,
                rule:
                    descriptor.rule.meta.type === "preset"
                        ? toUnoptimizedRulePreset(descriptor.rule as SecretLintRulePresetCreator)
                        : toUnoptimizedRule(descriptor.rule as SecretLintRuleCreator),
            } as SecretLintCoreConfigUnionRule;
        }),
    };
};

/**
 * A guarded keyword of a rule of the config
 */
type GuardedKeywordOfRule = {
    ruleId: string;
    keyword: string;
    after: string;
    scope: "line" | "file";
    /**
     * The lower-cased keyword and the guard, as the keyword scan plan has them
     */
    planKey: string;
    isMet: (text: string, start: number) => boolean;
};
const planKeyOf = (keyword: string, guardKey: string): string => JSON.stringify([keyword.toLowerCase(), guardKey]);
/**
 * Which guarded keywords the test cases of a snapshot directory have a secret for
 */
type GuardUse = {
    /**
     * The guarded keywords of the patterns that are enabled in a test case, by the rule and the keyword
     */
    guards: Map<string, { guarded: GuardedKeywordOfRule; met: boolean }>;
    /**
     * The ids of the rules that reported a message in a test case
     */
    reportedRuleIds: Set<string>;
};
/**
 * Record the guarded keywords of the test case, and the ones that a reported secret meets.
 * A guard is met by a test case if a message of its rule has the keyword in its lines, with the guard met there.
 */
const recordGuardUse = (
    use: GuardUse,
    config: SecretLintCoreConfig,
    content: string,
    result: SecretLintCoreResult,
    guardedKeywords: readonly GuardedKeywordOfRule[],
): void => {
    if (guardedKeywords.length === 0) {
        return;
    }
    // Only the patterns that are enabled for the options of the test case are in the plan
    const plan = getKeywordScanPlan({ config });
    const enabledKeys = new Set(
        (plan?.keywords ?? []).map((keyword, index) => planKeyOf(keyword, keywordGuardKey(plan?.guards[index]))),
    );
    // The id of a message is the id of the config, which can differ from the id of the rule
    const ruleIdOfConfigId = new Map(config.rules.map((descriptor) => [descriptor.id, descriptor.rule.meta.id]));
    const lowerContent = content.toLowerCase();
    const messagesOfRule = new Map<string, SecretLintCoreResult["messages"]>();
    for (const message of result.messages) {
        const ruleId = ruleIdOfConfigId.get(message.ruleId) ?? message.ruleId;
        use.reportedRuleIds.add(ruleId);
        messagesOfRule.set(ruleId, [...(messagesOfRule.get(ruleId) ?? []), message]);
    }
    for (const guarded of guardedKeywords) {
        if (!enabledKeys.has(guarded.planKey)) {
            continue;
        }
        const key = JSON.stringify([guarded.ruleId, guarded.planKey]);
        const entry = use.guards.get(key) ?? { guarded, met: false };
        use.guards.set(key, entry);
        if (entry.met) {
            continue;
        }
        const keyword = guarded.keyword.toLowerCase();
        entry.met = (messagesOfRule.get(guarded.ruleId) ?? []).some((message) => {
            const from = content.lastIndexOf("\n", message.range[0] - 1) + 1;
            const nextLineFeed = content.indexOf("\n", Math.max(message.range[1] - 1, message.range[0]));
            const to = nextLineFeed >= 0 ? nextLineFeed : content.length;
            for (let index = lowerContent.indexOf(keyword, from); index >= 0 && index < to; ) {
                if (guarded.isMet(content, index + keyword.length)) {
                    return true;
                }
                index = lowerContent.indexOf(keyword, index + 1);
            }
            return false;
        });
    }
};
/**
 * Throw if a rule that reports a secret in the test cases has a guarded keyword that no reported secret meets.
 * Without such a test case, the tests can not find a guard that is written wrong.
 */
const assertGuardUse = (use: GuardUse): void => {
    const unused = [...use.guards.values()].filter(({ guarded, met }) => {
        return !met && use.reportedRuleIds.has(guarded.ruleId);
    });
    if (unused.length === 0) {
        return;
    }
    assert.fail(`No test case has a secret for a keyword with a guard, so the tests can not tell if the guard is right.
${unused.map(({ guarded }) => `${guarded.ruleId}: the keyword "${guarded.keyword}" with the guard "${guarded.after}"`).join("\n")}
Add a test case that the rule reports, with a secret that has the keyword and the characters that meet the guard after it.`);
};
/**
 * Return the keywords without their guards: `{ keyword, after }` becomes the string `keyword`.
 * The guarded keywords are added to `guardedKeywords`.
 */
const toUnguardedKeywords = (
    keywords: readonly SecretLintRulePatternKeyword[],
    ruleId: string,
    scope: "line" | "file",
    guardedKeywords: GuardedKeywordOfRule[],
): SecretLintRulePatternKeyword[] => {
    return keywords.map((item) => {
        if (typeof item !== "object" || item === null) {
            return item;
        }
        const { keyword, after, guard } = parseKeywordObject(item);
        const table = createGuardTable(guard);
        guardedKeywords.push({
            ruleId,
            keyword,
            after,
            scope,
            planKey: planKeyOf(keyword, keywordGuardKey(guard)),
            isMet: (text, start) => isGuardMetInText(text, start, table, guard.min),
        });
        return keyword;
    });
};
const toUnguardedRule = <T>(
    rule: SecretLintRuleCreator<T>,
    guardedKeywords: GuardedKeywordOfRule[],
): SecretLintRuleCreator<T> => {
    const hasGuard = rule.patterns?.some((pattern) => {
        return Array.isArray(pattern.keywords) && pattern.keywords.some((item) => typeof item === "object");
    });
    if (rule.patterns === undefined || !hasGuard) {
        return rule;
    }
    return {
        ...rule,
        patterns: rule.patterns.map((pattern) => {
            if (!Array.isArray(pattern.keywords)) {
                return pattern;
            }
            const scope = pattern.scope === "line" ? "line" : "file";
            return {
                ...pattern,
                keywords: toUnguardedKeywords(pattern.keywords, rule.meta.id, scope, guardedKeywords),
            };
        }),
    };
};
/**
 * Return the config in which each guarded keyword is the same keyword without its guard.
 * `guardedKeywords` gets the guarded keywords of the rules. A preset adds its rules when the config is linted.
 */
const toUnguardedConfig = (
    config: SecretLintCoreConfig,
    guardedKeywords: GuardedKeywordOfRule[],
): SecretLintCoreConfig => {
    return {
        ...config,
        rules: config.rules.map((descriptor) => {
            if (descriptor.rule === rulePattern) {
                const options = (descriptor.options ?? {}) as RulePatternOptions;
                return {
                    ...descriptor,
                    options: {
                        ...options,
                        patterns: options.patterns?.map((entry) => {
                            if (!Array.isArray(entry.keywords)) {
                                return entry;
                            }
                            return {
                                ...entry,
                                keywords: toUnguardedKeywords(
                                    entry.keywords,
                                    rulePattern.meta.id,
                                    "file",
                                    guardedKeywords,
                                ),
                            };
                        }),
                    },
                } as SecretLintCoreConfigUnionRule;
            }
            if (descriptor.rule.meta.type === "preset") {
                const preset = descriptor.rule as SecretLintRulePresetCreator;
                const unguardedPreset: SecretLintRulePresetCreator = {
                    ...preset,
                    create(context, options) {
                        return preset.create(
                            {
                                ...context,
                                registerRule(rule, defaultValue) {
                                    return context.registerRule(toUnguardedRule(rule, guardedKeywords), defaultValue);
                                },
                            },
                            options,
                        );
                    },
                };
                return { ...descriptor, rule: unguardedPreset } as SecretLintCoreConfigUnionRule;
            }
            return {
                ...descriptor,
                rule: toUnguardedRule(descriptor.rule as SecretLintRuleCreator, guardedKeywords),
            } as SecretLintCoreConfigUnionRule;
        }),
    };
};
/**
 * Throw if a guard rejects a secret: the lint without guards reports a message that the lint does not report.
 * The error names the rule, the guarded keyword, and the place of the keyword whose guard is not met.
 */
const assertGuards = (
    content: string,
    result: SecretLintCoreResult,
    unguardedResult: SecretLintCoreResult,
    guardedKeywords: readonly GuardedKeywordOfRule[],
): void => {
    const keyOf = (message: SecretLintCoreResult["messages"][number]) => {
        return JSON.stringify([message.ruleId, message.messageId, message.range]);
    };
    const reported = new Set(result.messages.map(keyOf));
    const rejected = unguardedResult.messages.filter((message) => !reported.has(keyOf(message)));
    if (rejected.length === 0) {
        return;
    }
    const lowerContent = content.toLowerCase();
    const positionOf = (index: number): string => {
        const lineStart = content.lastIndexOf("\n", index - 1) + 1;
        const line = content.slice(0, lineStart).split("\n").length;
        return `${line}:${index - lineStart + 1}`;
    };
    const errors = rejected.map((message) => {
        const ofRule = guardedKeywords.filter((guarded) => guarded.ruleId === message.ruleId);
        // The id of a message can be the id of the config. Then look at the guarded keywords of all rules
        const candidates = ofRule.length > 0 ? ofRule : guardedKeywords;
        const secretAt = `${positionOf(message.range[0])}-${positionOf(message.range[1])}`;
        const notMet: string[] = [];
        for (const guarded of candidates) {
            // A "line" scope pattern runs on the lines of its keywords, and a "file" scope pattern on the content
            const from = guarded.scope === "line" ? content.lastIndexOf("\n", message.range[0] - 1) + 1 : 0;
            const nextLineFeed = content.indexOf("\n", Math.max(message.range[1] - 1, message.range[0]));
            const to = guarded.scope === "line" && nextLineFeed >= 0 ? nextLineFeed : content.length;
            const keyword = guarded.keyword.toLowerCase();
            const places: number[] = [];
            let isMetSomewhere = false;
            for (let index = lowerContent.indexOf(keyword, from); index >= 0 && index < to; ) {
                if (guarded.isMet(content, index + keyword.length)) {
                    isMetSomewhere = true;
                } else {
                    places.push(index);
                }
                index = lowerContent.indexOf(keyword, index + 1);
            }
            if (!isMetSomewhere && places.length > 0) {
                notMet.push(
                    `${guarded.ruleId}: the guard "${guarded.after}" of the keyword "${guarded.keyword}" is not met at ${places
                        .slice(0, 5)
                        .map(positionOf)
                        .join(", ")}, but the rule reports a secret at ${secretAt}.`,
                );
            }
        }
        if (notMet.length === 0) {
            return `${message.ruleId}: a guard of a keyword rejects the secret at ${secretAt}.`;
        }
        return notMet.join("\n");
    });
    assert.fail(`A guard of a keyword rejects a secret that the rule reports without the guard.
${errors.join("\n")}
Every secret of the pattern must have the characters that meet the guard after the keyword. Check \`after\` of the keyword.`);
};

export type SnapshotTestCase = {
    name: string;
    /**
     * Return "skip" if the snapshot is written
     */
    run: () => Promise<"skip" | "done">;
};

/**
 * Return the test cases in the snapshot directory
 */
export const createSnapshotTestCases = (options: SnapshotOptions): SnapshotTestCase[] => {
    const { snapshotDirectory, defaultConfig, createRawSource } = options;
    const loadConfig = options.loadConfig ?? loadBuiltinConfig;
    const updateSnapshot = !!process.env.UPDATE_SNAPSHOT || !!options.updateSnapshot;
    const snapshotReplacer = (key: string, value: any) => {
        if (key === "filePath") {
            // normalize path separator for Windows
            return value.replace(snapshotDirectory, "[SNAPSHOT]").replace(/\\/g, "/");
        }
        return value;
    };
    const guardUse: GuardUse = { guards: new Map(), reportedRuleIds: new Set() };
    const finishedCases = new Set<string>();
    const testCases = fs
        .readdirSync(snapshotDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
        .map(({ name: caseName }): SnapshotTestCase => {
            return {
                name: caseName.replace(/[-_]/g, " "),
                run: async () => {
                    finishedCases.add(caseName);
                    const testCaseDir = path.join(snapshotDirectory, caseName);
                    const secretlintrcFilePath = path.join(testCaseDir, ".secretlintrc.json");
                    const testCaseOptions = await loadTestCaseOptions(testCaseDir);
                    const inputFileName =
                        testCaseOptions.inputFilePath ??
                        fs.readdirSync(testCaseDir).find((fileName) => fileName.startsWith("input"));
                    if (!inputFileName) {
                        throw new Error(`Not found input file in ${testCaseDir}`);
                    }
                    const config = fs.existsSync(secretlintrcFilePath)
                        ? await loadConfig(secretlintrcFilePath)
                        : defaultConfig;
                    const rawSource = await createRawSource(path.join(testCaseDir, inputFileName));
                    const bytesResult = await lintSource({ source: rawSource, options: { config } });
                    // `patterns` and `meta.keywords` are optimizations. They should not change the result.
                    // - Lint the content as a string. A browser does not pass the bytes of the content.
                    // - Lint without `patterns` and `meta.keywords`: the rule checks the whole content.
                    const { contentBytes: _contentBytes, ...textSource } = rawSource;
                    const textResult = await lintSource({ source: textSource, options: { config } });
                    const unoptimizedResult = await lintSource({
                        source: textSource,
                        options: { config: toUnoptimizedConfig(config) },
                    });
                    // A guard of a keyword is checked by itself, before the comparison with the unoptimized result,
                    // so that the error names the guard.
                    if (textSource.contentType === "text") {
                        const guardedKeywords: GuardedKeywordOfRule[] = [];
                        const unguardedConfig = toUnguardedConfig(config, guardedKeywords);
                        const hasPreset = config.rules.some((descriptor) => descriptor.rule.meta.type === "preset");
                        if (guardedKeywords.length > 0 || hasPreset) {
                            const unguardedResult = await lintSource({
                                source: textSource,
                                options: { config: unguardedConfig },
                            });
                            assertGuards(textSource.content, textResult, unguardedResult, guardedKeywords);
                            recordGuardUse(guardUse, config, textSource.content, textResult, guardedKeywords);
                        }
                    }
                    const normalizeResult = (result: unknown) => JSON.parse(JSON.stringify(result));
                    // For text (and unknown), the bytes are only for speed, so the results should be the same without them.
                    // For binary, a rule needs the bytes: the decoded string has lost them.
                    const isText = rawSource.contentType !== "binary";
                    if (isText) {
                        assert.deepStrictEqual(
                            normalizeResult(bytesResult),
                            normalizeResult(textResult),
                            "The result of the content bytes should be the same as the result of the content string",
                        );
                        assert.deepStrictEqual(
                            normalizeResult(textResult),
                            normalizeResult(unoptimizedResult),
                            "The result with `patterns` and `meta.keywords` should be the same as the result of the whole content without them. Check keywords and scope of the rule.",
                        );
                    }
                    // The result does not have the content of the source.
                    // The snapshot has it as `sourceContent` to show what the ranges of the messages point to.
                    const snapshotResult = {
                        ...(isText ? textResult : bytesResult),
                        sourceContent: textSource.contentType === "text" ? textSource.content : undefined,
                    };
                    const expectedFilePath = path.join(testCaseDir, "output.json");
                    if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                        fs.writeFileSync(
                            expectedFilePath,
                            JSON.stringify(sortObject(snapshotResult), snapshotReplacer, 4),
                        );
                        return "skip";
                    }
                    const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                    assert.deepStrictEqual(JSON.parse(JSON.stringify(snapshotResult, snapshotReplacer)), expected);
                    return "done";
                },
            };
        });
    return [
        ...testCases,
        {
            // It runs after the test cases, and it looks at all of them
            name: "every keyword with a guard has a test case",
            run: async () => {
                // If only some test cases ran, such as with a filter of the test runner, nothing can be told
                if (finishedCases.size === testCases.length) {
                    assertGuardUse(guardUse);
                }
                return "done";
            },
        },
    ];
};
