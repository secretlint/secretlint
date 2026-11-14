/**
 * The rule `@secretlint/secretlint-rule-pattern`: the entry of user-defined patterns in a configuration.
 *
 * The rule has no `create()` and no patterns of its own. The rule id in `.secretlintrc` resolves to this `creator`
 * (see `builtin/index.ts`), and `getLintPlan()` finds the `creator` by its identity and converts `options.patterns`
 * to patterns of the lint plan with `compileUserPatterns()` of `./user-patterns.ts`.
 * The options and the messages are also in `./user-patterns.ts`. This file re-exports them, so that the package
 * `@secretlint/secretlint-rule-pattern` keeps exporting them. `./user-patterns.ts` is not exported from the package.
 */
import type { SecretLintRuleCreator } from "@secretlint/types";
import { messages, type Options } from "./user-patterns.js";

export { messages, type Options, type PatternType } from "./user-patterns.js";

/**
 * Without `options.patterns`, the rule adds nothing to the lint.
 */
export const creator: SecretLintRuleCreator<Options> = {
    messages,
    meta: {
        id: "@secretlint/secretlint-rule-pattern",
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
    },
    patterns: [],
};
