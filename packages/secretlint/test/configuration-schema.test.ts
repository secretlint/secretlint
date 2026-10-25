import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";

const schemaPath = fileURLToPath(new URL("../configuration_schema.json", import.meta.url));
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = new Ajv().compile(schema);
const configLoaderSnapshotsDir = fileURLToPath(
    new URL("../../@secretlint/config-loader/test/snapshots", import.meta.url),
);

describe("configuration_schema.json", () => {
    it("is resolvable from the package", () => {
        assert.strictEqual(fileURLToPath(import.meta.resolve("secretlint/configuration_schema.json")), schemaPath);
    });

    describe("accepts valid configurations", () => {
        const okDirs = fs.readdirSync(configLoaderSnapshotsDir).filter((name) => name.startsWith("ok."));
        it.each(okDirs)("config-loader snapshot: %s", (dir) => {
            const config = JSON.parse(
                fs.readFileSync(path.join(configLoaderSnapshotsDir, dir, ".secretlintrc.json"), "utf-8"),
            );
            assert.ok(validate(config), JSON.stringify(validate.errors));
        });
        it.each([
            { $schema: "./node_modules/secretlint/configuration_schema.json", rules: [] },
            { rules: [{ id: "example", options: { allows: ["/a/"] }, severity: "info", allowMessageIds: ["ID"] }] },
            { rules: [{ id: "preset", options: {}, disabled: false, rules: [{ id: "example", disabled: true }] }] },
            { rules: [], sharedOptions: { key: "value" } },
        ])("%j", (config) => {
            assert.ok(validate(config), JSON.stringify(validate.errors));
        });
    });

    describe("rejects invalid configurations", () => {
        it.each([
            {},
            { rule: [] },
            { rules: {} },
            { rules: [{}] },
            { rules: [{ id: "" }] },
            { rules: [{ id: "example", option: {} }] },
            { rules: [{ id: "example", disabled: "true" }] },
            { rules: [{ id: "example", severity: "fatal" }] },
            { rules: [{ id: "example", allowMessageIds: "ID" }] },
            { rules: [{ id: "preset", rules: [{ id: "example", option: {} }] }] },
            { rules: [{ id: "preset", rules: [], severity: "error" }] },
            { rules: [{ id: "preset", rules: [], allowMessageIds: ["ID"] }] },
            { rules: [], sharedOptions: [] },
        ])("%j", (config) => {
            assert.strictEqual(validate(config), false);
        });
    });
});
