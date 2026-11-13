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
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleLocaleTag,
    SecretLintRulePattern,
    SecretLintRulePresetContext,
    SecretLintRawSource,
} from "@secretlint/types";
import { secretLintProfiler } from "@secretlint/profiler";
import debug0 from "debug";
import { getKeywordMatcher, KeywordMatcher, normalizeKeyword } from "./helper/keyword-matcher.js";
import { AllowMessage } from "./messages/filter-message-id.js";

const debug = debug0("@secretlint/core");

type ContentType = SecretLintRawSource["contentType"];

/**
 * A pattern of a rule, compiled for a content type
 */
export type PlanPattern = {
    /**
     * The index of the pattern in `keywordPatterns` of the view. -1 if the pattern has no keywords.
     */
    readonly index: number;
    /**
     * A copy of the pattern with the "g" flag, for `String#matchAll`. `matchAll` does not change it.
     */
    readonly regex: RegExp;
    /**
     * A copy of the pattern without the "g" and "y" flags, for `RegExp#test`. `test` does not change it.
     */
    readonly tester: RegExp;
    readonly scope: "line" | "file";
    /**
     * Indexes of the keywords in the matcher. undefined if the pattern runs for all content.
     */
    readonly keywordIndexes: readonly number[] | undefined;
    readonly report: SecretLintRulePattern["report"];
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
    tester: RegExp;
    scope: "line" | "file";
    keywords: string[] | undefined;
    /**
     * true if the keywords are matched case-sensitively
     */
    caseSensitiveKeywords: boolean;
};
/**
 * A rule in a view
 */
export type ViewRule = {
    readonly rule: PlanRule;
    /**
     * Indexes of `meta.keywords` in the matcher, for a rule without patterns.
     * undefined if the rule always runs.
     */
    readonly keywordIndexes: readonly number[] | undefined;
    readonly patterns: readonly PlanPattern[] | undefined;
};
/**
 * The rules that support a content type, and the matcher for their keywords
 */
