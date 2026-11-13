import type { SecretLintRulePresetCreator } from "@secretlint/types";
import { presetCanary, canaryRules } from "@secretlint/core/builtin";

// The rules of this preset are built into @secretlint/core.
// secretlint resolves "@secretlint/secretlint-rule-preset-canary" from @secretlint/core and does not need this package.
// This package re-exports the preset for compatibility.
export const rules = [...canaryRules];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = presetCanary;
