// Rule Interfaces
import { SecretLintCoreDescriptorRule } from "./SecretLintCore";
import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";

export type SecretLintRulePresetContext = {
    sharedOptions?: {};
    registerRule<Options = SecretLintRuleCreatorOptions>(
        rule: SecretLintRuleCreator<Options>,
        defaultValue?: Omit<Omit<SecretLintCoreDescriptorRule<Options>, "id">, "rule">
    ): void;
};
export type SecretLintRulePresetCreatorOptions = SecretLintCoreDescriptorRule<any>[];
export type SecretLintRulePresetCreator<Options = SecretLintRulePresetCreatorOptions> = {
    meta: {
        id: string;
        type: "preset";
        recommended: boolean;
        docs?: {
            url: string;
        };
    };

    create(context: SecretLintRulePresetContext, options: Options): void;
};
