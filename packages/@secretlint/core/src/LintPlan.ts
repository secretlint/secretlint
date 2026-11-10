/**
 * A lint plan is the rules of a config, compiled for linting many sources.
 *
 * `lintSource()` is called for each file with the same config.
 * The plan keeps what does not depend on the file: the registered rules, their keywords, and their patterns.
 * So linting a file starts with one scan for the keywords of all rules,
 * and a rule does its work only for the files (or the lines) that have its keywords.
 */
import type {
    SecretLintCoreConfig,
    SecretLintCoreConfigRule,
    SecretLintCoreConfigRulePreset,
    SecretLintCoreConfigUnionRule,
    SecretLintRuleContentType,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleLocaleTag,
    SecretLintRulePattern,
    SecretLintRulePresetContext,
    SecretLintRawSource,
} from "@secretlint/types";
import { secretLintProfiler } from "@secretlint/profiler";
import debug0 from "debug";
import { getKeywordMatcher, KeywordHits, KeywordMatcher, normalizeKeyword } from "./helper/keyword-matcher.js";
import { AllowMessage } from "./messages/filter-message-id.js";

const debug = debug0("@secretlint/core");

type ContentType = SecretLintRawSource["contentType"];

/**
 * A pattern of a rule, compiled for a content type
 */
export type PlanPattern = {
    /**
     * A copy of the pattern with the "g" flag. The plan owns `lastIndex` of the copy.
     */
    regex: RegExp;
    scope: "line" | "file";
    /**
     * Indexes of the keywords in the matcher. undefined if the pattern runs for all content.
     */
    keywordIndexes: number[] | undefined;
    report: SecretLintRulePattern["report"];
    /**
     * Scratch data for a lint: pairs of [start, end] of the lines to run the pattern on
     */
    lines: number[];
    /**
     * Scratch data for a lint: the end of the last line that is checked for the pattern
     */
    lastLineEnd: number;
};
/**
 * A registered rule
 */
export type PlanRule = {
    descriptorRule: SecretLintCoreConfigRule;
    /**
     * The id of the preset, if the rule is registered by a preset
     */
    ruleParentId: string | undefined;
    /**
     * Normalized `meta.keywords`. undefined if the rule always runs.
     * It is used only if the rule has no patterns.
     */
    keywords: string[] | undefined;
    /**
     * Declarative patterns. If it is defined, `create()` of the rule is not called.
     */
    patterns: CompiledPattern[] | undefined;
    /**
     * `meta.keywords` and `patterns` of the rule when the plan is created
     */
    metaKeywords: unknown;
    metaPatterns: unknown;
};
type CompiledPattern = {
    source: SecretLintRulePattern;
    regex: RegExp;
    scope: "line" | "file";
    keywords: string[] | undefined;
};
/**
 * A rule in a view
 */
export type ViewRule = {
    rule: PlanRule;
    /**
     * Indexes of `meta.keywords` in the matcher, for a rule without patterns.
     * undefined if the rule always runs.
     */
    keywordIndexes: number[] | undefined;
    patterns: PlanPattern[] | undefined;
};
/**
 * The rules that support a content type, and the matcher for their keywords
 */
export type PlanView = {
    rules: ViewRule[];
    /**
     * undefined if no rule has keywords
     */
    matcher: KeywordMatcher | undefined;
    hits: KeywordHits | undefined;
    /**
     * Patterns with keywords, in the order of the rules
     */
    keywordPatterns: PlanPattern[];
    /**
     * "line" scope patterns for each keyword index
     */
    linePatternsOfKeyword: PlanPattern[][];
    /**
     * true if a pattern has no keywords and runs for all content
     */
    hasAlwaysPattern: boolean;
};
export type LintPlan = {
    config: SecretLintCoreConfig;
    locale: SecretLintRuleLocaleTag;
    rules: PlanRule[];
    allowMessageIds: AllowMessage[];
    views: Map<ContentType, PlanView>;
    /**
     * What the plan is made from. If it is changed, the plan is created again.
     */
    snapshot: unknown[];
};

