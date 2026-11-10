import { createEngine } from "../src/index.js";
import { secretLintProfiler } from "@secretlint/profiler";
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

describe("createEngine profile option", () => {
    const options = {
        color: false,
        cwd: path.join(__dirname, "fixtures/valid-config"),
        formatter: "stylish",
    };
    afterEach(() => {
        // reset the shared profiler state for other tests
        secretLintProfiler.setEnabled(false);
    });
    it("should not enable the profiler by default", async () => {
        const engine = await createEngine(options);
        await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
        assert.strictEqual(secretLintProfiler.isEnabled, false);
        assert.deepStrictEqual(await secretLintProfiler.getMeasures(), []);
    });
    it("should enable the profiler and collect measures if profile is true", async () => {
        const engine = await createEngine({ ...options, profile: true });
        await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
        assert.strictEqual(secretLintProfiler.isEnabled, true);
        // wait for PerformanceObserver callback
        await new Promise((resolve) => setTimeout(resolve, 100));
        const measures = await secretLintProfiler.getMeasures();
        assert.ok(
            measures.some((measure) => measure.name === "@node>execute"),
            `should have measures: ${measures.map((measure) => measure.name).join(", ")}`,
        );
    });
    it("should disable the profiler if profile is false", async () => {
        secretLintProfiler.setEnabled(true);
        await createEngine({ ...options, profile: false });
        assert.strictEqual(secretLintProfiler.isEnabled, false);
    });
    it("should keep the profiler state if profile is not defined", async () => {
        secretLintProfiler.setEnabled(true);
        await createEngine(options);
        assert.strictEqual(secretLintProfiler.isEnabled, true);
    });
});
