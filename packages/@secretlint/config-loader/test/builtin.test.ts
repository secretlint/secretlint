import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { getBuiltinRule } from "@secretlint/core/builtin";
import type { SecretLintRulePresetCreator } from "@secretlint/types";
import { loadPackagesFromConfigDescriptor } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// A directory without the rule packages: built-in ids must not need node_modules
const emptyModuleDir = path.join(__dirname, "fixtures/valid-config-esm/modules");

describe("built-in rules", () => {
    it("should resolve the id of a built-in rule without installing the package", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [{ id: "@secretlint/secretlint-rule-aws", options: { allows: ["x"] } }],
            },
            node_moduleDir: emptyModuleDir,
        });
        assert.strictEqual(config.rules.length, 1);
        assert.strictEqual(config.rules[0].id, "@secretlint/secretlint-rule-aws");
        assert.strictEqual(config.rules[0].rule, getBuiltinRule("@secretlint/secretlint-rule-aws"));
        assert.deepStrictEqual(config.rules[0].options, { allows: ["x"] });
    });
    it("should resolve the id of a built-in preset and keep the options of its rules", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-preset-recommend",
                        rules: [{ id: "@secretlint/secretlint-rule-aws", disabled: true }],
                    },
                ],
            },
            node_moduleDir: emptyModuleDir,
        });
        const preset = config.rules[0];
        assert.strictEqual(preset.id, "@secretlint/secretlint-rule-preset-recommend");
        assert.strictEqual((preset.rule as SecretLintRulePresetCreator).meta.type, "preset");
        assert.ok("rules" in preset && preset.rules);
        assert.deepStrictEqual(preset.rules, [{ id: "@secretlint/secretlint-rule-aws", disabled: true, type: "rule" }]);
    });
    it("should resolve the short form of a built-in id", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [{ id: "@secretlint/github" }, { id: "@secretlint/preset-canary" }],
            },
            node_moduleDir: emptyModuleDir,
        });
        // The id in the config is kept as written; the rule is the built-in one
        assert.strictEqual(config.rules[0].id, "@secretlint/github");
        assert.strictEqual(config.rules[0].rule, getBuiltinRule("@secretlint/secretlint-rule-github"));
        assert.strictEqual(config.rules[1].rule, getBuiltinRule("@secretlint/secretlint-rule-preset-canary"));
    });
    it("should prefer testReplaceDefinitions over the built-in rule", async () => {
        const replaced = { ...getBuiltinRule("@secretlint/secretlint-rule-aws")! };
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [{ id: "@secretlint/secretlint-rule-aws" }],
            },
            testReplaceDefinitions: [{ id: "@secretlint/secretlint-rule-aws", rule: replaced as any }],
        });
        assert.strictEqual(config.rules[0].rule, replaced);
    });
    it("should still resolve a rule that is not built-in from node_modules", async () => {
        const { config } = await loadPackagesFromConfigDescriptor({
            configDescriptor: {
                rules: [{ id: "example" }],
            },
            node_moduleDir: emptyModuleDir,
        });
        assert.strictEqual(config.rules[0].id, "example");
        assert.strictEqual(config.rules[0].rule.meta.id, "@secretlint/secretlint-rule-internal-test-esm");
    });
});
