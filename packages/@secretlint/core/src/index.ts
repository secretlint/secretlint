import {
    SecretLintCoreDescriptor,
    SecretLintCoreResult,
    SecretLintCoreResultMessage,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
    SecretLintSource
} from "@secretlint/types";
import { default as PQueue } from "p-queue";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl";
import { ContextEvents, createContextEvents, createRuleContext } from "./RuleContext";

type SecretLintCoreOptions = SecretLintCoreDescriptor;

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
