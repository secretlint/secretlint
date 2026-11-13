import type { SecretLintCoreConfig } from "@secretlint/types";
import { creator as patternRule } from "../../src/builtin/rules/pattern/index.js";

/**
 * The rules that need other rules in the test, used by rules.test.ts and presets.test.ts.
 * filter-comments filters the messages of other rules, so it is tested with the pattern rule.
 */
export const additionalRules: Record<string, SecretLintCoreConfig["rules"]> = {
    "filter-comments": [
        {
            id: "@secretlint/secretlint-rule-secret-number",
            rule: patternRule,
            options: { patterns: [{ name: "secret-number", pattern: "/SECRET \\d+/" }] },
        },
        {
            id: "@secretlint/secretlint-rule-secret-alphabet",
            rule: patternRule,
            options: { patterns: [{ name: "secret-alphabet", pattern: "/SECRET [a-zA-Z]/" }] },
        },
    ],
};