const isRulePreset = (
    ruleDescriptor: SecretLintCoreConfigUnionRule,
): ruleDescriptor is SecretLintCoreConfigRulePreset => {
    return ruleDescriptor.rule.meta.type === "preset";
};
const isRule = (ruleDescriptor: SecretLintCoreConfigUnionRule): ruleDescriptor is SecretLintCoreConfigRule => {
    return ruleDescriptor.rule.meta.type === "scanner";
};

/**
 * Normalize keywords.
 * Return undefined if the pre-filter can not be used: no keywords, empty keywords, or an invalid keyword.
 */
const normalizeKeywords = (keywords: unknown): string[] | undefined => {
    if (!Array.isArray(keywords) || keywords.length === 0) {
        return undefined;
    }
    const normalized: string[] = [];
    for (const keyword of keywords) {
        const normalizedKeyword = normalizeKeyword(keyword);
        if (normalizedKeyword === undefined) {
            return undefined;
        }
        normalized.push(normalizedKeyword);
    }
    return normalized;
};

/**
 * Return a copy of the regular expression with the "g" flag.
 * The copy does not share `lastIndex` with the regular expression of the rule.
 */
export const toGlobalRegExp = (pattern: RegExp): RegExp => {
    return new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
};

const compilePatterns = (rule: SecretLintRuleCreator<any>): CompiledPattern[] | undefined => {
    const patterns = rule.patterns;
    if (!Array.isArray(patterns)) {
        return undefined;
    }
    return patterns.map((pattern) => {
        const keywords = normalizeKeywords(pattern.keywords);
        // A line is found by its keyword, so "line" needs keywords.
        // A keyword with a line break does not tell which line the pattern should run on.
        const canUseLineScope =
            pattern.scope === "line" && keywords !== undefined && keywords.every((keyword) => !keyword.includes("\n"));
        return {
            source: pattern,
            regex: toGlobalRegExp(pattern.pattern),
            scope: canUseLineScope ? "line" : "file",
            keywords,
        };
    });
};

/**
 * Values of the config that the plan depends on.
 * A config is a plain object, and it can be changed between `lintSource()` calls.
 */
const createConfigSnapshot = (config: SecretLintCoreConfig): unknown[] => {
    const snapshot: unknown[] = [config.sharedOptions, config.rules, config.rules.length];
    for (const descriptor of config.rules) {
        snapshot.push(descriptor, descriptor.id, descriptor.rule, descriptor.options, descriptor.disabled);
        if (isRulePreset(descriptor)) {
            const presetRules = descriptor.rules;
            snapshot.push(presetRules);
            if (Array.isArray(presetRules)) {
                snapshot.push(presetRules.length);
                for (const presetRule of presetRules) {
                    snapshot.push(
                        presetRule,
                        presetRule.id,
                        presetRule.options,
                        presetRule.disabled,
                        presetRule.severity,
                        presetRule.allowMessageIds,
                    );
                }
            }
        } else {
            const rule = descriptor as SecretLintCoreConfigRule;
            snapshot.push(rule.severity, rule.allowMessageIds);
        }
    }
    return snapshot;
};
/**
 * Return true if nothing that the plan depends on is changed.
 * This runs for each `lintSource()` call, so it compares references only:
 * the config, the rule descriptors, `meta.keywords` and `patterns` of the rules.
 * Replace these arrays and objects to change them. A change inside them is not found.
 */
const isFreshPlan = (plan: LintPlan, config: SecretLintCoreConfig): boolean => {
    const rules = plan.rules;
    for (let i = 0; i < rules.length; i++) {
        const planRule = rules[i] as PlanRule;
        const creator = planRule.descriptorRule.rule;
        if (creator.meta.keywords !== planRule.metaKeywords || creator.patterns !== planRule.metaPatterns) {
            return false;
        }
    }
    const snapshot = plan.snapshot;
    const current = createConfigSnapshot(config);
    if (snapshot.length !== current.length) {
        return false;
    }
    for (let i = 0; i < snapshot.length; i++) {
        if (snapshot[i] !== current[i]) {
            return false;
        }
    }
    return true;
};

