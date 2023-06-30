import type { SecretLintRuleCreatorOptions } from "./SecretLintRule.js";
import type { SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset.js";
import type { SecretLintRuleSeverityLevel } from "./SecretLintRuleSeverityLevel.js";
import type { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions.js";

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
    allowMessageIds?: string[];
    /**
     * Severity level for the rule.
     * Default: "error"
     */
    severity?: SecretLintRuleSeverityLevel;
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
};

/**
 * An abstraction for config file
 */
export type SecretLintConfigDescriptor = {
    sharedOptions?: SecretlintCoreSharedOptions;
    rules: (SecretLintConfigDescriptorRule | SecretLintConfigDescriptorRulePreset)[];
};
