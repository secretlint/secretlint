import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";
import { SecretLintRulePresetCreator, SecretLintRulePresetCreatorOptions } from "./SecretLintRulePreset";

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
     * Rule options
     * Default: {} (empty object)
     */
    options?: Options;
    /**
     * Disable the rule
     * Default: false
     */
    disabled?: boolean;
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
