import { EventEmitter } from "events";
import {
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintCoreIgnoreDescriptor,
    SecretLintCoreReportDescriptor,
    SecretLintCoreResultMessage,
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleIgnoreDescriptor,
    SecretLintRulePresetContext,
    SecretLintRuleReportDescriptor,
    SecretLintRuleSeverityLevel,
    SecretLintSourceCode
} from "@secretlint/types";
import { createTranslator } from "./Translator";
import { RunningEvents } from "./RunningEvents";

type Handler<T> = (descriptor: T) => void;
export type ContextEvents = {
    report(descriptor: SecretLintCoreResultMessage): void;
    onReport(handler: Handler<SecretLintCoreResultMessage>): () => void;
    ignore(descriptor: SecretLintRuleIgnoreDescriptor): void;
    onIgnore(handler: Handler<SecretLintCoreIgnoreDescriptor>): () => void;
};
export const createContextEvents = (): ContextEvents => {
    const contextEvents = new EventEmitter();
    const REPORT_SYMBOL = Symbol("report");
    const IGNORE_SYMBOL = Symbol("ignore");
    return {
        report(descriptor: SecretLintRuleReportDescriptor) {
            contextEvents.emit(REPORT_SYMBOL, descriptor);
        },
        onReport(handler: Handler<SecretLintCoreResultMessage>) {
            const listener = (descriptor: SecretLintCoreResultMessage) => {
                handler(descriptor);
            };
            contextEvents.on(REPORT_SYMBOL, listener);
            return () => {
                contextEvents.off(REPORT_SYMBOL, listener);
            };
        },
        ignore(descriptor: SecretLintRuleIgnoreDescriptor) {
            contextEvents.emit(IGNORE_SYMBOL, descriptor);
        },
        onIgnore(handler: Handler<SecretLintCoreResultMessage>) {
            const listener = (descriptor: SecretLintCoreResultMessage) => {
                handler(descriptor);
            };
            contextEvents.on(IGNORE_SYMBOL, listener);
            return () => {
                contextEvents.off(IGNORE_SYMBOL, listener);
            };
        }
    };
};
export const createRulePresetContext = ({
    descriptorRulePreset,
    sourceCode,
    runningEvents,
    contextEvents,
    sharedOptions
}: {
    descriptorRulePreset: SecretLintCoreDescriptorRulePreset;
    sourceCode: SecretLintSourceCode;
    contextEvents: ContextEvents;
    runningEvents: RunningEvents;
    sharedOptions: {};
}): SecretLintRulePresetContext => {
    const presetRules = descriptorRulePreset.rules || [];
    if (!Array.isArray(presetRules)) {
        console.error(`${descriptorRulePreset.id}:PresetRules is invalid format`, presetRules);
        throw new Error("preset's rules should be an array of rule definitions");
    }
    return {
        sharedOptions,
        registerRule<Options extends SecretLintRuleCreatorOptions>(
            rule: SecretLintRuleCreator<Options>,
            defaultValue?: Omit<SecretLintCoreDescriptorRule<Options>, "id" | "rule">
        ): void {
            const descriptorRule = presetRules.find(descriptorRule => {
                return descriptorRule.id === rule.meta.id;
            });
            // Use undefined instead of {}
            // Default value will be handled by RunningEvents#registerRule
            const descriptorRuleOptions = descriptorRule ? descriptorRule.options : undefined;
            const descriptorRuleDisabled = descriptorRule ? descriptorRule.disabled : undefined;
            const descriptorRuleSeverity = descriptorRule ? descriptorRule.severity : undefined;
            const context = createRuleContext({
                // TODO: add preset context to rule context
                // Specialize
                // Show this ruleId as error report
                ruleId: rule.meta.id,
                severity: descriptorRuleSeverity,
                sourceCode,
                contextEvents: contextEvents,
                sharedOptions: sharedOptions
            });
            const defaultValueOfPreset = defaultValue ? defaultValue : {};
            runningEvents.registerRule({
                descriptorRule: {
                    // options and disabled ...
                    ...defaultValueOfPreset,
                    // Prefer to use user setting
                    // User can override preset setting
                    ...descriptorRule,
                    id: rule.meta.id,
                    options: descriptorRuleOptions,
                    rule,
                    disabled: descriptorRuleDisabled,
                    severity: descriptorRuleSeverity
                },
                context
            });
        }
    };
};

export const createRuleContext = ({
    ruleId,
    severity,
    sourceCode,
    contextEvents,
    sharedOptions
}: {
    ruleId: string;
    severity?: SecretLintRuleSeverityLevel;
    sourceCode: SecretLintSourceCode;
    contextEvents: ContextEvents;
    sharedOptions: {};
}): SecretLintRuleContext => {
    return {
        sharedOptions,
        createTranslator: createTranslator,
        ignore(descriptor: SecretLintCoreIgnoreDescriptor): void {
            contextEvents.ignore({
                ruleId: ruleId,
                ...descriptor
            });
        },
        report(descriptor: SecretLintCoreReportDescriptor): void {
            const message = typeof descriptor.message === "string" ? descriptor.message : descriptor.message.message;
            const data = typeof descriptor.message === "string" ? descriptor.data : descriptor.message.data;
            // Default severity level is "error"
            const severityLevel = severity || "error";
            contextEvents.report({
                ...descriptor,
                ruleId: ruleId,
                loc: sourceCode.rangeToLocation(descriptor.range),
                severity: severityLevel,
                message,
                data
            });
        }
    };
};
