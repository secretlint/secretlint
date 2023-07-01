import path from "node:path";
import assert from "node:assert";
import { importSecretlintCreator, loadConfig } from "../src/index.js";
import { SecretLintCoreConfigUnionRule } from "@secretlint/types";
import fs from "node:fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const removeUndefined = (o: { [index: string]: any }) => {
    for (let key in o) {
        if (o[key] === undefined) {
            delete o[key];
        } else if (typeof o[key] === "object" && o[key] !== null) {
            removeUndefined(o[key]);
        }
    }
    return o;
};
describe("@secretlint/config-loader", function () {
    it("should load .secretlintrc.json", async () => {
        const config = await loadConfig({
            cwd: path.join(__dirname, "fixtures/valid-config"),
            node_moduleDir: path.join(__dirname, "fixtures/valid-config"),
        });
        assert.deepStrictEqual(
            removeUndefined(config),
            removeUndefined({
                ok: true,
                config: {
                    rules: [
                        {
                            id: "example",
                            rule: importSecretlintCreator(
                                await import("@secretlint/secretlint-rule-internal-test-pure-deps")
                            ),
                        },
                        {
                            id: "example-2",
                            rule: importSecretlintCreator(
                                await import("@secretlint/secretlint-rule-internal-test-pure-deps")
                            ),
                            disabled: true,
                        },
                    ],
                },
                configFilePath: path.join(__dirname, "fixtures/valid-config/.secretlintrc.json"),
                configDescriptor: JSON.parse(
                    fs.readFileSync(path.join(__dirname, "fixtures/valid-config/.secretlintrc.json"), "utf-8")
                ),
            })
        );
    });
    it("should load .secretlintrc.json with ESM rule", async () => {
        const config = await loadConfig({
            cwd: path.join(__dirname, "fixtures/valid-config-esm"),
            node_moduleDir: path.join(__dirname, "fixtures/valid-config-esm/modules"),
        });
        const rule = config.config.rules[0] as SecretLintCoreConfigUnionRule;
        assert.strictEqual(rule.id, "example");
        assert.strictEqual(typeof rule.rule, "object");
        assert.strictEqual(typeof rule.rule.create, "function");
        assert.strictEqual(typeof rule.rule.meta, "object");
    });
    it("should return errors if rule module is not found in .secretlintrc.json", async () => {
        return loadConfig({
            cwd: path.join(__dirname, "fixtures/missing-rule-config"),
        })
            .then(() => assert.fail("should not be called"))
            .catch((error: unknown) => {
                assert.ok(error instanceof Error);
            });
    });
    it("should return errors if .secretlintrc.json is invalid format", async () => {
        return loadConfig({
            cwd: path.join(__dirname, "fixtures/invalid-config"),
        })
            .then(() => assert.fail("should not be called"))
            .catch((error: Error) => {
                assert.ok(
                    error.message.includes(
                        `secretlintrc/rules/0 must have required property 'id', secretlintrc/rules/0 must have required property 'id', secretlintrc/rules/0 must match a schema in anyOf`
                    ),
                    error.message
                );
            });
    });
});
