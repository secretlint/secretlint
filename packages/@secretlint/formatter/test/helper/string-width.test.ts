import assert from "node:assert";
import { stringWidth } from "../../src/helper/string-width.js";

describe("stringWidth", () => {
    it("returns the number of the characters for ASCII", () => {
        assert.strictEqual(stringWidth(""), 0);
        assert.strictEqual(stringWidth("abc"), 3);
        assert.strictEqual(stringWidth("a b"), 3);
    });
    it("counts a fullwidth character as two columns", () => {
        assert.strictEqual(stringWidth("日本語"), 6);
        assert.strictEqual(stringWidth("ＡＢ"), 4);
        assert.strictEqual(stringWidth("한"), 2);
        assert.strictEqual(stringWidth("a日b"), 4);
        assert.strictEqual(stringWidth("𠮷"), 2);
    });
    it("counts an emoji as two columns", () => {
        assert.strictEqual(stringWidth("😀"), 2);
        assert.strictEqual(stringWidth("👨‍👩‍👧"), 2);
        assert.strictEqual(stringWidth("a😀b"), 4);
    });
    it("ignores escape sequences", () => {
        assert.strictEqual(stringWidth("\u001B[31merror\u001B[39m"), 5);
        assert.strictEqual(stringWidth("\u001B]8;;https://example.com\u0007link\u001B]8;;\u0007"), 4);
    });
    it("ignores control characters and combining characters", () => {
        assert.strictEqual(stringWidth("a\tb\n"), 2);
        assert.strictEqual(stringWidth("é"), 1);
    });
});
