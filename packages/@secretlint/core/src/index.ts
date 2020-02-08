import {
    SecretLintSource,
    SecretLintRuleCreator,
    SecretLintContext,
    SecretLintReportDescriptor,
    SecretLintResult
} from "@secretlint/types";

import { EventEmitter } from "events";

import { default as PQueue } from "p-queue";

export interface SecretLintCoreOptions {
    rules: {
        id: string;
        rule: SecretLintRuleCreator;
        options: {};
    }[];
}

type Handler<T> = (descriptor: T) => void;
type ContextEvents = {
    report(descriptor: SecretLintReportDescriptor): void;
    onReport(handler: Handler<SecretLintReportDescriptor>): () => void;
};
export const createContextEvents = (): ContextEvents => {
    const contextEvents = new EventEmitter();
    const REPORT_KEY = "report";
    return {
        report(descriptor: SecretLintReportDescriptor) {
            contextEvents.emit(REPORT_KEY, descriptor);
        },
        onReport(handler: Handler<SecretLintReportDescriptor>) {
            const listener = (descriptor: SecretLintReportDescriptor) => {
                handler(descriptor);
            };
            contextEvents.on(REPORT_KEY, listener);
            return () => {
                contextEvents.off(REPORT_KEY, listener);
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
    contextEvents,
    sharedOptions
}: {
    contextEvents: ContextEvents;
    sharedOptions: {};
}): SecretLintContext => {
    return {
        sharedOptions,
        report(descriptor: SecretLintReportDescriptor): void {
            contextEvents.report(descriptor);
        }
    };
};
/**
 * Rule Processing
 * @param source
 * @param options
 * @param ruleCreator
 * @param ruleCreatorOptions
 * @param contextEvents
 */
export const processRule = ({
    source,
    options,
    ruleCreator,
    ruleCreatorOptions,
    contextEvents
}: {
    source: SecretLintSource;
    options: SecretLintCoreOptions;
    ruleCreator: SecretLintRuleCreator;
    ruleCreatorOptions: {};
    contextEvents: ContextEvents;
}): Promise<void> => {
    const context = createRuleContext({
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
