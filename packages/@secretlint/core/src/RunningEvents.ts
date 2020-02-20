import {
    SecretLintRuleContext,
    SecretLintSourceCode,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintRulePresetContext
} from "@secretlint/types";
import { PromiseEventEmitter } from "./helper/promise-event-emitter";
import { SecretLintRule } from "./SecretLintRuleImpl";

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
    emitFile(source: SecretLintSourceCode): Promise<Array<void>>;
    isRegistered(ruleId: string): boolean;
};
export const createRunningEvents = (): RunningEvents => {
    const contextEvents = new PromiseEventEmitter();
    const registerSet = new Set<string>();
    const FILE_HANDLE = Symbol("file");
    return {
        registerRule({
            descriptorRule,
            context
        }: {
            descriptorRule: SecretLintCoreDescriptorRule;
            context: SecretLintRuleContext;
        }) {
            if (registerSet.has(descriptorRule.id)) {
                // TODO: more trivial implementation
                console.warn(`rule.id:${descriptorRule.id} is already registered.
                
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
            contextEvents.on(FILE_HANDLE, (source: SecretLintSourceCode) => {
                // if this rule support the content type
                if (!rule.supportSourceCode(source)) {
                    return; // skip
                }
                return rule.file(source);
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
        emitFile(source: SecretLintSourceCode) {
            return contextEvents.emit(FILE_HANDLE, source);
        },
        isRegistered(ruleId: string): boolean {
            return registerSet.has(ruleId);
        }
    };
};
