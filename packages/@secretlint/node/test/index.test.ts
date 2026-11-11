import { createEngine } from "../src/index.js";
import { secretLintProfiler } from "@secretlint/profiler";
import fs from "node:fs";
import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// A formatter that outputs the content of the sources via `getSource()`
const sourceFormatterPath = path.join(__dirname, "fixtures/formatter/source-formatter.mjs");
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
    it("should not output the content of the files with json formatter", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "json",
            maskSecrets: false,
        });
        const secretFilePath = path.join(__dirname, "fixtures/SECRET.txt");
        const cleanFilePath = path.join(__dirname, "fixtures/valid-config/.secretlintrc.json");
        const result = await engine.executeOnFiles({ filePathList: [secretFilePath, cleanFilePath] });
        const results: { messages: unknown[] }[] = JSON.parse(result.output);
        assert.deepStrictEqual(
            results.map((fileResult) => [fileResult.messages.length, Object.keys(fileResult).sort()]),
            [
                [1, ["filePath", "messages", "sourceContentType"]],
                [0, ["filePath", "messages", "sourceContentType"]],
            ],
        );
    });
    it("should pass getSource to the formatter, and it returns the content of the files that have messages", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: sourceFormatterPath,
            maskSecrets: false,
        });
        const secretFilePath = path.join(__dirname, "fixtures/SECRET.txt");
        const cleanFilePath = path.join(__dirname, "fixtures/valid-config/.secretlintrc.json");
        const result = await engine.executeOnFiles({ filePathList: [secretFilePath, cleanFilePath] });
        assert.deepStrictEqual(JSON.parse(result.output), [
            { filePath: secretFilePath, messageCount: 1, source: fs.readFileSync(secretFilePath, "utf-8") },
            // the content of the file without messages is not decoded
            { filePath: cleanFilePath, messageCount: 0, source: null },
        ]);
    });
    it("should pass getSource to the formatter on executeOnContent", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: sourceFormatterPath,
            maskSecrets: false,
        });
        const result = await engine.executeOnContent({ content: "no secret", filePath: "/path/to/stdin.txt" });
        assert.deepStrictEqual(JSON.parse(result.output), [
            { filePath: "/path/to/stdin.txt", messageCount: 0, source: "no secret" },
        ]);
    });
    it("should lint files in concurrent executeOnFiles calls", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: sourceFormatterPath,
            maskSecrets: false,
        });
        const secretFilePath = path.join(__dirname, "fixtures/SECRET.txt");
        const cleanFilePath = path.join(__dirname, "fixtures/valid-config/.secretlintrc.json");
        // The calls do not share the buffer of the file reader
        const outputs = await Promise.all(
            [[secretFilePath, cleanFilePath], [cleanFilePath, secretFilePath], [secretFilePath]].map(
                async (filePathList) => {
                    const result = await engine.executeOnFiles({ filePathList });
                    const results: { messageCount: number; source: string | null }[] = JSON.parse(result.output);
                    return results.map((fileResult) => [fileResult.messageCount, fileResult.source]);
                },
            ),
        );
        const secretContent = fs.readFileSync(secretFilePath, "utf-8");
        assert.deepStrictEqual(outputs, [
            [
                [1, secretContent],
                [0, null],
            ],
            [
                [0, null],
                [1, secretContent],
            ],
            [[1, secretContent]],
        ]);
    });
    it("should output the content of the files without messages with mask-result formatter", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "mask-result",
        });
        const secretFilePath = path.join(__dirname, "fixtures/SECRET.txt");
        const cleanFilePath = path.join(__dirname, "fixtures/valid-config/.secretlintrc.json");
        const cleanResult = await engine.executeOnFiles({ filePathList: [cleanFilePath] });
        assert.strictEqual(cleanResult.ok, true);
        assert.strictEqual(cleanResult.output, fs.readFileSync(cleanFilePath, "utf-8"));
        const secretResult = await engine.executeOnFiles({ filePathList: [secretFilePath] });
        assert.strictEqual(secretResult.ok, false);
        assert.strictEqual(secretResult.output, fs.readFileSync(secretFilePath, "utf-8").replace("SECRET", "******"));
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
