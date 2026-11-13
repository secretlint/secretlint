import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getFormatterList, loadFormatter, secretlintGetFormatterList } from "../src/index.js";
import { results } from "./snapshots/input.js";

describe("@secretlint/formatter loadFormatter", () => {
    it("getFormatterList returns the built-in formatters", () => {
        assert.deepStrictEqual(
            getFormatterList().map((formatter) => formatter.name),
            [
                "checkstyle",
                "compact",
                "github",
                "jslint-xml",
                "junit",
                "pretty-error",
                "stylish",
                "tap",
                "unix",
                "json",
                "mask-result",
                "table",
            ],
        );
        assert.deepStrictEqual(
            secretlintGetFormatterList().map((formatter) => formatter.name),
            ["json", "mask-result", "table"],
        );
    });
    it("throws an error if the formatter is not found", async () => {
        await assert.rejects(
            loadFormatter({ formatterName: "not-found-formatter" }),
            /Could not find formatter not-found-formatter/,
        );
    });
    it("does not treat a property of Object as a formatter", async () => {
        await assert.rejects(loadFormatter({ formatterName: "constructor" }), /Could not find formatter constructor/);
        await assert.rejects(loadFormatter({ formatterName: "toString" }), /Could not find formatter toString/);
    });
    it("loads a formatter from a file path, and passes the results of secretlint to it", async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-formatter-"));
        try {
            const formatterPath = path.join(tmpDir, "formatter.mjs");
            fs.writeFileSync(
                formatterPath,
                "export default (results, options) => `${results.length}:${results[0].messages[0].severity}:${options.color}`;",
            );
            const formatter = await loadFormatter({ formatterName: formatterPath, color: false });
            assert.strictEqual(formatter.format(results), `${results.length}:warning:false`);
        } finally {
            fs.rmSync(tmpDir, { recursive: true });
        }
    });
    it("removes control characters in the output of the lint formatters", async () => {
        const formatter = await loadFormatter({ formatterName: "unix", color: false });
        const output = formatter.format([
            {
                ...results[0],
                filePath: "/path/to/\u001B[31mfile.txt",
                messages: [{ ...results[0].messages[0], message: "found \u001B]0;title\u0007secret" }],
            },
        ]);
        assert.ok(!output.includes("\u001B"));
        assert.ok(output.startsWith("/path/to/file.txt:"));
        assert.ok(output.includes("found secret"));
    });
});
