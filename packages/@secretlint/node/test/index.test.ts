import { createEngine } from "../src";
import fs from "fs";
import path from "path";
import assert from "assert";

const normalizeFilePath = (content: string): string => {
    return content.replace(__dirname, "[TEST_DIR]");
};
describe("createEngine", function() {
    it("should throw rejected promise if the config file is not found", async () => {
        return assert.rejects(
            createEngine({
                color: false,
                configFilePath: "/not/found/config",
                formatter: "stylish"
            }),
            /secretlint config is not found/
        );
    });
    it("should create an Engine and execute on files", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish"
        });
        const output = await engine.executeOnFiles({ filePathList: [path.join(__dirname, "fixtures/SECRET.txt")] });
        const normalizedOutput = normalizeFilePath(output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  warning  found secret: SECRET  @secretlint/secretlint-rule-example

✖ 1 problem (0 errors, 1 warning)
`
        );
    });
    it("should create an Engine and execute on a content", async () => {
        const engine = await createEngine({
            color: false,
            cwd: path.join(__dirname, "fixtures/valid-config"),
            formatter: "stylish"
        });
        const filePath = path.join(__dirname, "fixtures/SECRET.txt");
        const content = fs.readFileSync(filePath, "utf-8");
        const output = await engine.executeOnContent({
            content,
            filePath
        });
        const normalizedOutput = normalizeFilePath(output);
        assert.strictEqual(
            normalizedOutput,
            `
[TEST_DIR]/fixtures/SECRET.txt
  1:8  warning  found secret: SECRET  @secretlint/secretlint-rule-example

✖ 1 problem (0 errors, 1 warning)
`
        );
    });
});
