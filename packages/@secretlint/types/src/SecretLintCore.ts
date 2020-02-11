// Core Input and Output
import {
    SecretLintRuleIgnoreDescriptor,
    SecretLintRuleReportDescriptor,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions
} from "./SecretLintRule";
import { SecretLintSourceNodeLocation } from "./SecretLintSource";
import { SecretLintRulePresetCreator, SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset";

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
     * Disable the rule
     * Default: false
     */
    disabled?: boolean;
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
    rules: SecretLintCoreDescriptorRule[];
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
export type SecretLintCoreDescriptorUnionRule<Options = SecretLintRuleCreatorOptions> =
    | SecretLintCoreDescriptorRule<Options>
    | SecretLintCoreDescriptorRulePreset<Options>;
export type SecretLintCoreDescriptor = {
    rules: SecretLintCoreDescriptorUnionRule[];
};

export type SecretLintCoreResult = {
    filePath: string;
    messages: SecretLintCoreResultMessage[];
};
export type SecretLintCoreResultMessage = {
    ruleId: string;
    message: string;
    range: number[];
    loc: SecretLintSourceNodeLocation;
    severity: "info" | "warning" | "error";
    data?: {};
};
export type SecretLintCoreReportDescriptor = {
    ruleId: string;
} & SecretLintRuleReportDescriptor;

export type SecretLintCoreIgnoreDescriptor = {
    ruleId: string;
} & SecretLintRuleIgnoreDescriptor;
