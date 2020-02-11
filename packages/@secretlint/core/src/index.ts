import {
    SecretLintCoreDescriptor,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintCoreDescriptorUnionRule,
    SecretLintCoreResult,
    SecretLintCoreResultMessage,
    SecretLintRawSource,
    SecretLintSourceCode
} from "@secretlint/types";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl";
import { ContextEvents, createContextEvents, createRuleContext, createRulePresetContext } from "./RuleContext";
import { createRunningEvents, RunningEvents } from "./RunningEvents";

type SecretLintCoreOptions = SecretLintCoreDescriptor;

export const lintSource = (
    rawSource: SecretLintRawSource,
    options: SecretLintCoreOptions
): Promise<SecretLintCoreResult> => {
    const rules = options.rules;
    const contextEvents = createContextEvents();
    const runningEvents = createRunningEvents();
    const messages: SecretLintCoreResultMessage[] = [];
    contextEvents.onReport(message => {
        messages.push(message);
    });
    // setup
    // Create a SourceCode for linting
    const sourceCode = new SecretLintSourceCodeImpl({
        content: rawSource.content,
        filePath: rawSource.filePath,
        ext: rawSource.ext || ""
    });
    rules.forEach(rule => {
        return registerRule({
            sourceCode,
            options,
            descriptorRule: rule,
            contextEvents,
            runningEvents
        });
    });
    // start to run
    return runningEvents.emitFile(sourceCode).then(() => {
        return {
            filePath: rawSource.filePath,
            messages: messages
        };
    });
};

const isRulePreset = (
    ruleDescriptor: SecretLintCoreDescriptorUnionRule
): ruleDescriptor is SecretLintCoreDescriptorRulePreset => {
    return ruleDescriptor.rule.meta.type === "preset";
};
const isRule = (ruleDescriptor: SecretLintCoreDescriptorUnionRule): ruleDescriptor is SecretLintCoreDescriptorRule => {
    return ruleDescriptor.rule.meta.type === "scanner";
};

/**
 * Rule Processing
 */
export const registerRule = ({
    sourceCode,
    options,
    descriptorRule,
    contextEvents,
    runningEvents
}: {
    sourceCode: SecretLintSourceCode;
    options: SecretLintCoreOptions;
    descriptorRule: SecretLintCoreDescriptorUnionRule;
    contextEvents: ContextEvents;
    runningEvents: RunningEvents;
}): void => {
    const ruleId = descriptorRule.id;
    // If option is not defined Options is {} by default
    if (isRulePreset(descriptorRule)) {
        const context = createRulePresetContext({
            ruleId: ruleId,
            rules: descriptorRule.rules,
            ruleOptions: descriptorRule.options,
            sourceCode,
            contextEvents: contextEvents,
            runningEvents: runningEvents,
            sharedOptions: options
        });
        runningEvents.registerRulePreset({
            descriptorRulePreset: descriptorRule,
            context
        });
        return;
    } else if (isRule(descriptorRule)) {
        const context = createRuleContext({
            ruleId: ruleId,
            sourceCode,
            contextEvents: contextEvents,
            sharedOptions: options
        });
        runningEvents.registerRule({
            descriptorRule: descriptorRule,
            context
        });
        return;
    }
    throw new Error(`Unknown descriptor type: ${descriptorRule}`);
};
