import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import {
    builtinRuleIds,
    builtinRules,
    canaryRules,
    getBuiltinRule,
    presetCanary,
    presetRecommend,
    recommendedRules,
} from "../../src/builtin/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const builtinDir = path.join(__dirname, "../../src/builtin");

describe("builtin", () => {
    it("each rule directory is registered with the id of its former package", () => {
        const dirs = fs
            .readdirSync(path.join(builtinDir, "rules"), { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name)
            .sort();
        const ids = builtinRules.map((rule) => rule.meta.id).sort();
        assert.deepStrictEqual(
            ids,
            dirs.map((dir) => `@secretlint/secretlint-rule-${dir}`),
        );
    });
    it("ids are unique and resolvable", () => {
        assert.strictEqual(new Set(builtinRuleIds).size, builtinRuleIds.length);
        for (const id of builtinRuleIds) {
            assert.strictEqual(getBuiltinRule(id)?.meta.id, id);
        }
        assert.strictEqual(getBuiltinRule("@secretlint/secretlint-rule-not-found"), undefined);
    });
    it("presets register their rules", () => {
        for (const [preset, rules] of [
            [presetRecommend, recommendedRules],
            [presetCanary, canaryRules],
        ] as const) {
            const registered: string[] = [];
            preset.create(
                {
                    sharedOptions: {},
                    registerRule(rule) {
                        registered.push(rule.meta.id);
                    },
                },
                {},
            );
            assert.deepStrictEqual(
                registered,
                recommendedRules.map((rule) => rule.meta.id),
            );
        }
    });
    it("does not import Node.js modules statically, so it works in browsers", () => {
        const files = fs
            .readdirSync(builtinDir, { recursive: true, encoding: "utf-8" })
            .filter((file) => file.endsWith(".ts"));
        assert.ok(files.length > 0);
        for (const file of files) {
            const content = fs.readFileSync(path.join(builtinDir, file), "utf-8");
            assert.doesNotMatch(content, /^import [^;]*from "node:/m, `${file} imports a Node.js module`);
        }
    });
});
