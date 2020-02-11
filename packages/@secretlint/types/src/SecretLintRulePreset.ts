// Rule Interfaces
import { SecretLintCoreDescriptorRule } from "./SecretLintCore";

export type SecretLintRulePresetContext = {
    sharedOptions?: {};
    registerRule(descriptorRule: SecretLintCoreDescriptorRule): void;
};
export type SecretLintRulePresetCreatorOptions = {};
export type SecretLintRulePresetCreator<Options = SecretLintRulePresetCreatorOptions> = {
    meta: {
        type: "preset";
        recommended: boolean;
        docs?: {
            url: string;
        };
    };

    create(context: SecretLintRulePresetContext, options: Options): void;
};
