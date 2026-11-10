import {
    SecretLintCoreConfigRule,
    SecretLintCoreConfigRulePreset,
    SecretLintRuleContext,
    SecretLintRulePresetContext,
    SecretLintSourceCode,
} from "@secretlint/types";
import { getAllowMessageIds, SecretLintRule } from "./SecretLintRuleImpl.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { AllowMessage } from "./messages/filter-message-id.js";
import { getKeywordMatcher, KeywordMatcher, normalizeKeyword } from "./helper/keyword-matcher.js";

export type RunningEvents = {
    collectAllowMessageIds(): AllowMessage[];
    /**
     * register rule to Core
     * In this function, the rule's option is frozen.
     * @param descriptorRule
     * @param context
     */
    registerRule({
        descriptorRule,
        context,
    }: {
        descriptorRule: SecretLintCoreConfigRule;
        context: SecretLintRuleContext;
    }): void;
    registerRulePreset({
        descriptorRulePreset,
        context,
    }: {
        descriptorRulePreset: SecretLintCoreConfigRulePreset;
        context: SecretLintRulePresetContext;
    }): void;
    isRegistered(ruleId: string): boolean;
    runLint(options: { sourceCode: SecretLintSourceCode }): Promise<Array<void>>;
};
/**
 * A registered rule. The rule is created only when it runs for the source code.
 */
type RuleEntry = {
    descriptorRule: SecretLintCoreConfigRule;
    context: SecretLintRuleContext;
    /**
     * Normalized keywords. undefined if the rule always runs.
     */
    keywords: string[] | undefined;
};

const supportSourceCode = (descriptorRule: SecretLintCoreConfigRule, sourceCode: SecretLintSourceCode): boolean => {
    const contentType = sourceCode.contentType;
    if (contentType === "unknown") {
        return true;
    }
    const supportedContentTypes = descriptorRule.rule.meta.supportedContentTypes;
    return supportedContentTypes.includes("all") || supportedContentTypes.includes(contentType);
};

type KeywordPlan = {
    matcher: KeywordMatcher;
    /**
     * The keywords and the indexes of `matcher.keywords` for each rule creator
     */
    keywordIndexes: Map<SecretLintCoreConfigRule["rule"], { keywords: string[]; indexes: number[] }>;
};
const isSameKeywords = (a: string[], b: string[] | undefined): boolean => {
    return b !== undefined && a.length === b.length && a.every((keyword, index) => keyword === b[index]);
};
const MAX_PLAN_CACHE_SIZE = 32;
const planCache = new Map<string, KeywordPlan>();
/**
 * Return the matcher for the keywords of the rules.
 * `lintSource()` registers the same rules for each file, so the plan is cached by the rule ids.
 */
const getKeywordPlan = (entries: RuleEntry[]): KeywordPlan => {
    // A rule id does not contain "\0".
    let key = "";
    for (const entry of entries) {
        key += entry.descriptorRule.rule.meta.id + "\0";
    }
    const cached = planCache.get(key);
    // Reuse the plan only when each rule creator and its keywords are the same.
    // `meta.keywords` of a rule creator can be changed between `lintSource()` calls.
    if (
        cached &&
        entries.every((entry) => {
            const item = cached.keywordIndexes.get(entry.descriptorRule.rule);
            return item !== undefined && isSameKeywords(item.keywords, entry.keywords);
        })
    ) {
        return cached;
    }
    const allKeywords = new Set<string>();
    for (const entry of entries) {
        entry.keywords?.forEach((keyword) => allKeywords.add(keyword));
    }
    const matcher = getKeywordMatcher([...allKeywords].sort());
    const indexOf = new Map(matcher.keywords.map((keyword, index) => [keyword, index]));
    const keywordIndexes: KeywordPlan["keywordIndexes"] = new Map();
    for (const entry of entries) {
        const keywords = entry.keywords ?? [];
        keywordIndexes.set(entry.descriptorRule.rule, {
            keywords,
            indexes: keywords.map((keyword) => indexOf.get(keyword) as number),
        });
    }
    if (planCache.size >= MAX_PLAN_CACHE_SIZE) {
        planCache.clear();
    }
    const plan = { matcher, keywordIndexes };
    planCache.set(key, plan);
    return plan;
};
/**
 * Return a function that tells whether the rule should run for the source code.
 * The content is scanned once for the keywords of all rules.
 */
