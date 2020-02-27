import {
    SecretLintCoreDescriptor,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorRulePreset,
    SecretLintCoreDescriptorUnionRule,
    SecretLintCoreIgnoreMessage,
    SecretLintCoreResult,
    SecretLintCoreResultMessage,
    SecretLintRawSource,
    SecretLintSourceCode
} from "@secretlint/types";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl";
import { ContextEvents, createContextEvents, createRuleContext } from "./RuleContext";
import { createRunningEvents, RunningEvents } from "./RunningEvents";
import { secretLintProfiler } from "@secretlint/profiler";
import { createRulePresetContext } from "./RulePresetContext";
import { cleanupMessages } from "./messages";

type SecretLintCoreOptions = SecretLintCoreDescriptor;

export const lintSource = (
    rawSource: SecretLintRawSource,
    options: SecretLintCoreOptions
): Promise<SecretLintCoreResult> => {
    secretLintProfiler.mark({
        type: "@core>lint::start",
        id: rawSource.filePath
    });
    const rules = options.rules;
    const contextEvents = createContextEvents();
    const runningEvents = createRunningEvents();
    const reportedMessages: SecretLintCoreResultMessage[] = [];
    const ignoredMessages: SecretLintCoreIgnoreMessage[] = [];
    contextEvents.onReport(message => {
        reportedMessages.push(message);
    });
    contextEvents.onIgnore(message => {
        ignoredMessages.push(message);
    });
    // setup
    // Create a SourceCode for linting
    const sourceCode = new SecretLintSourceCodeImpl({
        content: rawSource.content,
        filePath: rawSource.filePath,
        ext: rawSource.ext || "",
        contentType: rawSource.contentType
    });
    secretLintProfiler.mark({
        type: "@core>setup-rules::start"
    });
    rules.forEach(rule => {
        secretLintProfiler.mark({
            type: "@core>setup-rule::start",
            id: rule.rule.meta.id
        });
        registerRule({
            sourceCode,
            options,
            descriptorRule: rule,
            contextEvents,
            runningEvents
        });
        secretLintProfiler.mark({
            type: "@core>setup-rule::end",
            id: rule.rule.meta.id
        });
    });
    secretLintProfiler.mark({
        type: "@core>setup-rules::end"
    });
    // start to run
    return runningEvents
        .runLint({
            sourceCode
        })
        .then(() => {
            return {
                filePath: rawSource.filePath,
                messages: cleanupMessages({
                    reportedMessages,
                    ignoredMessages
                })
            };
        })
        .finally(() => {
            secretLintProfiler.mark({
                type: "@core>lint::end",
                id: rawSource.filePath
            });
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
            descriptorRulePreset: descriptorRule,
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
            severity: descriptorRule.severity,
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
