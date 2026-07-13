import { createEngine } from "../src/index.js";
import fs from "node:fs";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const normalizeFilePath = (content: string): string => {
    return content.replace(__dirname, "[TEST_DIR]").replace(/\\/g, "/");
};
describe("createEngine", () => {
    it("should throw rejected promise if the config file is not found", async () => {
        return assert.rejects(
            createEngine({
                color: false,
                configFilePath: "/not/found/config",
                formatter: "stylish",
                moduleResolutionBase: import.meta.url,
            }),
            /secretlint config is not found/
        );
    });
    it("should create an Engine and execute on files", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            moduleResolutionBase: import.meta.url,
        });
        const result = await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
        assert.strictEqual(result.ok, false);
        const normalizedOutput = normalizeFilePath(result.output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  error  [EXAMPLE_MESSAGE] found secret: SECRET  @secretlint/secretlint-rule-example

✖ 1 problem (1 error, 0 warnings, 0 infos)
`
        );
    });
    it("should create an Engine and execute on a content", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            moduleResolutionBase: import.meta.url,
        });
        const filePath = path.join(__dirname, "fixtures/SECRET.txt");
        const content = fs.readFileSync(filePath, "utf-8");
        const result = await engine.executeOnContent({
            content,
            filePath,
        });
        assert.strictEqual(result.ok, false);
        const normalizedOutput = normalizeFilePath(result.output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  error  [EXAMPLE_MESSAGE] found secret: SECRET  @secretlint/secretlint-rule-example

✖ 1 problem (1 error, 0 warnings, 0 infos)
`
        );
    });
    it("should hide secret values when enable maskSecrets", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            maskSecrets: true,
            moduleResolutionBase: import.meta.url,
        });
        const filePath = path.join(__dirname, "fixtures/SECRET.txt");
        const content = fs.readFileSync(filePath, "utf-8");
        const result = await engine.executeOnContent({
            content,
            filePath,
        });
        assert.strictEqual(result.ok, false);
        const normalizedOutput = normalizeFilePath(result.output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  error  [EXAMPLE_MESSAGE] found secret: ******  @secretlint/secretlint-rule-example

✖ 1 problem (1 error, 0 warnings, 0 infos)
`
        );
    });
    it("should load a rule from an explicit logical install group", async () => {
        const installGroupDirectory = fs.realpathSync(
            fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-node-install-group-"))
        );
        const globalVirtualStoreDirectory = fs.realpathSync(
            fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-node-global-virtual-store-"))
        );
        const ruleName = "secretlint-rule-logical-install-fixture";
        const ruleDirectory = path.join(globalVirtualStoreDirectory, "node_modules", ruleName);
        const logicalRuleDirectory = path.join(installGroupDirectory, "node_modules", ruleName);
        const moduleResolutionBase = path.join(
            installGroupDirectory,
            "node_modules",
            "secretlint",
            "bin",
            "secretlint.js"
        );
        fs.mkdirSync(ruleDirectory, { recursive: true });
        fs.writeFileSync(
            path.join(ruleDirectory, "package.json"),
            JSON.stringify({ name: ruleName, version: "1.0.0", type: "module", exports: "./index.js" })
        );
        fs.writeFileSync(
            path.join(ruleDirectory, "index.js"),
            `export const creator = {
    messages: {},
    meta: {
        id: ${JSON.stringify(ruleName)},
        recommended: false,
        type: "scanner",
        supportedContentTypes: ["text"],
        docs: { url: "https://github.com/secretlint/secretlint/issues/1624" }
    },
    create() {
        return { file() {} };
    }
};
`
        );
        fs.mkdirSync(path.dirname(logicalRuleDirectory), { recursive: true });
        fs.symlinkSync(
            ruleDirectory,
            logicalRuleDirectory,
            process.platform === "win32" ? "junction" : "dir"
        );

        try {
            const engine = await createEngine({
                color: false,
                configFileJSON: {
                    rules: [{ id: ruleName }]
                },
                formatter: "json",
                moduleResolutionBase
            });
            const result = await engine.executeOnContent({ content: "plain text", filePath: "fixture.txt" });

            assert.strictEqual(result.ok, true);
        } finally {
            fs.rmSync(installGroupDirectory, { recursive: true, force: true });
            fs.rmSync(globalVirtualStoreDirectory, { recursive: true, force: true });
        }
    });
});
