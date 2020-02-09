import {
    SecretLintSource,
    SecretLintCoreResult,
    SecretLintCoreReportDescriptor,
    SecretLintCoreIgnoreDescriptor,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintRuleContext,
    SecretLintRuleReportDescriptor,
    SecretLintRuleIgnoreDescriptor,
    SecretLintCoreDescriptor,
    SecretLintCoreResultMessage,
    SecretLintSourceCode
} from "@secretlint/types";
import { EventEmitter } from "events";
import { default as PQueue } from "p-queue";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl";

type Handler<T> = (descriptor: T) => void;
/**
 * implicitly defined properties by Context
 */
type ContextDescriptor = {
    ruleId: string;
};
type SecretLintCoreOptions = SecretLintCoreDescriptor;
type ContextEvents = {
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
        onIgnore(handler: Handler<SecretLintCoreIgnoreDescriptor>) {
            const listener = (descriptor: SecretLintCoreReportDescriptor & ContextDescriptor) => {
                handler(descriptor);
            };
            contextEvents.on(IGNORE_SYMBOL, listener);
            return () => {
                contextEvents.off(IGNORE_SYMBOL, listener);
            };
        }
    };
};

export const lintSource = (source: SecretLintSource, options: SecretLintCoreOptions): Promise<SecretLintCoreResult> => {
    const rules = options.rules;
    const contextEvents = createContextEvents();
    const messages: SecretLintCoreResultMessage[] = [];
    contextEvents.onReport(message => {
        messages.push(message);
    });
    const promiseQueue = new PQueue();
    rules.forEach(rule => {
        promiseQueue.add(() => {
            // If option is not defiend Options is {} by default
            const normalizedOptions = rule.options || {};
            return processRule({
                source,
                options,
                ruleId: rule.id,
                ruleCreator: rule.rule,
                ruleCreatorOptions: normalizedOptions,
                contextEvents
            });
        });
    });
    return promiseQueue.onIdle().then(() => {
        return {
            filePath: source.filePath,
            messages: messages
        };
    });
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
        ignore(descriptor: SecretLintCoreIgnoreDescriptor): void {
            contextEvents.ignore({
                ruleId: ruleId,
                ...descriptor
            });
        },
        report(descriptor: SecretLintCoreReportDescriptor): void {
            contextEvents.report({
                ruleId: ruleId,
                loc: sourceCode.rangeToLocation(descriptor.range),
                // TODO: error only, it will configuable
                severity: "error",
                ...descriptor
            });
        }
    };
};
/**
 * Rule Processing
 * @param source
 * @param options
 * @param ruleId
 * @param ruleCreator
 * @param ruleCreatorOptions
 * @param contextEvents
 */
export const processRule = ({
    source,
    options,
    ruleId,
    ruleCreator,
    ruleCreatorOptions,
    contextEvents
}: {
    source: SecretLintSource;
    options: SecretLintCoreOptions;
    ruleId: string;
    ruleCreator: SecretLintRuleCreator<SecretLintRuleCreatorOptions>;
    ruleCreatorOptions: SecretLintRuleCreatorOptions;
    contextEvents: ContextEvents;
}): Promise<void> => {
    const sourceCode = new SecretLintSourceCodeImpl({
        content: source.content,
        filePath: source.filePath,
        ext: source.ext || ""
    });
    const context = createRuleContext({
        ruleId: ruleId,
        sourceCode,
        contextEvents: contextEvents,
        sharedOptions: options
    });
    const rule = ruleCreator.create(context, ruleCreatorOptions);
    const promiseQueue = new PQueue();
    const ruleFile = rule.file;
    if (ruleFile) {
        promiseQueue.add(() => {
            return ruleFile(source);
        });
    }
    return promiseQueue.onIdle();
};
