import assert from "node:assert";
import type { SecretLintCoreConfig, SecretLintRawSource, SecretLintRuleCreator } from "@secretlint/types";
import { lintSource } from "../src/index.js";
import { getLintPlan, getPlanView } from "../src/LintPlan.js";
import { creator as rulePattern, type Options } from "../src/builtin/rules/pattern/index.js";

// A rule with keywords. It does not report the source.
const keywordRule: SecretLintRuleCreator = {
    messages: {},
    meta: { id: "keyword-rule", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
    patterns: [{ pattern: /tok_[a-z0-9]{4}/, keywords: ["tok_"], report() {} }],
};

const source: SecretLintRawSource = {
    filePath: "/dummy.txt",
    content: "password=secret",
    contentType: "text",
};
const toConfig = (options?: Options): SecretLintCoreConfig => {
    return {
        rules: [
            { id: rulePattern.meta.id, rule: rulePattern, options },
            { id: keywordRule.meta.id, rule: keywordRule },
        ],
    };
};

describe("@secretlint/secretlint-rule-pattern without patterns", () => {
    // `secretlint --init` writes the rule without options
    it("is not a part of the plan without options, so it does not run for every file", () => {
        const plan = getLintPlan(toConfig(), "en");
        assert.deepStrictEqual(
            plan.rules.map((rule) => rule.descriptorRule.id),
            [keywordRule.meta.id],
        );
        assert.strictEqual(getPlanView(plan, "text").hasAlwaysRule, false);
    });
    it("is not a part of the plan with empty patterns", () => {
        const plan = getLintPlan(toConfig({ patterns: [], allows: ["/foo/"] }), "en");
        assert.strictEqual(getPlanView(plan, "text").hasAlwaysRule, false);
    });
    it("runs with patterns", async () => {
        const config = toConfig({ patterns: [{ name: "password", patterns: ["/password=\\w+/"] }] });
        assert.strictEqual(getPlanView(getLintPlan(config, "en"), "text").hasAlwaysRule, true);
        const result = await lintSource({ source, options: { config } });
        assert.deepStrictEqual(
            result.messages.map((message) => message.ruleId),
            [rulePattern.meta.id],
        );
    });
    it("runs with filePathGlobs only", async () => {
        const config = toConfig({ patterns: [{ name: "txt", filePathGlobs: ["**/*.txt"] }] });
        const result = await lintSource({ source, options: { config } });
        assert.deepStrictEqual(
            result.messages.map((message) => message.ruleId),
            [rulePattern.meta.id],
        );
    });
    it("reports nothing without patterns, as before", async () => {
        const result = await lintSource({ source, options: { config: toConfig() } });
        assert.deepStrictEqual(result.messages, []);
    });
});
