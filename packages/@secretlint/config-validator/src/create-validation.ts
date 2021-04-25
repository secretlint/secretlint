import fs from "fs";
import path from "path";
import { parse, printSingleTypeValidator } from "typescript-json-validator";

const tsConfig = fs.readFileSync(path.join(__dirname, "../../types/tsconfig.json"), "utf-8");

const tsFilePath = path.join(__dirname, "../../types/src/SecretLintConfigDescriptor.ts");
if (!fs.existsSync(tsFilePath)) {
    throw new Error(`Not found: ${tsFilePath}`);
}
const parsedResult = parse([tsFilePath], tsConfig);
/**
 * Note: isSecretLintConfigDescriptorRule is union type
 * ajv does not work correctly for "rules[0].rules[0].id" case
 */
const create = (name: string) => {
    const schema = parsedResult.getType(name);
    const validation = printSingleTypeValidator(name, true, schema, "@secretlint/types", tsConfig, {
        allErrors: true,
        coerceTypes: "array",
        format: "fast",
        unicode: true,
        uniqueItems: true,
        useDefaults: true
    });
    fs.writeFileSync(path.join(__dirname, `${name}-validation.ts`), validation, "utf-8");
};
create("SecretLintConfigDescriptor");
create("SecretLintConfigDescriptorRule");
create("SecretLintConfigDescriptorRulePreset");
