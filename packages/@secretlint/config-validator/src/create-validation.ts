import fs from "fs";
import path from "path";
import { parse, printSingleTypeValidator } from "typescript-json-validator";

const tsConfig = fs.readFileSync(path.join(__dirname, "../../types/tsconfig.json"), "utf-8");

const tsFilePath = path.join(__dirname, "../../types/src/SecretLintConfigDescriptor.ts");
if (!fs.existsSync(tsFilePath)) {
    throw new Error(`Not found: ${tsFilePath}`);
}
const parsedResult = parse([tsFilePath], tsConfig);
const typeName = "SecretLintConfigDescriptor";
const schema = parsedResult.getType(typeName);
const validator = printSingleTypeValidator(typeName, true, schema, "@secretlint/types", tsConfig);
fs.writeFileSync(path.join(__dirname, "validation.ts"), validator, "utf-8");
