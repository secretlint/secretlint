import { SecretLintRulePresetCreator } from "@secretlint/types";
import ruleAWS from "@secretlint/secretlint-rule-aws";
import ruleGCP from "@secretlint/secretlint-rule-gcp";
import ruleNpm from "@secretlint/secretlint-rule-npm";
import ruleSlack from "@secretlint/secretlint-rule-slack";
import ruleBasicAuth from "@secretlint/secretlint-rule-basicauth";
import rulePrivateKey from "@secretlint/secretlint-rule-privatekey";
import ruleSendgrid from "@secretlint/secretlint-rule-sendgrid";
import ruleGitHub from "@secretlint/secretlint-rule-github";

export const rules = [ruleAWS, ruleGCP, rulePrivateKey, ruleNpm, ruleBasicAuth, ruleSlack, ruleSendgrid, ruleGitHub];
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
