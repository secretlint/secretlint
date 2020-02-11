import { EventEmitter } from "events";
import {
    SecretLintCoreDescriptorRule,
    SecretLintCoreIgnoreDescriptor,
    SecretLintCoreReportDescriptor,
    SecretLintCoreResultMessage,
    SecretLintRuleContext,
    SecretLintRuleCreatorOptions,
    SecretLintRuleIgnoreDescriptor,
    SecretLintRulePresetContext,
    SecretLintRulePresetCreatorOptions,
    SecretLintRuleReportDescriptor,
    SecretLintSourceCode
} from "@secretlint/types";
import { createTranslator } from "./Translator";
import { RunningEvents } from "./RunningEvents";
import { SecretLintRuleCreator } from "@secretlint/types";

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
    ruleId,
    presetOptions,
    sourceCode,
    runningEvents,
    contextEvents,
    sharedOptions
}: {
    ruleId: string;
    presetOptions?: SecretLintRulePresetCreatorOptions;
    sourceCode: SecretLintSourceCode;
    contextEvents: ContextEvents;
    runningEvents: RunningEvents;
    sharedOptions: {};
}): SecretLintRulePresetContext => {
    const normalizedPresetOptions = presetOptions || [];
    if (!Array.isArray(normalizedPresetOptions)) {
        console.error("normalizedPresetOptions is invalid format", normalizedPresetOptions);
        throw new Error("preset options should be an array of rules");
    }
    return {
        sharedOptions,
        registerRule<Options extends SecretLintRuleCreatorOptions>(
            rule: SecretLintRuleCreator<Options>,
            defaultValue?: Omit<Omit<SecretLintCoreDescriptorRule<Options>, "id">, "rule">
        ): void {
            const context = createRuleContext({
                ruleId: ruleId,
                sourceCode,
                contextEvents: contextEvents,
                sharedOptions: sharedOptions
            });
            const descriptorRule = normalizedPresetOptions.find(descriptorRule => {
                return descriptorRule.id === rule.meta.id;
            });
            const otherValues = defaultValue ? defaultValue : {};
            runningEvents.registerRule({
                descriptorRule: {
                    // options and disabled ...
                    ...otherValues,
                    // Prefer to use user setting
                    // User can override preset setting
                    ...descriptorRule,
                    id: rule.meta.id,
                    rule
                },
                context
            });
        }
    };
};

export const createRuleContext = ({
    ruleId,
    sourceCode,
    contextEvents,
    sharedOptions
}: {
    ruleId: string;
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
            contextEvents.report({
                ...descriptor,
                ruleId: ruleId,
                loc: sourceCode.rangeToLocation(descriptor.range),
                // TODO: error only, it will configurable
                severity: "error",
                message,
                data
            });
        }
    };
};
