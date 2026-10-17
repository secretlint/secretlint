import { createEngine } from "../src/index.js";
import fs from "node:fs";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
            }),
            /secretlint config is not found/,
        );
    });
    it("should create an Engine and execute on files", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            maskSecrets: false,
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
`,
        );
    });
    it("should create an Engine and execute on a content", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            maskSecrets: false,
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
`,
        );
    });
    it("should hide secret values when enable maskSecrets", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
            maskSecrets: true,
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
`,
        );
    });
    it("should hide secret values by default", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish",
        });
        const result = await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
        assert.strictEqual(result.ok, false);
        const normalizedOutput = normalizeFilePath(result.output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  error  [EXAMPLE_MESSAGE] found secret: ******  @secretlint/secretlint-rule-example

✖ 1 problem (1 error, 0 warnings, 0 infos)
`,
        );
    });
});

describe("scanner version", () => {
    for (const target of ["files", "content"] as const) {
        it(`passes the scanner version when scanning ${target}`, async () => {
            const engine = await createEngine({
                cwd: path.join(__dirname, "fixtures/valid-config"),
                formatter: fileURLToPath(import.meta.resolve("@secretlint/secretlint-formatter-sarif")),
                secretlintVersion: "2.3.4",
            });
            const filePath = path.join(__dirname, "fixtures/SECRET.txt");
            const result =
                target === "files"
                    ? await engine.executeOnFiles({ filePathList: [filePath] })
                    : await engine.executeOnContent({ content: fs.readFileSync(filePath, "utf-8"), filePath });
            assert.strictEqual(result.ok, false);
            assert.strictEqual(JSON.parse(result.output).runs[0].tool.driver.version, "2.3.4");
        });
    }
});
