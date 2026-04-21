import { SecretLintRulePresetCreator } from "@secretlint/types";
import { creator as ruleAWS } from "@secretlint/secretlint-rule-aws";
import { creator as ruleGCP } from "@secretlint/secretlint-rule-gcp";
import { creator as ruleNpm } from "@secretlint/secretlint-rule-npm";
import { creator as ruleSlack } from "@secretlint/secretlint-rule-slack";
import { creator as ruleBasicAuth } from "@secretlint/secretlint-rule-basicauth";
import { creator as ruleOpenAi } from "@secretlint/secretlint-rule-openai";
import { creator as ruleAnthropic } from "@secretlint/secretlint-rule-anthropic";
import { creator as ruleGroq } from "@secretlint/secretlint-rule-groq";
import { creator as ruleHuggingface } from "@secretlint/secretlint-rule-huggingface";
import { creator as ruleLinear } from "@secretlint/secretlint-rule-linear";
import { creator as ruleNotion } from "@secretlint/secretlint-rule-notion";
import { creator as rulePrivateKey } from "@secretlint/secretlint-rule-privatekey";
import { creator as ruleSendgrid } from "@secretlint/secretlint-rule-sendgrid";
import { creator as ruleShopify } from "@secretlint/secretlint-rule-shopify";
import { creator as ruleGitHub } from "@secretlint/secretlint-rule-github";
import { creator as ruleGitLab } from "@secretlint/secretlint-rule-gitlab";
import { creator as ruleGrafana } from "@secretlint/secretlint-rule-grafana";
import { creator as rule1Password } from "@secretlint/secretlint-rule-1password";
import { creator as ruleDatabaseConnectionString } from "@secretlint/secretlint-rule-database-connection-string";
import { creator as ruleHashiCorpVault } from "@secretlint/secretlint-rule-hashicorp-vault";
import { creator as ruleVercel } from "@secretlint/secretlint-rule-vercel";
import { creator as ruleDatabricks } from "@secretlint/secretlint-rule-databricks";
import { creator as ruleDocker } from "@secretlint/secretlint-rule-docker";
import { creator as ruleFigma } from "@secretlint/secretlint-rule-figma";
import { creator as ruleCloudflare } from "@secretlint/secretlint-rule-cloudflare";
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
    ruleGitLab,
    ruleGrafana,
    ruleOpenAi,
    ruleAnthropic,
    ruleGroq,
    ruleHuggingface,
    ruleLinear,
    ruleNotion,
    rule1Password,
    ruleDatabaseConnectionString,
    ruleHashiCorpVault,
    ruleVercel,
    ruleDatabricks,
    ruleDocker,
    ruleFigma,
    ruleCloudflare,
    ruleFilterComments,
];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = {
    meta: {
        id: "@secretlint/secretlint-rule-preset-canary",
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