const createKeywordFilter = (targets: RuleEntry[], sourceCode: SecretLintSourceCode) => {
    const withKeywords = targets.filter((entry) => entry.keywords !== undefined);
    if (withKeywords.length === 0) {
        return () => true;
    }
    const plan = getKeywordPlan(withKeywords);
    const found = plan.matcher.match(sourceCode.content);
    return (entry: RuleEntry): boolean => {
        if (entry.keywords === undefined) {
            return true;
        }
        const indexes = plan.keywordIndexes.get(entry.descriptorRule.rule)?.indexes ?? [];
        return indexes.some((index) => found[index] === 1);
    };
};

export const createRunningEvents = (): RunningEvents => {
    const registerSet = new Set<string>();
    const entries: RuleEntry[] = [];
    return {
        collectAllowMessageIds(): AllowMessage[] {
            const allowMessageIds: AllowMessage[] = [];
            entries.forEach(({ descriptorRule }) => {
                allowMessageIds.push(...getAllowMessageIds(descriptorRule));
            });
            return allowMessageIds;
        },
        /**
         * Start to run linting.
         * Create and run only the rules that support the source code and whose keywords are found in the content.
         * The rules that do not run are not created, so `create()` of the rule is not called for the source code.
         * @param options
         */
        runLint({ sourceCode }: { sourceCode: SecretLintSourceCode }): Promise<Array<void>> {
            const targets = entries.filter((entry) => supportSourceCode(entry.descriptorRule, sourceCode));
            const isRuleToRun = createKeywordFilter(targets, sourceCode);
            // Create all rules before starting their handlers.
            // If `create()` of a rule throws, no handler has started and runLint throws synchronously.
            const rules: { ruleId: string; rule: SecretLintRule }[] = [];
            for (const entry of targets) {
                if (!isRuleToRun(entry)) {
                    continue;
                }
                rules.push({
                    ruleId: entry.descriptorRule.rule.meta.id,
                    rule: new SecretLintRule({
                        descriptorRule: entry.descriptorRule,
                        context: entry.context,
                    }),
                });
            }
            const promises = rules.map(({ ruleId, rule }) => {
                secretLintProfiler.mark({
                    type: "@core>rule-handler::start",
                    id: ruleId,
                });
                return rule.file(sourceCode).then(() => {
                    secretLintProfiler.mark({
                        type: "@core>rule-handler::end",
                        id: ruleId,
                    });
                });
            });
            return Promise.all(promises);
        },
        registerRule({
            descriptorRule,
            context,
        }: {
            descriptorRule: SecretLintCoreConfigRule;
            context: SecretLintRuleContext;
        }) {
            if (registerSet.has(descriptorRule.id)) {
                // TODO: more trivial implementation
                throw new Error(`rule.id:${descriptorRule.id} is already registered.
                
Duplicated rule.id is something wrong in .secretlintrc.                
`);
            }
            registerSet.add(descriptorRule.id);
            const keywords = descriptorRule.rule.meta.keywords?.map((keyword) => normalizeKeyword(keyword));
            // Use the pre-filter only when all keywords are valid. Otherwise, the rule always runs.
            const validKeywords =
                keywords && keywords.length > 0 && keywords.every((keyword) => keyword !== undefined)
                    ? (keywords as string[])
                    : undefined;
            entries.push({ descriptorRule, context, keywords: validKeywords });
        },
        registerRulePreset({
            descriptorRulePreset,
            context,
        }: {
            descriptorRulePreset: SecretLintCoreConfigRulePreset;
            context: SecretLintRulePresetContext;
        }) {
            // Normalized Rule Preset Options
            const rulePresetCreatorOptions = descriptorRulePreset.options || [];
            // Internally, RulePreset#register call `registerRule`
            descriptorRulePreset.rule.create(context, rulePresetCreatorOptions);
        },
        isRegistered(ruleId: string): boolean {
            return registerSet.has(ruleId);
        },
    };
};
