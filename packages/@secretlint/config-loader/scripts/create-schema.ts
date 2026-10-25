import fs from "node:fs";
import { SCHEMA } from "../src/descriptor-types.validator.js";

const definitions = {
    ...SCHEMA.definitions,
    SecretLintConfigDescriptor: {
        ...SCHEMA.definitions.SecretLintConfigDescriptor,
        properties: {
            ...SCHEMA.definitions.SecretLintConfigDescriptor.properties,
            rules: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        rules: SCHEMA.definitions.SecretLintConfigDescriptorRulePreset.properties.rules,
                    },
                    if: { required: ["rules"] },
                    then: { $ref: "#/definitions/SecretLintConfigDescriptorRulePreset" },
                    else: { $ref: "#/definitions/SecretLintConfigDescriptorRule" },
                },
            },
        },
    },
    SecretLintConfigDescriptorRulePreset: {
        ...SCHEMA.definitions.SecretLintConfigDescriptorRulePreset,
        not: {
            anyOf: [{ required: ["severity"] }, { required: ["allowMessageIds"] }],
        },
    },
};
const schema = {
    $schema: SCHEMA.$schema,
    title: "Secretlint configuration",
    $ref: "#/definitions/SecretLintConfigDescriptor",
    definitions,
};
const outputPath = new URL("../schema.json", import.meta.url);
const output = JSON.stringify(schema, null, 4) + "\n";
if (process.argv.includes("--check")) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== output) {
        console.error("Configuration schema is out of date. Run npm run create-schema in @secretlint/config-loader.");
        process.exitCode = 1;
    }
} else {
    fs.writeFileSync(outputPath, output);
}
