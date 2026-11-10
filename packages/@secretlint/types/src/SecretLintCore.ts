// Core Input and Output
import type {
    SecretLintRuleIgnoreDescriptor,
    SecretLintRuleReportDescriptor,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
} from "./SecretLintRule.js";
import type { SecretLintRawSource, SecretLintSourceNodeLocation } from "./SecretLintSource.js";
import type { SecretLintRulePresetCreator, SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset.js";
import type { SecretLintRuleSeverityLevel } from "./SecretLintRuleSeverityLevel.js";
import type { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions.js";

export type SecretLintCoreConfigRule<Options = SecretLintRuleCreatorOptions> = {
    /**
     * Rule id that is package name or shorten package name
     * For example, "secretlint-rule-example" or "example"(shorten)
     */
    id: string;
    /**
     * Rule instance
     */
    rule: SecretLintRuleCreator<Options>;
    /**
     * Rule options
     * Default: {} (empty object)
     */
    options?: Options;
    /**
     * Severity level for the rule.
     * Default: "error"
     */
    severity?: SecretLintRuleSeverityLevel;
    /**
     * Disable the rule
     * Default: false
     */
    disabled?: boolean;
    /**
     * An array of message id for suppress reported message.
     * Message id is defined in each rule, Please see each README
     */
    allowMessageIds?: string[];
};
export type SecretLintCoreConfigRulePreset<Options = SecretLintRulePresetCreatorOptions> = {
    /**
     * Rule id that is package name or shorten package name
     * For example, "secretlint-rule-preset-example" or "example"(shorten)
     */
    id: string;
    /**
     * Rule instance
     */
    rule: SecretLintRulePresetCreator<Options>;
    /**
     * Preset's rule definitions
     */
    rules?: Omit<SecretLintCoreConfigRule, "rule">[];
    /**
     * Rule options
     * Default: {} (empty object)
     */
    options?: Options;
    /**
     * Disable the rule
     * Default: false
     */
    disabled?: boolean;
};
export type SecretLintUnionRuleCreator<Options = SecretLintRuleCreatorOptions | SecretLintRulePresetCreatorOptions> =
    | SecretLintRuleCreator<Options>
    | SecretLintRulePresetCreator<Options>;
export type SecretLintCoreConfigUnionRule<Options = SecretLintRuleCreatorOptions | SecretLintRulePresetCreatorOptions> =
    SecretLintCoreConfigRule<Options> | SecretLintCoreConfigRulePreset<Options>;
// module export named `creator`
export type SecretLintRuleModule = {
    creator: SecretLintUnionRuleCreator;
};
/**
 * Loaded Config Object
 * - Config: Full
 * - ConfigDescriptor: Partial
 */
export type SecretLintCoreConfig = {
    sharedOptions?: SecretlintCoreSharedOptions;
    rules: SecretLintCoreConfigUnionRule[];
};

export type SecretLintCoreResult = {
    filePath: string;
    // binary content always be undefined
    sourceContent: string | undefined;
    sourceContentType: SecretLintRawSource["contentType"];
    messages: SecretLintCoreResultMessage[];
};
export type SecretLintCoreResultMessage = {
    type: "message";
    ruleId: string;
    ruleParentId?: string;
    message: string;
    messageId: string;
    /**
     * It is based url for documentation
     * If it is set, show `${docsUrl}#${messageId}` in output
     */
    docsUrl?: string;
    range: readonly [startIndex: number, endIndex: number];
    loc: SecretLintSourceNodeLocation;
    severity: SecretLintRuleSeverityLevel;
    data?: {};
};
export type SecretLintCoreIgnoreMessage = {
    type: "ignore";
    ruleId: string;
    ruleParentId?: string;
    /**
     * specific rule id or "*"
     */
    targetRuleId: string;
    message: string;
    range: readonly [startIndex: number, endIndex: number];
    loc: SecretLintSourceNodeLocation;
};

export type SecretLintCoreReportDescriptor = {
    ruleId: string;
} & SecretLintRuleReportDescriptor;

export type SecretLintCoreIgnoreDescriptor = {
    ruleId: string;
} & SecretLintRuleIgnoreDescriptor;
