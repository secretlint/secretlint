// Core Input and Output
import {
    SecretLintRuleIgnoreDescriptor,
    SecretLintRuleReportDescriptor,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions,
} from "./SecretLintRule";
import { SecretLintSourceNodeLocation } from "./SecretLintSource";
import { SecretLintRulePresetCreator, SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset";
import { SecretLintRuleSeverityLevel } from "./SecretLintRuleSeverityLevel";
import { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions";

export type SecretLintCoreDescriptorRule<Options = SecretLintRuleCreatorOptions> = {
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
export type SecretLintCoreDescriptorRulePreset<Options = SecretLintRulePresetCreatorOptions> = {
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
    rules?: SecretLintCoreDescriptorRule[];
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
export type SecretLintCoreDescriptorUnionRule<
    Options = SecretLintRuleCreatorOptions | SecretLintRulePresetCreatorOptions
> = SecretLintCoreDescriptorRule<Options> | SecretLintCoreDescriptorRulePreset<Options>;

export type SecretLintCoreDescriptor = {
    sharedOptions?: SecretlintCoreSharedOptions;
    rules: SecretLintCoreDescriptorUnionRule[];
};

export type SecretLintCoreResult = {
    filePath: string;
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
    range: number[];
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
    range: number[];
    loc: SecretLintSourceNodeLocation;
};

export type SecretLintCoreReportDescriptor = {
    ruleId: string;
} & SecretLintRuleReportDescriptor;

export type SecretLintCoreIgnoreDescriptor = {
    ruleId: string;
} & SecretLintRuleIgnoreDescriptor;