const createLintPlan = (config: SecretLintCoreConfig, locale: SecretLintRuleLocaleTag): LintPlan => {
    const registered = new Set<string>();
    const rules: PlanRule[] = [];
    // sharedOptions is {} by default
    // sharedOptions is shared between presets and rules
    const sharedOptions = config.sharedOptions ?? {};
    const registerRule = (descriptorRule: SecretLintCoreConfigRule, ruleParentId: string | undefined) => {
        if (registered.has(descriptorRule.id)) {
            // TODO: more trivial implementation
            throw new Error(`rule.id:${descriptorRule.id} is already registered.

Duplicated rule.id is something wrong in .secretlintrc.
`);
        }
        registered.add(descriptorRule.id);
        rules.push({
            descriptorRule,
            ruleParentId,
            keywords: normalizeKeywords(descriptorRule.rule.meta.keywords),
            patterns: compilePatterns(descriptorRule.rule),
            metaKeywords: descriptorRule.rule.meta.keywords,
            metaPatterns: descriptorRule.rule.patterns,
        });
    };
    secretLintProfiler.mark({
        type: "@core>setup-rules::start",
    });
    for (const descriptor of config.rules) {
        const ruleId = descriptor.id;
        // Do not register disabled rule
        if (descriptor.disabled) {
            debug("Skip registerRule %s, because it is disabled", ruleId);
            continue;
        }
        debug("registerRule %s", ruleId);
        secretLintProfiler.mark({
            type: "@core>setup-rule::start",
            id: descriptor.rule.meta.id,
        });
        if (isRulePreset(descriptor)) {
            const presetRules = descriptor.rules || [];
            if (!Array.isArray(presetRules)) {
                console.error(`${descriptor.id}:PresetRules is invalid format`, presetRules);
                throw new Error("preset's rules should be an array of rule definitions");
            }
            const context: SecretLintRulePresetContext = {
                sharedOptions,
                registerRule<Options extends SecretLintRuleCreatorOptions>(
                    rule: SecretLintRuleCreator<Options>,
                    defaultValue?: Omit<SecretLintCoreConfigRule<Options>, "id" | "rule">,
                ): void {
                    const descriptorRule = presetRules.find((descriptorRule) => {
                        return descriptorRule.id === rule.meta.id;
                    });
                    registerRule(
                        {
                            // options and disabled ...
                            ...(defaultValue ?? {}),
                            // Prefer to use user setting
                            // User can override preset setting
                            ...descriptorRule,
                            id: rule.meta.id,
                            // Use undefined instead of {}
                            options: descriptorRule ? descriptorRule.options : undefined,
                            rule: rule as SecretLintRuleCreator<any>,
                            disabled: descriptorRule ? descriptorRule.disabled : undefined,
                            allowMessageIds: descriptorRule ? descriptorRule.allowMessageIds : undefined,
                            severity: descriptorRule ? descriptorRule.severity : undefined,
                        },
                        // parent rule id is rule preset id
                        descriptor.id,
                    );
                },
            };
            // Internally, RulePreset#create calls `registerRule`
            descriptor.rule.create(context, descriptor.options || []);
        } else if (isRule(descriptor)) {
            registerRule(descriptor, undefined);
        } else {
            throw new Error(`Unknown descriptor type: ${descriptor}`);
        }
        secretLintProfiler.mark({
            type: "@core>setup-rule::end",
            id: descriptor.rule.meta.id,
        });
    }
    secretLintProfiler.mark({
        type: "@core>setup-rules::end",
    });
    const allowMessageIds: AllowMessage[] = [];
    for (const { descriptorRule } of rules) {
        const ruleId = descriptorRule.rule.meta.id;
        descriptorRule.allowMessageIds?.forEach((messageId) => {
            allowMessageIds.push({ messageId, ruleId });
        });
    }
    return {
        config,
        locale,
        rules,
        allowMessageIds,
        views: new Map(),
        snapshot: createConfigSnapshot(config),
    };
};

