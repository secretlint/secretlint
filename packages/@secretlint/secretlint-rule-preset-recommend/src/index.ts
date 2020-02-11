import { SecretLintRulePresetCreator } from "@secretlint/types";
import ruleAWS from "@secretlint/secretlint-rule-aws";
import rulePrivateKey from "@secretlint/secretlint-rule-privatekey";

export const rules = [ruleAWS, rulePrivateKey];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-preset-recommend",
        recommended: true,
        type: "preset"
    },
    create(context, _options) {
        rules.forEach(rule => {
            context.registerRule(rule);
        });
    }
};
export default creator;
