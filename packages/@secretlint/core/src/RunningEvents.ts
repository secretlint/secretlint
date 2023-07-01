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
            contextEvents.on(LINT_HANDLE, async ({ sourceCode }: { sourceCode: SecretLintSourceCode }) => {
                // TODO: add more handler
                // Call O￿￿rder?
                // - file
                secretLintProfiler.mark({
                    type: "@core>rule-handler::start",
                    id: descriptorRule.rule.meta.id,
                });
                // if this rule support the content type
                if (rule.supportSourceCode(sourceCode)) {
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
