import type { SecretLintRulePresetCreator } from "@secretlint/types";
import { presetRecommend, recommendedRules } from "@secretlint/core/builtin";

// The rules of this preset are built into @secretlint/core.
// secretlint resolves "@secretlint/secretlint-rule-preset-recommend" from @secretlint/core and does not need this package.
// This package re-exports the preset for compatibility.
export const rules = [...recommendedRules];
export type Options = {};

export const creator: SecretLintRulePresetCreator<Options> = presetRecommend;
