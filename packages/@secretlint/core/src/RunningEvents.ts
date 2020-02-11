import {
    SecretLintRuleContext,
    SecretLintSourceCode,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintRulePresetContext
} from "@secretlint/types";
import { PromiseEventEmitter } from "./promise-event-emitter";

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
            const rule = descriptorRule.rule.create(context, ruleCreatorOptions);
            const file = rule.file;
            if (file) {
                contextEvents.on(FILE_HANDLE, (source: SecretLintSourceCode) => {
                    file(source);
                });
            }
        },
        registerRulePreset({
            descriptorRulePreset,
            context
        }: {
            descriptorRulePreset: SecretLintCoreDescriptorRulePreset;
            context: SecretLintRulePresetContext;
        }) {
            // Normalized Rule Preset Options
            const ruleCreatorOptions = descriptorRulePreset.options || [];
            descriptorRulePreset.rule.create(context, ruleCreatorOptions);
        },
        emitFile(source: SecretLintSourceCode) {
            return contextEvents.emit(FILE_HANDLE, source);
        },
        isRegistered(ruleId: string): boolean {
            return registerSet.has(ruleId);
        }
    };
};
