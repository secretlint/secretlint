// Rule Interfaces
import { SecretLintCoreConfigRule } from "./SecretLintCore";
import { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule";
import { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions";

export type SecretLintRulePresetContext = {
    sharedOptions: SecretlintCoreSharedOptions;
    registerRule<Options extends SecretLintRuleCreatorOptions = SecretLintRuleCreatorOptions>(
        rule: SecretLintRuleCreator<Options>,
        defaultValue?: Omit<SecretLintCoreConfigRule<Options>, "id" | "rule">
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
    rules: SecretLintRuleCreator<unknown>[];
    create(context: SecretLintRulePresetContext, options: Options): void;
};
