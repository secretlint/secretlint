import assert from "node:assert";
import {
    validateSecretLintConfigDescriptor,
    validateSecretLintConfigDescriptorRule,
    validateSecretLintConfigDescriptorRulePreset,
} from "../src/descriptor-validator.js";

const errorOf = (validate: () => void): string | undefined => {
    try {
        validate();
        return undefined;
    } catch (error) {
        assert.ok(error instanceof Error);
        assert.strictEqual(error.name, "ValidationError");
        return error.message;
    }
};
const descriptorError = (value: unknown) => errorOf(() => validateSecretLintConfigDescriptor(value, "secretlintrc"));
const ruleError = (value: unknown) => errorOf(() => validateSecretLintConfigDescriptorRule(value, "rule"));
const presetError = (value: unknown) => errorOf(() => validateSecretLintConfigDescriptorRulePreset(value, "preset"));

describe("descriptor-validator", () => {
    describe("validateSecretLintConfigDescriptor", () => {
        it("accepts a valid descriptor", () => {
            assert.strictEqual(descriptorError({ rules: [] }), undefined);
            assert.strictEqual(
                descriptorError({
                    sharedOptions: { key: "value" },
                    rules: [
                        { id: "rule" },
                        {
                            id: "rule",
                            options: { allows: [] },
                            disabled: false,
                            allowMessageIds: ["ID"],
                            severity: "warning",
                        },
                        {
                            id: "preset",
                            options: {},
                            disabled: true,
                            rules: [{ id: "rule", severity: "info", allowMessageIds: [] }],
                        },
                    ],
                }),
                undefined,
            );
        });
        it("accepts unknown properties", () => {
            assert.strictEqual(descriptorError({ rules: [{ id: "rule", unknown: 1 }], unknown: 1 }), undefined);
        });
        it("accepts a property that is undefined", () => {
            assert.strictEqual(
                descriptorError({ sharedOptions: undefined, rules: [{ id: "rule", options: undefined }] }),
                undefined,
            );
        });
        it("rejects a value that is not an object", () => {
            assert.strictEqual(descriptorError(null), "Invalid secretlintrc: secretlintrc must be object");
            assert.strictEqual(descriptorError([]), "Invalid secretlintrc: secretlintrc must be object");
            assert.strictEqual(descriptorError("text"), "Invalid secretlintrc: secretlintrc must be object");
        });
        it("rejects a descriptor without rules", () => {
            assert.strictEqual(
                descriptorError({}),
                "Invalid secretlintrc: secretlintrc must have required property 'rules'",
            );
        });
        it("rejects rules that is not an array", () => {
            assert.strictEqual(
                descriptorError({ rules: {} }),
                "Invalid secretlintrc: secretlintrc/rules must be array",
            );
        });
        it("rejects sharedOptions that is not an object", () => {
            assert.strictEqual(
                descriptorError({ sharedOptions: [], rules: [] }),
                "Invalid secretlintrc: secretlintrc/sharedOptions must be object",
            );
        });
        it("reports the errors as a rule and as a preset for the first invalid item of rules", () => {
            assert.strictEqual(
                descriptorError({ rules: [{ id: "rule" }, {}, {}] }),
                "Invalid secretlintrc: secretlintrc/rules/1 must have required property 'id', secretlintrc/rules/1 must have required property 'id', secretlintrc/rules/1 must match a schema in anyOf",
            );
            assert.strictEqual(
                descriptorError({ rules: [{ id: "preset", severity: "fatal", rules: [{ id: 1 }] }] }),
                "Invalid secretlintrc: secretlintrc/rules/0/severity must be equal to one of the allowed values, secretlintrc/rules/0/rules/0/id must be string, secretlintrc/rules/0 must match a schema in anyOf",
            );
            assert.strictEqual(
                descriptorError({ rules: ["rule"] }),
                "Invalid secretlintrc: secretlintrc/rules/0 must be object, secretlintrc/rules/0 must be object, secretlintrc/rules/0 must match a schema in anyOf",
            );
        });
        it("accepts an item that is valid as a rule or as a preset", () => {
            // valid as a preset: a preset does not define `severity`, so any value is allowed
            assert.strictEqual(descriptorError({ rules: [{ id: "preset", severity: "fatal", rules: [] }] }), undefined);
            // valid as a rule: a rule does not define `rules`, so any value is allowed
            assert.strictEqual(descriptorError({ rules: [{ id: "rule", rules: "text" }] }), undefined);
        });
    });
    describe("validateSecretLintConfigDescriptorRule", () => {
        it("accepts a valid rule", () => {
            assert.strictEqual(ruleError({ id: "rule" }), undefined);
            assert.strictEqual(ruleError({ id: "rule", severity: "error", options: {} }), undefined);
        });
        it("rejects a rule without id", () => {
            assert.strictEqual(ruleError({}), "Invalid rule: rule must have required property 'id'");
            assert.strictEqual(ruleError({ id: undefined }), "Invalid rule: rule must have required property 'id'");
        });
        it("rejects the property of a wrong type", () => {
            assert.strictEqual(ruleError({ id: 1 }), "Invalid rule: rule/id must be string");
            assert.strictEqual(ruleError({ id: "rule", options: [] }), "Invalid rule: rule/options must be object");
            assert.strictEqual(ruleError({ id: "rule", options: null }), "Invalid rule: rule/options must be object");
            assert.strictEqual(
                ruleError({ id: "rule", disabled: "true" }),
                "Invalid rule: rule/disabled must be boolean",
            );
            assert.strictEqual(
                ruleError({ id: "rule", allowMessageIds: "ID" }),
                "Invalid rule: rule/allowMessageIds must be array",
            );
            assert.strictEqual(
                ruleError({ id: "rule", allowMessageIds: ["ID", 1] }),
                "Invalid rule: rule/allowMessageIds/1 must be string",
            );
            assert.strictEqual(ruleError({ id: "rule", severity: 2 }), "Invalid rule: rule/severity must be string");
        });
        it("rejects unknown severity", () => {
            assert.strictEqual(
                ruleError({ id: "rule", severity: "fatal" }),
                "Invalid rule: rule/severity must be equal to one of the allowed values",
            );
        });
        it("reports only the first error", () => {
            assert.strictEqual(
                ruleError({ id: "rule", severity: "fatal", disabled: 1 }),
                "Invalid rule: rule/disabled must be boolean",
            );
        });
    });
    describe("validateSecretLintConfigDescriptorRulePreset", () => {
        it("accepts a valid preset", () => {
            assert.strictEqual(presetError({ id: "preset" }), undefined);
            assert.strictEqual(presetError({ id: "preset", rules: [{ id: "rule", severity: "info" }] }), undefined);
        });
        it("rejects a preset without id", () => {
            assert.strictEqual(presetError({ rules: [] }), "Invalid preset: preset must have required property 'id'");
        });
        it("rejects rules that is not an array", () => {
            assert.strictEqual(presetError({ id: "preset", rules: {} }), "Invalid preset: preset/rules must be array");
        });
        it("rejects an invalid rule in rules", () => {
            assert.strictEqual(
                presetError({ id: "preset", rules: [{ id: "rule" }, {}] }),
                "Invalid preset: preset/rules/1 must have required property 'id'",
            );
            assert.strictEqual(
                presetError({ id: "preset", rules: [{ id: "rule", severity: "fatal" }] }),
                "Invalid preset: preset/rules/0/severity must be equal to one of the allowed values",
            );
        });
    });
});
