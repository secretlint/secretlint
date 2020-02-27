import { EventEmitter } from "events";
import {
    SecretLintCoreIgnoreDescriptor,
    SecretLintCoreReportDescriptor,
    SecretLintCoreResultMessage,
    SecretLintRuleContext,
    SecretLintRuleIgnoreDescriptor,
    SecretLintRuleReportDescriptor,
    SecretLintRuleSeverityLevel,
    SecretLintCoreIgnoreMessage,
    SecretLintSourceCode
} from "@secretlint/types";
import { createTranslator } from "./helper/Translator";

type Handler<T> = (descriptor: T) => void;
export type ContextEvents = {
    report(descriptor: SecretLintCoreResultMessage): void;
    onReport(handler: Handler<SecretLintCoreResultMessage>): () => void;
    ignore(descriptor: SecretLintCoreIgnoreMessage): void;
    onIgnore(handler: Handler<SecretLintCoreIgnoreMessage>): () => void;
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
        onIgnore(handler: Handler<SecretLintCoreIgnoreMessage>) {
            const listener = (descriptor: SecretLintCoreIgnoreMessage) => {
                handler(descriptor);
            };
            contextEvents.on(IGNORE_SYMBOL, listener);
            return () => {
                contextEvents.off(IGNORE_SYMBOL, listener);
            };
        }
    };
};

export type CreateRuleContextOptions = {
    ruleId: string;
    /**
     * If the rule is in preset, pass rule preset's id as ruleParentId
     */
    ruleParentId?: string;
    severity?: SecretLintRuleSeverityLevel;
    sourceCode: SecretLintSourceCode;
    contextEvents: ContextEvents;
    sharedOptions: {};
};
export const createRuleContext = ({
    ruleId,
    ruleParentId,
    severity,
    sourceCode,
    contextEvents,
    sharedOptions
}: CreateRuleContextOptions): SecretLintRuleContext => {
    return {
        sharedOptions,
        createTranslator: createTranslator,
        ignore(descriptor: SecretLintCoreIgnoreDescriptor): void {
            contextEvents.ignore({
                type: "ignore",
                ruleId: ruleId,
                ruleParentId,
                range: descriptor.range,
                targetRuleId: descriptor.targetRuleId,
                loc: sourceCode.rangeToLocation(descriptor.range),
                message: descriptor.message
            });
        },
        report(descriptor: SecretLintCoreReportDescriptor): void {
            const message = typeof descriptor.message === "string" ? descriptor.message : descriptor.message.message;
            const data = typeof descriptor.message === "string" ? descriptor.data : descriptor.message.data;
            // Default severity level is "error"
            const severityLevel = severity || "error";
            if (ruleParentId) {
                contextEvents.report({
                    ...descriptor,
                    type: "lint",
                    ruleId: ruleId,
                    ruleParentId,
                    loc: sourceCode.rangeToLocation(descriptor.range),
                    severity: severityLevel,
                    message,
                    data
                });
            } else {
                contextEvents.report({
                    ...descriptor,
                    type: "lint",
                    ruleId: ruleId,
                    loc: sourceCode.rangeToLocation(descriptor.range),
                    severity: severityLevel,
                    message,
                    data
                });
            }
        }
    };
};
