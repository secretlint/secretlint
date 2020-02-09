import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";

export type SecretLintConfigDescriptorRule<Options = SecretLintRuleCreatorOptions> = {
    /**
     * **Required**
     * Rule id that is package name or shorten package name
     * For example, "secretlint-rule-example" or "example"(shorten)
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
/**
 * An abstraction for config file
 */
export type SecretLintConfigDescriptor = {
    rules: SecretLintConfigDescriptorRule[];
};
