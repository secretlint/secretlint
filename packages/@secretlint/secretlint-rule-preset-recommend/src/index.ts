import { SecretLintCoreDescriptorRule, SecretLintRulePresetCreator } from "@secretlint/types";
import ruleAWS from "@secretlint/secretlint-rule-aws";
import rulePrivateKey from "@secretlint/secretlint-rule-privatekey";

export type Options = (
    | SecretLintCoreDescriptorRule<import("@secretlint/secretlint-rule-aws").Options>
    | SecretLintCoreDescriptorRule<import("@secretlint/secretlint-rule-privatekey").Options>
)[];

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-preset-recommend",
        recommended: true,
        type: "preset"
    },
    create(context, _options) {
        context.registerRule(ruleAWS);
        context.registerRule(rulePrivateKey);
    }
};
export default creator;
