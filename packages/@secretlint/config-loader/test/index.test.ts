import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expect } from "vitest";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { SecretLintCoreConfigUnionRule } from "@secretlint/types";
import { presetRecommend } from "@secretlint/core/builtin";
import { DEFAULT_CONFIG_DESCRIPTOR, loadConfig, loadConfigDescriptor } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
describe("@secretlint/config-loader", () => {
    it("should load .secretlintrc.json with CJS rules", async () => {
        const config = await loadConfig({
            cwd: path.join(__dirname, "fixtures/valid-config-cjs/"),
            node_moduleDir: path.join(__dirname, "fixtures/valid-config-cjs/modules"),
        });
        // deep partial equality check
        // ruleは除く
        expect(removeUndefined(config)).toEqual(
            removeUndefined({
                ok: true,
                config: {
                    rules: [
                        {
                            id: "example",
                            rule: expect.any(Object),
                        },
                        {
                            id: "example-2",
                            rule: expect.any(Object),
                            disabled: true,
                        },
                    ],
                },
                configFilePath: path.join(__dirname, "fixtures/valid-config-cjs/.secretlintrc.json"),
                isDefault: false,
                messages: [],
                configDescriptor: JSON.parse(
                    fs.readFileSync(path.join(__dirname, "fixtures/valid-config-cjs/.secretlintrc.json"), "utf-8"),
                ),
            }),
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
                        `secretlintrc/rules/0 must have required property 'id', secretlintrc/rules/0 must have required property 'id', secretlintrc/rules/0 must match a schema in anyOf`,
                    ),
                    error.message,
                );
            });
    });
    describe("when no config is found", () => {
        let tmpDir: string;
        beforeEach(() => {
            // os.tmpdir() and its parents have no .secretlintrc
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-config-loader-"));
        });
        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });
        it("should use the recommend preset", async () => {
            const result = await loadConfig({ cwd: tmpDir });
            assert.strictEqual(result.isDefault, true);
            assert.strictEqual(result.configFilePath, undefined);
            assert.deepStrictEqual(result.configDescriptor, DEFAULT_CONFIG_DESCRIPTOR);
            assert.deepStrictEqual(result.messages, []);
            const rule = result.config.rules[0] as SecretLintCoreConfigUnionRule;
            assert.strictEqual(rule.id, "@secretlint/secretlint-rule-preset-recommend");
            assert.strictEqual(rule.rule, presetRecommend);
        });
        it("should use the same preset id as the built-in recommend preset", () => {
            assert.deepStrictEqual(DEFAULT_CONFIG_DESCRIPTOR, { rules: [{ id: presetRecommend.meta.id }] });
        });
        it("should return a new descriptor that a caller can change", async () => {
            const first = await loadConfigDescriptor({ cwd: tmpDir });
            first.configDescriptor.rules.push({ id: "changed" });
            const second = await loadConfigDescriptor({ cwd: tmpDir });
            assert.deepStrictEqual(second.configDescriptor, DEFAULT_CONFIG_DESCRIPTOR);
        });
        it("should not use the default when a config has no rules", async () => {
            fs.writeFileSync(path.join(tmpDir, ".secretlintrc.json"), JSON.stringify({ rules: [] }));
            const result = await loadConfig({ cwd: tmpDir });
            assert.strictEqual(result.isDefault, false);
            assert.strictEqual(result.configFilePath, path.join(tmpDir, ".secretlintrc.json"));
            assert.deepStrictEqual(result.config.rules, []);
        });
        it("should throw when the found config file is broken", async () => {
            fs.writeFileSync(path.join(tmpDir, ".secretlintrc.json"), "{");
            await expect(loadConfig({ cwd: tmpDir })).rejects.toThrow(/Cannot read config file/);
        });
        it("should throw when the found .secretlintrc without an extension is broken", async () => {
            fs.writeFileSync(path.join(tmpDir, ".secretlintrc"), "{");
            await expect(loadConfig({ cwd: tmpDir })).rejects.toThrow(/Cannot read config file/);
        });
        it("should throw when .secretlintrc of a parent directory is broken", async () => {
            fs.writeFileSync(path.join(tmpDir, ".secretlintrc"), "{");
            const subDir = path.join(tmpDir, "sub");
            fs.mkdirSync(subDir);
            await expect(loadConfig({ cwd: subDir })).rejects.toThrow(/Cannot read config file/);
        });
    });
    describe("configFilePath", () => {
        let tmpDir: string;
        let subDir: string;
        beforeEach(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-config-loader-"));
            subDir = path.join(tmpDir, "sub");
            fs.mkdirSync(subDir);
            fs.writeFileSync(path.join(tmpDir, "rc.json"), JSON.stringify({ rules: [] }));
        });
        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });
        it("should load the file relative to cwd", async () => {
            const result = await loadConfigDescriptor({ cwd: tmpDir, configFilePath: "rc.json" });
            assert.strictEqual(result.isDefault, false);
            assert.strictEqual(result.configFilePath, path.join(tmpDir, "rc.json"));
            assert.deepStrictEqual(result.configDescriptor, { rules: [] });
        });
        it("should not look for the file in the parent directories", async () => {
            await expect(loadConfigDescriptor({ cwd: subDir, configFilePath: "rc.json" })).rejects.toThrow(
                `secretlint config file is not found: ${path.join(subDir, "rc.json")}`,
            );
        });
        it("should not append an extension to the file name", async () => {
            await expect(loadConfigDescriptor({ cwd: tmpDir, configFilePath: "rc" })).rejects.toThrow(
                `secretlint config file is not found: ${path.join(tmpDir, "rc")}`,
            );
        });
        it("should not use the default when the file is not found", async () => {
            await expect(loadConfig({ cwd: tmpDir, configFilePath: "missing.json" })).rejects.toThrow(
                "secretlint config file is not found",
            );
        });
        it("should read a file without an extension as JSON or YAML", async () => {
            fs.writeFileSync(path.join(tmpDir, ".customrc"), "rules:\n  - id: example\n");
            const result = await loadConfigDescriptor({ cwd: tmpDir, configFilePath: ".customrc" });
            assert.deepStrictEqual(result.configDescriptor, { rules: [{ id: "example" }] });
        });
    });
});
