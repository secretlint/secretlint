import type { SecretLintRuleCreator, SecretLintRulePresetCreator, SecretLintUnionRuleCreator } from "@secretlint/types";
import { creator as ruleAws } from "./rules/aws/index.js";
import { creator as ruleGcp } from "./rules/gcp/index.js";
import { creator as rulePrivatekey } from "./rules/privatekey/index.js";
import { creator as ruleNpm } from "./rules/npm/index.js";
import { creator as ruleBasicauth } from "./rules/basicauth/index.js";
import { creator as ruleSlack } from "./rules/slack/index.js";
import { creator as ruleSendgrid } from "./rules/sendgrid/index.js";
import { creator as ruleShopify } from "./rules/shopify/index.js";
import { creator as ruleStripe } from "./rules/stripe/index.js";
import { creator as ruleGithub } from "./rules/github/index.js";
import { creator as ruleGitlab } from "./rules/gitlab/index.js";
import { creator as ruleGrafana } from "./rules/grafana/index.js";
import { creator as ruleOpenai } from "./rules/openai/index.js";
import { creator as ruleAnthropic } from "./rules/anthropic/index.js";
import { creator as ruleGroq } from "./rules/groq/index.js";
import { creator as ruleHuggingface } from "./rules/huggingface/index.js";
import { creator as ruleLinear } from "./rules/linear/index.js";
import { creator as ruleNotion } from "./rules/notion/index.js";
import { creator as rule1password } from "./rules/1password/index.js";
import { creator as ruleDatabaseConnectionString } from "./rules/database-connection-string/index.js";
import { creator as ruleHashicorpVault } from "./rules/hashicorp-vault/index.js";
import { creator as ruleVercel } from "./rules/vercel/index.js";
import { creator as ruleDatabricks } from "./rules/databricks/index.js";
import { creator as ruleDocker } from "./rules/docker/index.js";
import { creator as ruleFigma } from "./rules/figma/index.js";
import { creator as ruleCloudflare } from "./rules/cloudflare/index.js";
import { creator as ruleTailscale } from "./rules/tailscale/index.js";
import { creator as ruleTelegram } from "./rules/telegram/index.js";
import { creator as ruleFilterComments } from "./rules/filter-comments/index.js";
import { creator as ruleAzure } from "./rules/azure/index.js";
import { creator as rulePattern } from "./rules/pattern/index.js";

/**
 * Built-in rules of secretlint.
 *
 * The rules are part of `@secretlint/core`, and the config loader resolves their ids
 * (for example `@secretlint/secretlint-rule-aws`) from this table without installing a package.
 * The ids are the same as the ids of the former rule packages, so configs do not change.
 */
export const builtinRules: readonly SecretLintRuleCreator<unknown>[] = [
    ruleAws,
    ruleGcp,
    rulePrivatekey,
    ruleNpm,
    ruleBasicauth,
    ruleSlack,
    ruleSendgrid,
    ruleShopify,
    ruleStripe,
    ruleGithub,
    ruleGitlab,
    ruleGrafana,
    ruleOpenai,
    ruleAnthropic,
    ruleGroq,
    ruleHuggingface,
    ruleLinear,
    ruleNotion,
    rule1password,
    ruleDatabaseConnectionString,
    ruleHashicorpVault,
    ruleVercel,
    ruleDatabricks,
    ruleDocker,
    ruleFigma,
    ruleCloudflare,
    ruleTailscale,
    ruleTelegram,
    ruleFilterComments,
    ruleAzure,
    rulePattern,
];

/**
 * Rules of `@secretlint/secretlint-rule-preset-recommend`, in the order the preset registers them.
 */
export const recommendedRules: readonly SecretLintRuleCreator<unknown>[] = [
    ruleAws,
    ruleGcp,
    rulePrivatekey,
    ruleNpm,
    ruleBasicauth,
    ruleSlack,
    ruleSendgrid,
    ruleShopify,
    ruleStripe,
    ruleGithub,
    ruleGitlab,
    ruleGrafana,
    ruleOpenai,
    ruleAnthropic,
    ruleGroq,
    ruleHuggingface,
    ruleLinear,
    ruleNotion,
    rule1password,
    ruleDatabaseConnectionString,
    ruleHashicorpVault,
    ruleVercel,
    ruleDatabricks,
    ruleDocker,
    ruleFigma,
    ruleCloudflare,
    ruleTailscale,
    ruleFilterComments,
];

/**
 * Rules of `@secretlint/secretlint-rule-preset-canary`.
 * A new rule is added here first, and is added to `recommendedRules` at a major release.
 */
export const canaryRules: readonly SecretLintRuleCreator<unknown>[] = [
    ...recommendedRules.slice(0, -1),
    ruleTelegram,
    ruleFilterComments,
];

const createPreset = (id: string, rules: readonly SecretLintRuleCreator<unknown>[]): SecretLintRulePresetCreator => {
    return {
        meta: {
            id,
            recommended: true,
            type: "preset",
        },
        rules: [...rules],
        create(context) {
            rules.forEach((rule) => {
                context.registerRule(rule);
            });
        },
    };
};

/**
 * `@secretlint/secretlint-rule-preset-recommend`
 */
export const presetRecommend: SecretLintRulePresetCreator = createPreset(
    "@secretlint/secretlint-rule-preset-recommend",
    recommendedRules,
);
/**
 * `@secretlint/secretlint-rule-preset-canary`
 */
export const presetCanary: SecretLintRulePresetCreator = createPreset(
    "@secretlint/secretlint-rule-preset-canary",
    canaryRules,
);

const builtinTable: ReadonlyMap<string, SecretLintUnionRuleCreator> = new Map<string, SecretLintUnionRuleCreator>(
    [...builtinRules, presetRecommend, presetCanary].map((creator) => [creator.meta.id, creator]),
);

/**
 * Return the built-in rule or preset for the id, or `undefined` if the id is not built-in.
 * The id must be the full id, for example `@secretlint/secretlint-rule-aws`.
 */
export const getBuiltinRule = (id: string): SecretLintUnionRuleCreator | undefined => {
    return builtinTable.get(id);
};

/**
 * The ids of all built-in rules and presets.
 */
export const builtinRuleIds: readonly string[] = [...builtinTable.keys()];