const supportContentType = (rule: PlanRule, contentType: ContentType): boolean => {
    if (contentType === "unknown") {
        return true;
    }
    const supportedContentTypes: SecretLintRuleContentType[] = rule.descriptorRule.rule.meta.supportedContentTypes;
    return supportedContentTypes.includes("all") || supportedContentTypes.includes(contentType);
};

const createView = (plan: LintPlan, contentType: ContentType): PlanView => {
    const targets = plan.rules.filter((rule) => supportContentType(rule, contentType));
    const allKeywords = new Set<string>();
    for (const rule of targets) {
        if (rule.patterns) {
            rule.patterns.forEach((pattern) => pattern.keywords?.forEach((keyword) => allKeywords.add(keyword)));
        } else {
            rule.keywords?.forEach((keyword) => allKeywords.add(keyword));
        }
    }
    const matcher = allKeywords.size > 0 ? getKeywordMatcher([...allKeywords].sort()) : undefined;
    const indexOf = new Map((matcher?.keywords ?? []).map((keyword, index) => [keyword, index]));
    const toIndexes = (keywords: string[] | undefined): number[] | undefined => {
        return keywords?.map((keyword) => indexOf.get(keyword) as number);
    };
    const keywordPatterns: PlanPattern[] = [];
    const linePatternsOfKeyword: PlanPattern[][] = (matcher?.keywords ?? []).map(() => []);
    let hasAlwaysPattern = false;
    const rules = targets.map((rule): ViewRule => {
        if (!rule.patterns) {
            return { rule, keywordIndexes: toIndexes(rule.keywords), patterns: undefined };
        }
        const patterns = rule.patterns.map((pattern): PlanPattern => {
            const planPattern: PlanPattern = {
                regex: pattern.regex,
                scope: pattern.scope,
                keywordIndexes: toIndexes(pattern.keywords),
                report: pattern.source.report,
                lines: [],
                lastLineEnd: -1,
            };
            if (planPattern.keywordIndexes === undefined) {
                hasAlwaysPattern = true;
            } else {
                keywordPatterns.push(planPattern);
                if (planPattern.scope === "line") {
                    for (const index of planPattern.keywordIndexes) {
                        (linePatternsOfKeyword[index] as PlanPattern[]).push(planPattern);
                    }
                }
            }
            return planPattern;
        });
        return { rule, keywordIndexes: undefined, patterns };
    });
    return {
        rules,
        matcher,
        hits: matcher?.createHits(),
        keywordPatterns,
        linePatternsOfKeyword,
        hasAlwaysPattern,
    };
};

export const getPlanView = (plan: LintPlan, contentType: ContentType): PlanView => {
    let view = plan.views.get(contentType);
    if (!view) {
        view = createView(plan, contentType);
        plan.views.set(contentType, view);
    }
    return view;
};

const planCache = new WeakMap<SecretLintCoreConfig, Map<SecretLintRuleLocaleTag, LintPlan>>();
/**
 * Return the plan for the config.
 * The plan is cached by the config object, and it is created again if the config or a rule is changed.
 */
export const getLintPlan = (config: SecretLintCoreConfig, locale: SecretLintRuleLocaleTag): LintPlan => {
    let plans = planCache.get(config);
    const cached = plans?.get(locale);
    if (cached && isFreshPlan(cached, config)) {
        return cached;
    }
    const plan = createLintPlan(config, locale);
    if (!plans) {
        plans = new Map();
        planCache.set(config, plans);
    }
    plans.set(locale, plan);
    return plan;
};
