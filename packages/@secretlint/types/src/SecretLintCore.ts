// Core Input and Output
import {
    SecretLintRuleIgnoreDescriptor,
    SecretLintRuleReportDescriptor,
    SecretLintRuleCreator,
    SecretLintRuleCreatorOptions
} from "./SecretLintRule";

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
export type SecretLintCoreDescriptor = {
    rules: SecretLintCoreDescriptorRule[];
};

export type SecretLintCoreResult = {
    filePath: string;
    messages: SecretLintCoreResultMessage[];
};
export type SecretLintCoreResultMessage = {
    message: string;
    range: number[];
    data?: {};
};
export type SecretLintCoreReportDescriptor = {
    ruleId: string;
} & SecretLintRuleReportDescriptor;

export type SecretLintCoreIgnoreDescriptor = {
    ruleId: string;
} & SecretLintRuleIgnoreDescriptor;
