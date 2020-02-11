import { SecretLintCoreDescriptorRule, SecretLintRulePresetCreator } from "@secretlint/types";
import ruleAWS from "@secretlint/secretlint-rule-aws";
import rulePrivateKey from "@secretlint/secretlint-rule-privatekey";

export type Options = (
    | SecretLintCoreDescriptorRule<import("@secretlint/secretlint-rule-aws").Options>
    | SecretLintCoreDescriptorRule<import("@secretlint/secretlint-rule-privatekey").Options>
)[];

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        recommended: true,
        type: "preset"
    },
    create(context, options) {
        context.registerRule({
            ...options.aws,
            rule: ruleAWS
        });
        context.registerRule({
            ...options.privatekey,
            rule: rulePrivateKey
        });
    }
};
export default creator;
