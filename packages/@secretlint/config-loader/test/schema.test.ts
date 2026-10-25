import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import { validateConfigDescriptor } from "../src/validator.js";

const schemaPath = new URL("../schema.json", import.meta.url);
const schemaURL =
    "https://raw.githubusercontent.com/secretlint/secretlint/master/packages/%40secretlint/config-loader/schema.json";
const readSchema = () => JSON.parse(fs.readFileSync(schemaPath, "utf8"));

describe("configuration JSON Schema", () => {
    it("is available through the package export", () => {
        expect(import.meta.resolve("@secretlint/config-loader/schema.json")).toBe(schemaPath.href);
    });

    it("is up to date with the descriptor schema", () => {
        const result = spawnSync(
            process.execPath,
            ["--import", "tsx", fileURLToPath(new URL("../scripts/create-schema.ts", import.meta.url)), "--check"],
            { encoding: "utf8" },
        );
        expect(result.stderr).toBe("");
        expect(result.status).toBe(0);
    });

    it.each([
        { rules: [] },
        {
            $schema: schemaURL,
            rules: [
                { id: "example", options: { custom: { nested: [1] } }, severity: "warning", allowMessageIds: ["ID"] },
            ],
            sharedOptions: { custom: true },
        },
        { rules: [{ id: "preset", disabled: false, rules: [{ id: "example", disabled: true, severity: "info" }] }] },
        { rules: [{ id: "preset", rules: [] }] },
    ])("accepts supported configurations: %j", (config) => {
        const validate = new Ajv().compile(readSchema());
        expect(validate(config), JSON.stringify(validate.errors)).toBe(true);
        expect(validateConfigDescriptor(structuredClone(config)).ok).toBe(true);
    });

    it.each([
        {},
        { rules: {} },
        { rules: [{}] },
        { rules: [{ id: 1 }] },
        { rules: [{ id: "example", disabled: "yes" }] },
        { rules: [{ id: "example", options: [] }] },
        { rules: [{ id: "example", severity: "fatal" }] },
        { rules: [{ id: "example", allowMessageIds: [1] }] },
        { rules: [{ id: "preset", rules: [{}] }] },
        { rules: [{ id: "preset", rules: "invalid" }] },
        { rules: [{ id: "preset", rules: [], severity: "error" }] },
        { rules: [{ id: "preset", rules: [], allowMessageIds: [] }] },
        { rules: [], sharedOptions: [] },
    ])("rejects malformed configurations: %j", (config) => {
        const validate = new Ajv().compile(readSchema());
        expect(validate(config)).toBe(false);
    });
});
