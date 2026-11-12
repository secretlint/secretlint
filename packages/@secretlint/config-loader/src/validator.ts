import type {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreConfigRule,
    SecretLintCoreConfigRulePreset,
} from "@secretlint/types";
import { AggregationError } from "./AggregationError.js";
import { SecretLintConfigDescriptorRule, SecretLintConfigDescriptorRulePreset } from "@secretlint/types";
import {
    validateSecretLintConfigDescriptor,
    validateSecretLintConfigDescriptorRule,
    validateSecretLintConfigDescriptorRulePreset,
} from "./descriptor-validator.js";

function invariant(condition: any, message: string): asserts condition {
    if (condition) {
        return;
    }
    throw new Error(message);
}

const isPreset = (
    value: SecretLintConfigDescriptorRule | SecretLintConfigDescriptorRulePreset,
): value is SecretLintCoreConfigRulePreset => {
    return "rules" in value; // TODO: it is loose detection
};
/**
 * value should be SecretLintCoreConfig
 * @param configDescriptor
 */
export const validateConfigDescriptor = (
    configDescriptor: SecretLintConfigDescriptor,
): { ok: true } | { ok: false; error: Error | AggregationError } => {
    const errors: Error[] = [];
    if (!Array.isArray(configDescriptor.rules)) {
        return {
            ok: false,
            error: new Error(`secretlintrc should have required 'rules' property.
            
{
    "rules": [
        {
            "id": "secretlint-rule-example"
        }
    ]
}
`),
        };
    }
    // Validate Descriptor
    try {
        validateSecretLintConfigDescriptor(configDescriptor, "secretlintrc");
    } catch (error) {
        errors.push(new Error(error instanceof Error ? error.message : String(error)));
    }
    for (const ruleOrPreset of configDescriptor.rules) {
        // validate as preset
        // TODO: This condition can not detect preset if `{ id: "preset" }` only pattern
        if (isPreset(ruleOrPreset)) {
            const rulePreset = ruleOrPreset as SecretLintCoreConfigRulePreset;
            try {
                validateSecretLintConfigDescriptorRulePreset(rulePreset, String(ruleOrPreset.id));
            } catch (error) {
                errors.push(new Error(error instanceof Error ? error.message : String(error)));
            }
            if ("allowMessageIds" in ruleOrPreset) {
                errors.push(new Error(`Can not set "allowMessageIds" option to preset(${rulePreset.id}) `));
            }
            if ("severity" in ruleOrPreset) {
                errors.push(new Error(`Can not set "severity" option to preset(${rulePreset.id})`));
            }
        } else {
            const rule = ruleOrPreset as SecretLintCoreConfigRule;
            try {
                validateSecretLintConfigDescriptorRule(rule, String(ruleOrPreset.id));
            } catch (error) {
                errors.push(new Error(error instanceof Error ? error.message : String(error)));
            }
        }
    }
    return {
        ok: errors.length === 0,
        error: new AggregationError(errors, "Secretlint Configuration Error"),
    };
};

export type validateConfigOption = {
    config: SecretLintCoreConfig;
    // configDescriptor: SecretLintConfigDescriptor
};
/**
 * validate config after loading config.
 * It is additional check
 * please pass validateRawConfig before it.
 * @param value
 */
export const validateConfigWithDescriptor = ({
    config,
}: // configDescriptor
validateConfigOption): { ok: true } | { ok: false; error: Error } => {
    const errors: Error[] = [];
    // Descriptor check using loaded config
    // Rule Check
    for (const ruleOrPreset of config.rules) {
        if (isPreset(ruleOrPreset)) {
            // Validate preset
            const preset = ruleOrPreset as SecretLintCoreConfigRulePreset;
            const ruleConfigs = preset?.rules ?? [];
            invariant(Array.isArray(preset.rule.rules), "preset should have `rules` property");
            invariant(typeof preset.rule.meta === "object", "preset should have `meta` property");
            invariant(typeof preset.rule.create === "function", "preset should have `create` function");
            // ## Detect unknown id - the preset does not have the id
            const actualRuleIdsForPreset = preset.rule.rules.map((rule) => rule.meta.id);
            ruleConfigs?.forEach((ruleCreatorOption) => {
                const existRule = actualRuleIdsForPreset.includes(ruleCreatorOption.id);
                if (!existRule) {
                    errors.push(
                        new Error(`Does not exist id: "${ruleCreatorOption.id}" in the preset(${preset.id}).

Following config is invalid because the preset(${preset.id}) does not have id: "${ruleCreatorOption.id}".

${JSON.stringify(ruleCreatorOption)}
`),
                    );
                }
            });
        } else {
            // Validate rule
            const rule = ruleOrPreset as SecretLintCoreConfigRule;
            invariant(typeof rule.rule.meta === "object", "rule should have `meta` property");
            invariant(
                typeof rule.rule.create === "function" || Array.isArray(rule.rule.patterns),
                "rule should have `create` function or `patterns`",
            );
            // `allowMessageIds` validation
            if (Array.isArray(rule.allowMessageIds)) {
                const messageIds: string[] = Object.keys(rule.rule.messages);
                rule.allowMessageIds.forEach((allowMessageId) => {
                    if (!messageIds.includes(allowMessageId)) {
                        errors.push(
                            new Error(`Doe not found allowMessageIds: ${allowMessageId} in the rule(${rule.id})

Following config is invalid because the rule(${rule.id}) does not have messageId: "${allowMessageId}".

${JSON.stringify({ allowMessageIds: rule.allowMessageIds })}
`),
                        );
                    }
                });
            }
        }
    }
    return {
        ok: errors.length === 0,
        error: new AggregationError(errors, "Secretlint Configuration Error"),
    };
};
