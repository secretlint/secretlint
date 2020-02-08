import {
    SecretLintSource,
    SecretLintRuleCreator,
    SecretLintContext,
    SecretLintReportDescriptor,
    SecretLintResult,
    SecretLintIgnoreDescriptor,
    SecretLintRuleCreatorOptions
} from "@secretlint/types";

import { EventEmitter } from "events";

import { default as PQueue } from "p-queue";

export type SecretLintCoreOptions = {
    rules: {
        id: string;
        rule: SecretLintRuleCreator<SecretLintRuleCreatorOptions>;
        options: SecretLintRuleCreatorOptions;
    }[];
};

type Handler<T> = (descriptor: T) => void;
/**
 * implicitly defined properties by Context
 */
type ContextDescriptor = {
    ruleId: string;
};
type ContextEvents = {
    report(descriptor: SecretLintReportDescriptor & ContextDescriptor): void;
    onReport(handler: Handler<SecretLintReportDescriptor & ContextDescriptor>): () => void;
    ignore(descriptor: SecretLintIgnoreDescriptor & ContextDescriptor): void;
    onIgnore(handler: Handler<SecretLintIgnoreDescriptor & ContextDescriptor>): () => void;
};
export const createContextEvents = (): ContextEvents => {
    const contextEvents = new EventEmitter();
    const REPORT_SYMBOL = Symbol("report");
    const IGNORE_SYMBOL = Symbol("ignore");
    return {
        report(descriptor: SecretLintReportDescriptor) {
            contextEvents.emit(REPORT_SYMBOL, descriptor);
        },
        onReport(handler: Handler<SecretLintReportDescriptor & ContextDescriptor>) {
            const listener = (descriptor: SecretLintReportDescriptor & ContextDescriptor) => {
                handler(descriptor);
            };
            contextEvents.on(REPORT_SYMBOL, listener);
            return () => {
                contextEvents.off(REPORT_SYMBOL, listener);
            };
        },
        ignore(descriptor: SecretLintReportDescriptor) {
            contextEvents.emit(IGNORE_SYMBOL, descriptor);
        },
        onIgnore(handler: Handler<SecretLintReportDescriptor & ContextDescriptor>) {
            const listener = (descriptor: SecretLintReportDescriptor & ContextDescriptor) => {
                handler(descriptor);
            };
            contextEvents.on(IGNORE_SYMBOL, listener);
            return () => {
                contextEvents.off(IGNORE_SYMBOL, listener);
            };
        }
    };
};

export const lintSource = (source: SecretLintSource, options: SecretLintCoreOptions): Promise<SecretLintResult> => {
    const rules = options.rules;
    const contextEvents = createContextEvents();
    const descriptors: SecretLintReportDescriptor[] = [];
    contextEvents.onReport(descriptor => {
        descriptors.push(descriptor);
    });
    const promiseQueue = new PQueue();
    rules.forEach(rule => {
        promiseQueue.add(() => {
            return processRule({
                source,
                options,
                ruleId: rule.id,
                ruleCreator: rule.rule,
                ruleCreatorOptions: rule.options,
                contextEvents
            });
        });
    });
    return promiseQueue.onIdle().then(() => {
        return {
            filePath: source.filePath,
            messages: descriptors
        };
    });
};

export const createRuleContext = ({
    ruleId,
    contextEvents,
    sharedOptions
}: {
    ruleId: string;
    contextEvents: ContextEvents;
    sharedOptions: {};
}): SecretLintContext => {
    return {
        sharedOptions,
        ignore(descriptor: SecretLintIgnoreDescriptor): void {
            contextEvents.report({
                ruleId: ruleId,
                ...descriptor
            });
        },
        report(descriptor: SecretLintReportDescriptor): void {
            contextEvents.report({
                ruleId: ruleId,
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
    const context = createRuleContext({
        ruleId: ruleId,
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
