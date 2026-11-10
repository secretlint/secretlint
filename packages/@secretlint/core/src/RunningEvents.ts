import {
    SecretLintCoreConfigRule,
    SecretLintCoreConfigRulePreset,
    SecretLintRuleContext,
    SecretLintRulePresetContext,
    SecretLintSourceCode,
} from "@secretlint/types";
import { PromiseEventEmitter } from "./helper/promise-event-emitter.js";
import { SecretLintRule } from "./SecretLintRuleImpl.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { AllowMessage } from "./messages/filter-message-id.js";
import { getKeywordMatcher, normalizeKeyword } from "./helper/keyword-matcher.js";

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
export const createRunningEvents = (): RunningEvents => {
    const contextEvents = new PromiseEventEmitter();
    const registerSet = new Set<string>();
    const LINT_HANDLE = Symbol("lint:start");
    const rules: SecretLintRule[] = [];
    /**
     * Normalized keywords of each rule. A rule without keywords is not in this map.
     */
    const ruleKeywords = new Map<SecretLintRule, string[]>();
    /**
     * Return a function that tells whether the rule should run for the source code.
     * The content is scanned once for the keywords of all rules, and only when a rule with keywords supports the source.
     */
    const createKeywordFilter = (sourceCode: SecretLintSourceCode): ((rule: SecretLintRule) => boolean) => {
        let foundKeywords: Set<string> | undefined;
        const getFoundKeywords = (): Set<string> => {
            if (foundKeywords) {
                return foundKeywords;
            }
            const allKeywords = new Set<string>();
            for (const [rule, keywords] of ruleKeywords) {
                if (rule.supportSourceCode(sourceCode)) {
                    keywords.forEach((keyword) => allKeywords.add(keyword));
                }
            }
            const matcher = getKeywordMatcher([...allKeywords].sort());
            const flags = matcher.match(sourceCode.content);
            foundKeywords = new Set(matcher.keywords.filter((_, index) => flags[index] === 1));
            return foundKeywords;
        };
        return (rule) => {
            const keywords = ruleKeywords.get(rule);
            if (!keywords) {
                return true;
            }
            const found = getFoundKeywords();
            return keywords.some((keyword) => found.has(keyword));
        };
    };
    let keywordFilter: ((rule: SecretLintRule) => boolean) | undefined;
    return {
        collectAllowMessageIds(): AllowMessage[] {
            const allowMessageIds: AllowMessage[] = [];
            rules.forEach((rule) => {
                allowMessageIds.push(...rule.allowMessageIds());
            });
            return allowMessageIds;
        },
        /**
         * Start to run linting
         * @param options
         */
        runLint(options: { sourceCode: SecretLintSourceCode }): Promise<Array<void>> {
            keywordFilter = createKeywordFilter(options.sourceCode);
            return contextEvents.emit(LINT_HANDLE, options);
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
            const rule = new SecretLintRule({
                descriptorRule: descriptorRule,
                context,
            });
            rules.push(rule);
            const keywords = descriptorRule.rule.meta.keywords?.map((keyword) => normalizeKeyword(keyword));
            // Use the pre-filter only when all keywords are valid. Otherwise, the rule always runs.
            if (keywords && keywords.length > 0 && keywords.every((keyword) => keyword !== undefined)) {
                ruleKeywords.set(rule, keywords as string[]);
            }
            contextEvents.on(LINT_HANDLE, async ({ sourceCode }: { sourceCode: SecretLintSourceCode }) => {
                // TODO: add more handler
                // Call O￿￿rder?
                // - file
                secretLintProfiler.mark({
                    type: "@core>rule-handler::start",
                    id: descriptorRule.rule.meta.id,
                });
                // if this rule support the content type
                // and the content contains the rule's keywords
                if (rule.supportSourceCode(sourceCode) && (keywordFilter === undefined || keywordFilter(rule))) {
                    await rule.file(sourceCode);
                }
                secretLintProfiler.mark({
                    type: "@core>rule-handler::end",
                    id: descriptorRule.rule.meta.id,
                });
            });
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
