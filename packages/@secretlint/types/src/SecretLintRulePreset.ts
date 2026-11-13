// Rule Interfaces
import type { SecretLintCoreConfigRule } from "./SecretLintCore.js";
import type { SecretLintRuleCreator, SecretLintRuleCreatorOptions } from "./SecretLintRule.js";
import type { SecretlintCoreSharedOptions } from "./SecretlintCoreSharedOptions.js";

export type SecretLintRulePresetContext = {
    sharedOptions: SecretlintCoreSharedOptions;
    registerRule<Options extends SecretLintRuleCreatorOptions = SecretLintRuleCreatorOptions>(
        rule: SecretLintRuleCreator<Options>,
        defaultValue?: Omit<SecretLintCoreConfigRule<Options>, "id" | "rule">,
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
    /**
     * The rules of the preset.
     * Each rule has its own type of options, so the type of the options is `any` here.
     */
    rules: SecretLintRuleCreator<any>[];
    create(context: SecretLintRulePresetContext, options: Options): void;
};
