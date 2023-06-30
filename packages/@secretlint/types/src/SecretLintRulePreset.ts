// Rule Interfaces
import type { SecretLintCoreConfigRule } from "./SecretLintCore.js";
import type { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule.js";
import type { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions.js";

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
