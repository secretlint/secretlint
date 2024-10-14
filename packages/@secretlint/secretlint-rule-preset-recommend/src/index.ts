import { SecretLintRulePresetCreator } from "@secretlint/types";
import { creator as ruleAWS } from "@secretlint/secretlint-rule-aws";
import { creator as ruleGCP } from "@secretlint/secretlint-rule-gcp";
import { creator as ruleNpm } from "@secretlint/secretlint-rule-npm";
import { creator as ruleSlack } from "@secretlint/secretlint-rule-slack";
import { creator as ruleBasicAuth } from "@secretlint/secretlint-rule-basicauth";
import { creator as ruleOpenAi } from "@secretlint/secretlint-rule-openai";
import { creator as ruleLinear } from "@secretlint/secretlint-rule-linear";
import { creator as rulePrivateKey } from "@secretlint/secretlint-rule-privatekey";
import { creator as ruleSendgrid } from "@secretlint/secretlint-rule-sendgrid";
import { creator as ruleShopify } from "@secretlint/secretlint-rule-shopify";
import { creator as ruleGitHub } from "@secretlint/secretlint-rule-github";
import { creator as rule1Password } from "@secretlint/secretlint-rule-1password";
import { creator as ruleFilterComments } from "@secretlint/secretlint-rule-filter-comments";

export const rules = [
    ruleAWS,
    ruleGCP,
    rulePrivateKey,
    ruleNpm,
    ruleBasicAuth,
    ruleSlack,
    ruleSendgrid,
    ruleShopify,
    ruleGitHub,
    ruleOpenAi,
    ruleLinear,
    rule1Password,
    ruleFilterComments,
];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-preset-recommend",
        recommended: true,
        type: "preset",
    },
    rules,
    create(context, _options) {
        rules.forEach((rule) => {
            context.registerRule(rule);
        });
    },
};
