import assert from "node:assert";
import { SecretLintSourceCodeImpl } from "../src/SecretLintSourceCodeImpl.js";

describe("SecretLintSourceCodeImpl", () => {
    it("strips BOM from content", () => {
        const sourceCode = new SecretLintSourceCodeImpl({
            content: "﻿line1\nline2",
            filePath: "/path/to/file.txt",
            physicalFilePath: "/path/to/file.txt",
            ext: ".txt",
            contentType: "text",
        });
        assert.strictEqual(sourceCode.hasBOM, true);
        assert.strictEqual(sourceCode.content, "line1\nline2");
        assert.deepStrictEqual(sourceCode.rangeToLocation([6, 11]), {
            start: { line: 2, column: 0 },
            end: { line: 2, column: 5 },
        });
    });
    it("does not call the content function until content is accessed", () => {
        let callCount = 0;
        const sourceCode = new SecretLintSourceCodeImpl({
            content: () => {
                callCount++;
                return "binary content";
            },
            filePath: "/path/to/file.bin",
            physicalFilePath: "/path/to/file.bin",
            ext: ".bin",
            contentType: "binary",
        });
        assert.strictEqual(callCount, 0);
        assert.strictEqual(sourceCode.content, "binary content");
        assert.strictEqual(sourceCode.content, "binary content");
        assert.strictEqual(sourceCode.hasBOM, false);
        assert.strictEqual(callCount, 1);
    });
});
