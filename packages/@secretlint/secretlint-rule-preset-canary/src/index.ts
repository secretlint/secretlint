import { SecretLintRulePresetCreator } from "@secretlint/types";
import ruleAWS from "@secretlint/secretlint-rule-aws";
import ruleGCP from "@secretlint/secretlint-rule-gcp";
import ruleNpm from "@secretlint/secretlint-rule-npm";
import ruleSlack from "@secretlint/secretlint-rule-slack";
import ruleBasicAuth from "@secretlint/secretlint-rule-basicauth";
import rulePrivateKey from "@secretlint/secretlint-rule-privatekey";
import ruleSecp256k1PrivateKey from "@secretlint/secretlint-rule-secp256k1-privatekey";

export const rules = [ruleAWS, ruleGCP, rulePrivateKey, ruleNpm, ruleBasicAuth, ruleSlack, ruleSecp256k1PrivateKey];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-preset-canary",
        recommended: true,
        type: "preset",
    },
    create(context, _options) {
        rules.forEach((rule) => {
            context.registerRule(rule);
        });
    },
};
export default creator;
