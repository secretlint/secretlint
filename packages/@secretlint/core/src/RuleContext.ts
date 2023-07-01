import { EventEmitter } from "./helper/promise-event-emitter.js";
import {
    SecretLintCoreIgnoreDescriptor,
    SecretLintCoreIgnoreMessage,
    SecretLintCoreReportDescriptor,
    SecretLintCoreResultMessage,
    SecretlintCoreSharedOptions,
    SecretLintRuleContext,
    SecretLintRuleCreator,
    SecretLintRuleLocaleTag,
    SecretLintRuleLocalizeMessages,
    SecretLintRuleSeverityLevel,
    SecretLintSourceCode,
} from "@secretlint/types";
import { createTranslator } from "./helper/SecretLintRuleMessageTranslator.js";

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
        report(descriptor: SecretLintCoreResultMessage) {
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
        ignore(descriptor: SecretLintCoreIgnoreMessage) {
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
        },
    };
};

export type CreateRuleContextOptions = {
    ruleId: string;
    /**
     * If the rule is in preset, pass rule preset's id as ruleParentId
     */
    ruleParentId?: string;
    meta: SecretLintRuleCreator["meta"];
    severity?: SecretLintRuleSeverityLevel;
    sourceCode: SecretLintSourceCode;
    contextEvents: ContextEvents;
    sharedOptions: SecretlintCoreSharedOptions;
    locale: SecretLintRuleLocaleTag;
};
export const createRuleContext = ({
    ruleId,
    ruleParentId,
    meta,
    severity,
    sourceCode,
    contextEvents,
    sharedOptions,
    locale,
}: CreateRuleContextOptions): SecretLintRuleContext => {
    return {
        sharedOptions: sharedOptions,
        createTranslator: <T extends SecretLintRuleLocalizeMessages>(messages: T) => {
            return createTranslator(messages, {
                defaultLocale: locale,
            });
        },
        ignore(descriptor: SecretLintCoreIgnoreDescriptor): void {
            const { message } = descriptor.message;
            contextEvents.ignore({
                type: "ignore",
                ruleId: ruleId,
                ruleParentId,
                range: descriptor.range,
                targetRuleId: descriptor.targetRuleId,
                loc: sourceCode.rangeToLocation(descriptor.range),
                message: message,
            });
        },
        report(descriptor: SecretLintCoreReportDescriptor): void {
            const { message, messageId, data } = descriptor.message;
            // Default severity level is "error"
            const severityLevel = severity ?? "error";
            if (ruleParentId) {
                contextEvents.report({
                    ...descriptor,
                    type: "message",
                    ruleId: ruleId,
                    ruleParentId,
                    loc: sourceCode.rangeToLocation(descriptor.range),
                    severity: severityLevel,
                    message,
                    messageId,
                    docsUrl: meta.docs?.url ? `${meta.docs.url}#${messageId}` : undefined,
                    data,
                });
            } else {
                contextEvents.report({
                    ...descriptor,
                    type: "message",
                    ruleId: ruleId,
                    loc: sourceCode.rangeToLocation(descriptor.range),
                    severity: severityLevel,
                    message,
                    messageId,
                    docsUrl: meta.docs?.url ? `${meta.docs.url}#${messageId}` : undefined,
                    data,
                });
            }
        },
    };
};
