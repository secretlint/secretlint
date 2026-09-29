import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { createRawSource } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("createRawSource with a UTF-16 source", () => {
    it("decodes a UTF-16LE file marked with a BOM", async () => {
        const source = await createRawSource(path.join(__dirname, "snapshots/utf16le/input.txt"));

        assert.strictEqual(source.contentType, "text");
        assert.ok(
            source.content.includes("token=EXAMPLE_VALUE"),
            `expected decoded text, got ${JSON.stringify(source.content.slice(0, 40))}`,
        );
    });

    it("decodes a UTF-16BE file marked with a BOM", async () => {
        const source = await createRawSource(path.join(__dirname, "snapshots/utf16be/input.txt"));

        assert.strictEqual(source.contentType, "text");
        assert.ok(
            source.content.includes("token=EXAMPLE_VALUE"),
            `expected decoded text, got ${JSON.stringify(source.content.slice(0, 40))}`,
        );
    });
});
