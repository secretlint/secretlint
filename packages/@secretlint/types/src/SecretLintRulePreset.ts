// Rule Interfaces
import { SecretLintCoreDescriptorRule } from "./SecretLintCore";
import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";
import { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions";

export type SecretLintRulePresetContext = {
    sharedOptions: SecretlintCoreSharedOptions;
    registerRule<Options = SecretLintRuleCreatorOptions>(
        rule: SecretLintRuleCreator<Options>,
        defaultValue?: Omit<SecretLintCoreDescriptorRule<Options>, "id" | "rule">
    ): void;
};
export type SecretLintRulePresetCreatorOptions = {};
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
