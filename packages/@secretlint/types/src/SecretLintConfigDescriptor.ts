import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";
import { SecretLintRulePresetCreator, SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset";
import { SecretLintRuleSeverityLevel } from "./SecretLintRuleSeverityLevel";

export type SecretLintConfigDescriptorRule<Options = SecretLintRuleCreatorOptions> = {
    /**
     * **Required**
     * Rule id that is package name or shorten package name
     * Examples
     * - "@scope/secretlint-rule-example" or "@scope/example"(shorten)
     * - "secretlint-rule-example" or "example"(shorten)
     */
    id: string;
    /**
     * Rule options.
     * This value is defined by each rules.
     * Default: {} (empty object)
     */
    options?: Options;
    /**
     * If true, Disable the rule.
     * Default: false
     */
    disabled?: boolean;
    /**
     * An array of message id for suppress error report.
     * message id is defined in each rule.
     */
    allowMessages?: string[];
    /**
     * Severity level for the rule.
     * Default: "error"
     */
    severity?: SecretLintRuleSeverityLevel;
    // DEBUG USAGE
    /**
     * FOR DEBUG
     * Rule instance
     */
    rule?: SecretLintRuleCreator<Options>;
};
export type SecretLintConfigDescriptorRulePreset<Options = SecretLintRulePresetCreatorOptions> = {
    /**
     * **Required**
     * Rule Preset id that is package name or shorten package name
     * Examples
     * - "@scope/secretlint-rule-preset-example" or "@scope/preset-example"(shorten)
     * - "secretlint-rule-preset-example" or "preset-example"(shorten)
     **/
    id: string;
    /**
     * Rule options
     * See each rule documentation
     * Default: {} (empty object)
     */
    options?: Options;
    /**
     * Disable the rule
     * Default: false
     */
    disabled?: boolean;
    /**
     * Preset's rule definitions
     * rules is an array of rule definition
     * Example
     * {
     *     "id": "preset"
     *     "rules": [{ "id": "example", "options": {}]}
     * }
     */
    rules?: SecretLintConfigDescriptorRule[];
    // DEBUG USAGE
    /**
     * FOR DEBUG
     * Rule instance
     */
    rule?: SecretLintRulePresetCreator<Options>;
};

/**
 * An abstraction for config file
 */
export type SecretLintConfigDescriptor = {
    rules: (SecretLintConfigDescriptorRule | SecretLintConfigDescriptorRulePreset)[];
};