export type PlanView = {
    readonly rules: readonly ViewRule[];
    /**
     * undefined if no rule has keywords
     */
    readonly matcher: KeywordMatcher | undefined;
    /**
     * Patterns with keywords, in the order of the rules
     */
    readonly keywordPatterns: readonly PlanPattern[];
    /**
     * "line" scope patterns for each keyword index
     */
    readonly linePatternsOfKeyword: readonly (readonly PlanPattern[])[];
    /**
     * true if a pattern has no keywords and runs for all content
     */
    readonly hasAlwaysPattern: boolean;
    /**
     * true if a rule without patterns has no keywords and runs for all content
     */
    readonly hasAlwaysRule: boolean;
    /**
     * true if a pattern with keywords needs the whole content ("file" scope)
     */
    readonly hasFilePattern: boolean;
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
const normalizeKeywords = (keywords: unknown, caseSensitive: boolean = false): string[] | undefined => {
    if (!Array.isArray(keywords) || keywords.length === 0) {
        return undefined;
    }
    const normalized: string[] = [];
    for (const keyword of keywords) {
        const normalizedKeyword = normalizeKeyword(keyword, caseSensitive);
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
/**
 * Return a copy of the regular expression without the "g" and "y" flags.
 * `test()` of the copy does not read or write `lastIndex`, so it has no state.
 */
export const toStatelessRegExp = (pattern: RegExp): RegExp => {
    return new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, ""));
};

/**
 * The properties of a pattern that this version of secretlint knows.
 */
const KNOWN_PATTERN_PROPERTIES: ReadonlySet<string> = new Set([
    "pattern",
    "keywords",
    "caseSensitiveKeywords",
    "scope",
    "enabledByOption",
    "report",
] satisfies (keyof SecretLintRulePattern<any>)[]);
/**
 * Throw if the pattern has a property that this version of secretlint does not know.
 * A rule is data, and a newer rule may use a property that changes what the pattern matches.
 * Ignoring the property would change the result silently, so it is an error.
 * A new property must have a new name: the meaning of a known property is never changed.
 */
const assertKnownPatternProperties = (rule: SecretLintRuleCreator<any>, pattern: { scope?: unknown }): void => {
    const unknownProperties = Object.keys(pattern).filter((property) => !KNOWN_PATTERN_PROPERTIES.has(property));
    if (unknownProperties.length > 0) {
        throw new Error(
            `The rule "${rule.meta.id}" has a pattern with unknown properties: ${unknownProperties.join(", ")}
This version of secretlint does not support the properties. Please update secretlint.`,
        );
    }
    // A wrong scope is a mistake of the rule, or a scope of a newer secretlint
    const scope = pattern.scope;
    if (scope !== undefined && scope !== "line" && scope !== "file") {
        throw new Error(
            `The rule "${rule.meta.id}" has a pattern with unknown scope: ${JSON.stringify(scope)}
The scope should be "line" or "file". If it is a scope of a newer secretlint, please update secretlint.`,
        );
    }
};
/**
 * Return true if the pattern is enabled for the options of the rule.
 * A pattern with `enabledByOption` is enabled only if the value of that option is truthy.
 */
const isEnabledPattern = (
    rule: SecretLintRuleCreator<any>,
    pattern: SecretLintRulePattern<any>,
    options: SecretLintRuleCreatorOptions,
): boolean => {
    const optionName: unknown = pattern.enabledByOption;
    if (optionName === undefined) {
        return true;
    }
    if (typeof optionName !== "string" || optionName === "") {
        throw new Error(
            `The rule "${rule.meta.id}" has a pattern whose \`enabledByOption\` is not a name of an option.
It should be a string that is not empty.`,
        );
    }
    return Object.hasOwn(options, optionName) && Boolean((options as Record<string, unknown>)[optionName]);
};
/**
 * Compile the patterns of the rule that are enabled for the options.
 * A disabled pattern is not in the plan, so its keywords are not searched and it never runs.
 */
const compilePatterns = (
    rule: SecretLintRuleCreator<any>,
    options: SecretLintRuleCreatorOptions,
): CompiledPattern[] | undefined => {
    const patterns = rule.patterns;
    if (!Array.isArray(patterns)) {
        return undefined;
    }
    patterns.forEach((pattern) => assertKnownPatternProperties(rule, pattern));
    return patterns
        .filter((pattern) => isEnabledPattern(rule, pattern, options))
        .map((pattern) => {
            const caseSensitiveKeywords = pattern.caseSensitiveKeywords === true;
            const keywords = normalizeKeywords(pattern.keywords, caseSensitiveKeywords);
            // A line is found by its keyword, so "line" needs keywords.
            // A keyword with a line break does not tell which line the pattern should run on.
            const canUseLineScope =
                pattern.scope === "line" &&
                keywords !== undefined &&
                keywords.every((keyword) => !keyword.includes("\n"));
            return {
                source: pattern,
                regex: toGlobalRegExp(pattern.pattern),
                tester: toStatelessRegExp(pattern.pattern),
                scope: canUseLineScope ? "line" : "file",
                keywords,
                caseSensitiveKeywords,
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
            // If option is not defined Options is {} by default
            patterns: compilePatterns(descriptorRule.rule, descriptorRule.options || {}),
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
                    // Do not register a rule that is disabled in the preset's rules
                    if (descriptorRule?.disabled) {
                        debug("Skip registerRule %s in %s, because it is disabled", rule.meta.id, descriptor.id);
                        return;
                    }
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
    // "all" is not in the type now, but older rules declare it. It means both text and binary.
    const supportedContentTypes: readonly string[] = rule.descriptorRule.rule.meta.supportedContentTypes;
    return supportedContentTypes.includes("all") || supportedContentTypes.includes(contentType);
};

const createView = (plan: LintPlan, contentType: ContentType): PlanView => {
    const targets = plan.rules.filter((rule) => supportContentType(rule, contentType));
    // `meta.keywords` is for text content. A rule that supports other content always runs for it,
    // because such a rule checks the structure of the content or the file name, not the keywords.
    const keywordsOfRule = (rule: PlanRule): string[] | undefined => {
        return contentType === "text" ? rule.keywords : undefined;
    };
    // A keyword is identified by its text and whether it is case-sensitive
    const keywordKey = (keyword: string, caseSensitive: boolean) => `${caseSensitive ? "S" : "I"}${keyword}`;
    const allKeywords = new Map<string, { keyword: string; caseSensitive: boolean }>();
    const addKeywords = (keywords: string[] | undefined, caseSensitive: boolean) => {
        keywords?.forEach((keyword) => {
            allKeywords.set(keywordKey(keyword, caseSensitive), { keyword, caseSensitive });
        });
    };
    for (const rule of targets) {
        if (rule.patterns) {
            rule.patterns.forEach((pattern) => addKeywords(pattern.keywords, pattern.caseSensitiveKeywords));
        } else {
            addKeywords(keywordsOfRule(rule), false);
        }
    }
    const sortedKeys = [...allKeywords.keys()].sort();
    const matcher =
        sortedKeys.length > 0
            ? getKeywordMatcher(
                  sortedKeys.map((key) => (allKeywords.get(key) as { keyword: string }).keyword),
                  sortedKeys.map((key) => (allKeywords.get(key) as { caseSensitive: boolean }).caseSensitive),
              )
            : undefined;
    const indexOf = new Map(sortedKeys.map((key, index) => [key, index]));
    const toIndexes = (keywords: string[] | undefined, caseSensitive: boolean = false): number[] | undefined => {
        return keywords?.map((keyword) => indexOf.get(keywordKey(keyword, caseSensitive)) as number);
    };
    // Number the patterns with keywords in the order of the rules
    const patternIndexes = new Map(
        targets
            .flatMap((rule) => rule.patterns ?? [])
            .filter((pattern) => pattern.keywords !== undefined)
            .map((pattern, index) => [pattern, index]),
    );
    const rules = targets.map((rule): ViewRule => {
        if (!rule.patterns) {
            return { rule, keywordIndexes: toIndexes(keywordsOfRule(rule)), patterns: undefined };
        }
        const patterns = rule.patterns.map((pattern): PlanPattern => {
            return {
                index: patternIndexes.get(pattern) ?? -1,
                regex: pattern.regex,
                tester: pattern.tester,
                scope: pattern.scope,
                keywordIndexes: toIndexes(pattern.keywords, pattern.caseSensitiveKeywords),
                report: pattern.source.report,
            };
        });
        return { rule, keywordIndexes: undefined, patterns };
    });
    const allPatterns = rules.flatMap((rule) => rule.patterns ?? []);
    const keywordPatterns = allPatterns.filter((pattern) => pattern.keywordIndexes !== undefined);
    const linePatternsOfKeyword = (matcher?.keywords ?? []).map((_, keywordIndex) => {
        return keywordPatterns.filter((pattern) => {
            return pattern.scope === "line" && (pattern.keywordIndexes as readonly number[]).includes(keywordIndex);
        });
    });
    return {
        rules,
        matcher,
        keywordPatterns,
        linePatternsOfKeyword,
        hasAlwaysPattern: allPatterns.some((pattern) => pattern.keywordIndexes === undefined),
        hasAlwaysRule: rules.some((rule) => rule.patterns === undefined && rule.keywordIndexes === undefined),
        hasFilePattern: keywordPatterns.some((pattern) => pattern.scope === "file"),
    };
};

export const getPlanView = (plan: LintPlan, contentType: ContentType): PlanView => {
    const cached = plan.views.get(contentType);
    if (cached) {
        return cached;
    }
    const view = createView(plan, contentType);
    plan.views.set(contentType, view);
    return view;
};

const planCache = new WeakMap<SecretLintCoreConfig, Map<SecretLintRuleLocaleTag, LintPlan>>();
/**
 * Return the plan for the config.
 * The plan is cached by the config object, and it is created again if the config or a rule is changed.
 */
export const getLintPlan = (config: SecretLintCoreConfig, locale: SecretLintRuleLocaleTag): LintPlan => {
    const plans = planCache.get(config);
    const cached = plans?.get(locale);
    if (cached && isFreshPlan(cached, config)) {
        return cached;
    }
    const plan = createLintPlan(config, locale);
    if (plans) {
        plans.set(locale, plan);
    } else {
        planCache.set(config, new Map([[locale, plan]]));
    }
    return plan;
};
