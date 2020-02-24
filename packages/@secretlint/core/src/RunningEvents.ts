import {
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintRuleContext,
    SecretLintRulePresetContext,
    SecretLintSourceCode
} from "@secretlint/types";
import { PromiseEventEmitter } from "./helper/promise-event-emitter";
import { SecretLintRule } from "./SecretLintRuleImpl";
import { secretLintProfiler } from "@secretlint/profiler";

export type RunningEvents = {
    registerRule({
        descriptorRule,
        context
    }: {
        descriptorRule: SecretLintCoreDescriptorRule;
        context: SecretLintRuleContext;
    }): void;
    registerRulePreset({
        descriptorRulePreset,
        context
    }: {
        descriptorRulePreset: SecretLintCoreDescriptorRulePreset;
        context: SecretLintRulePresetContext;
    }): void;
    isRegistered(ruleId: string): boolean;
    runLint(options: { sourceCode: SecretLintSourceCode }): Promise<Array<void>>;
};
export const createRunningEvents = (): RunningEvents => {
    const contextEvents = new PromiseEventEmitter();
    const registerSet = new Set<string>();
    const LINT_HANDLE = Symbol("lint:start");
    return {
        /**
         * Start to run linting
         * @param options
         */
        runLint(options: { sourceCode: SecretLintSourceCode }): Promise<Array<void>> {
            return contextEvents.emit(LINT_HANDLE, options);
        },
        registerRule({
            descriptorRule,
            context
        }: {
            descriptorRule: SecretLintCoreDescriptorRule;
            context: SecretLintRuleContext;
        }) {
            if (registerSet.has(descriptorRule.id)) {
                // TODO: more trivial implementation
                throw new Error(`rule.id:${descriptorRule.id} is already registered.
                
Duplicated rule.id is something wrong in .secretlintrc.                
`);
            }
            registerSet.add(descriptorRule.id);
            // Normalized Rule Options
            const ruleCreatorOptions = descriptorRule.options || {};
            const rule = new SecretLintRule({
                ruleCreator: descriptorRule.rule,
                ruleCreatorOptions: ruleCreatorOptions,
                context
            });
            contextEvents.on(LINT_HANDLE, async ({ sourceCode }: { sourceCode: SecretLintSourceCode }) => {
                // TODO: add more handler
                // Call O￿￿rder?
                // - file
                secretLintProfiler.mark({
                    type: "@core>rule-handler::start",
                    id: descriptorRule.rule.meta.id
                });
                // if this rule support the content type
                if (rule.supportSourceCode(sourceCode)) {
                    await rule.file(sourceCode);
                }
                secretLintProfiler.mark({
                    type: "@core>rule-handler::end",
                    id: descriptorRule.rule.meta.id
                });
            });
        },
        registerRulePreset({
            descriptorRulePreset,
            context
        }: {
            descriptorRulePreset: SecretLintCoreDescriptorRulePreset;
            context: SecretLintRulePresetContext;
        }) {
            // Normalized Rule Preset Options
            const rulePresetCreatorOptions = descriptorRulePreset.options || [];
            descriptorRulePreset.rule.create(context, rulePresetCreatorOptions);
        },
        isRegistered(ruleId: string): boolean {
            return registerSet.has(ruleId);
        }
    };
};
