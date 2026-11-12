import assert from "node:assert";
import { SourceLineIndex } from "../../src/helper/SourceLineIndex.js";

describe("SourceLineIndex", () => {
    it("converts an index to a position", () => {
        const lineIndex = new SourceLineIndex("ab\ncd\n\nef");
        assert.deepStrictEqual(lineIndex.indexToPosition(0), { line: 1, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(2), { line: 1, column: 2 });
        assert.deepStrictEqual(lineIndex.indexToPosition(3), { line: 2, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(6), { line: 3, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(7), { line: 4, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(9), { line: 4, column: 2 });
    });
    it("converts a position to an index", () => {
        const lineIndex = new SourceLineIndex("ab\ncd\n\nef");
        assert.strictEqual(lineIndex.positionToIndex({ line: 1, column: 0 }), 0);
        assert.strictEqual(lineIndex.positionToIndex({ line: 2, column: 1 }), 4);
        assert.strictEqual(lineIndex.positionToIndex({ line: 3, column: 0 }), 6);
        assert.strictEqual(lineIndex.positionToIndex({ line: 4, column: 2 }), 9);
    });
    it("treats \\r\\n as one line terminator", () => {
        const lineIndex = new SourceLineIndex("a\r\nb\r\n");
        assert.deepStrictEqual(lineIndex.indexToPosition(1), { line: 1, column: 1 });
        assert.deepStrictEqual(lineIndex.indexToPosition(2), { line: 1, column: 2 });
        assert.deepStrictEqual(lineIndex.indexToPosition(3), { line: 2, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(6), { line: 3, column: 0 });
    });
    it("treats \\r, U+2028 and U+2029 as a line terminator", () => {
        const lineIndex = new SourceLineIndex("a\rb c d");
        assert.deepStrictEqual(lineIndex.indexToPosition(2), { line: 2, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(4), { line: 3, column: 0 });
        assert.deepStrictEqual(lineIndex.indexToPosition(6), { line: 4, column: 0 });
    });
    it("handles an empty text", () => {
        const lineIndex = new SourceLineIndex("");
        assert.deepStrictEqual(lineIndex.indexToPosition(0), { line: 1, column: 0 });
        assert.strictEqual(lineIndex.positionToIndex({ line: 1, column: 0 }), 0);
    });
    it("round-trips every index", () => {
        const text = "first\nsecond\r\n\rthird \n\nlast\n";
        const lineIndex = new SourceLineIndex(text);
        for (let index = 0; index <= text.length; index++) {
            assert.strictEqual(lineIndex.positionToIndex(lineIndex.indexToPosition(index)), index);
        }
    });
});
