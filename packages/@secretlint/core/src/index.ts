import type {
    SecretLintCoreConfig,
    SecretLintCoreConfigRule,
    SecretLintCoreConfigRulePreset,
    SecretLintCoreConfigUnionRule,
    SecretLintCoreIgnoreMessage,
    SecretLintCoreResult,
    SecretLintCoreResultMessage,
    SecretLintRawSource,
    SecretLintRuleLocaleTag,
    SecretLintSourceCode,
} from "@secretlint/types";
import { SecretLintSourceCodeImpl } from "./SecretLintSourceCodeImpl.js";
import { ContextEvents, createContextEvents, createRuleContext } from "./RuleContext.js";
import { createRunningEvents, RunningEvents } from "./RunningEvents.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { createRulePresetContext } from "./RulePresetContext.js";
import { cleanupMessages } from "./messages/index.js";
import debug0 from "debug";

const debug = debug0("@secretlint/core");
export type SecretLintSourceOptions = {
    /**
     * Lint target source
     */
    source: SecretLintRawSource;
    options: {
        /**
         * local for translate
         * Default: "en"
         */
        locale?: SecretLintRuleLocaleTag;
        /**
         * If this is true, mask all message's data values
         * Replace data value with "****" strings
         * Default: false
         */
        maskSecrets?: boolean;
        /**
         * config present secretlintrc object
         */
        config: SecretLintCoreConfig;
        /**
         * If pass the `source` come from non-physical file such as stdin, you can set `noPhysicFilePath` to true.
         * This option affect to `context.getSourceFilePath()`.
         * If pass `noPhysicFilePath: true`, `context.getSourceFilePath()` return `undefined`.
         */
        noPhysicFilePath?: boolean;
    };
};
export const lintSource = ({ source, options }: SecretLintSourceOptions): Promise<SecretLintCoreResult> => {
    secretLintProfiler.mark({
        type: "@core>lint::start",
        id: source.filePath,
    });
    debug(`source filePath: %O`, source.filePath);
    debug(`options: %O`, options);
    const rules = options.config.rules;
    const locale = options.locale ?? "en";
    const maskSecrets = options.maskSecrets ?? false;
    const contextEvents = createContextEvents();
    const runningEvents = createRunningEvents();
    const reportedMessages: SecretLintCoreResultMessage[] = [];
    const ignoredMessages: SecretLintCoreIgnoreMessage[] = [];
    // setup
    contextEvents.onReport((message) => {
        reportedMessages.push(message);
    });
    contextEvents.onIgnore((message) => {
        ignoredMessages.push(message);
    });
    // Create a SourceCode for linting
    const sourceCode = new SecretLintSourceCodeImpl({
        content: source.content,
        filePath: source.filePath,
        physicalFilePath: options.noPhysicFilePath ? undefined : source.filePath,
        ext: source.ext || "",
        contentType: source.contentType,
    });
    secretLintProfiler.mark({
        type: "@core>setup-rules::start",
    });
    rules.forEach((rule) => {
        secretLintProfiler.mark({
            type: "@core>setup-rule::start",
            id: rule.rule.meta.id,
        });
        registerRule({
            sourceCode,
            config: options.config,
            descriptorRule: rule,
            contextEvents,
            runningEvents,
            locale,
        });
        secretLintProfiler.mark({
            type: "@core>setup-rule::end",
            id: rule.rule.meta.id,
        });
    });
    secretLintProfiler.mark({
        type: "@core>setup-rules::end",
    });
    // start to run
    return runningEvents
        .runLint({
            sourceCode,
        })
        .then(() => {
            return {
                filePath: source.filePath,
                // binary content should be skipped
                sourceContent: source.contentType === "text" ? source.content : undefined,
                sourceContentType: source.contentType,
                messages: cleanupMessages({
                    reportedMessages,
                    ignoredMessages,
                    allowMessageIds: runningEvents.collectAllowMessageIds(),
                    maskSecrets,
                }),
            };
        })
        .finally(() => {
            secretLintProfiler.mark({
                type: "@core>lint::end",
                id: source.filePath,
            });
        });
};

const isRulePreset = (
    ruleDescriptor: SecretLintCoreConfigUnionRule
): ruleDescriptor is SecretLintCoreConfigRulePreset => {
    return ruleDescriptor.rule.meta.type === "preset";
};
const isRule = (ruleDescriptor: SecretLintCoreConfigUnionRule): ruleDescriptor is SecretLintCoreConfigRule => {
    return ruleDescriptor.rule.meta.type === "scanner";
};

/**
 * Rule Processing
 */
const registerRule = ({
    sourceCode,
    config,
    descriptorRule,
    contextEvents,
    runningEvents,
    locale,
}: {
    sourceCode: SecretLintSourceCode;
    config: SecretLintCoreConfig;
    descriptorRule: SecretLintCoreConfigUnionRule;
    contextEvents: ContextEvents;
    runningEvents: RunningEvents;
    locale: SecretLintRuleLocaleTag;
}): void => {
    const ruleId = descriptorRule.id;
    // Do not register disabled rule
    if (descriptorRule.disabled) {
        debug("Skip registerRule %s, because it is disabled", ruleId);
        return;
    }
    debug("registerRule %s", ruleId);
    // sharedOptions is {} by default
    // sharedOptions is shared between presets and rules
    const sharedOptionsWithDefault = config.sharedOptions ?? {};
    // If option is not defined Options is {} by default
    if (isRulePreset(descriptorRule)) {
        const context = createRulePresetContext({
            configRulePreset: descriptorRule,
            sourceCode,
            contextEvents: contextEvents,
            runningEvents: runningEvents,
            sharedOptions: sharedOptionsWithDefault,
            locale: locale,
        });
        runningEvents.registerRulePreset({
            descriptorRulePreset: descriptorRule,
            context,
        });
        return;
    } else if (isRule(descriptorRule)) {
        const context = createRuleContext({
            ruleId: ruleId,
            severity: descriptorRule.severity,
            meta: descriptorRule.rule.meta,
            sourceCode,
            contextEvents: contextEvents,
            sharedOptions: sharedOptionsWithDefault,
            locale: locale,
        });
        runningEvents.registerRule({
            descriptorRule: descriptorRule,
            context,
        });
        return;
    }
    throw new Error(`Unknown descriptor type: ${descriptorRule}`);
};
