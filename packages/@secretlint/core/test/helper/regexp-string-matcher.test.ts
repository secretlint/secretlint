import assert from "node:assert";
import { createRegExp, matchPatterns } from "../../src/helper/regexp-string-matcher.js";

describe("regexp-string-matcher", () => {
    describe("createRegExp", () => {
        it("creates a RegExp that matches the string as is", () => {
            const regExp = createRegExp("a.b-c(d)[e]");
            assert.strictEqual(regExp.flags, "gu");
            assert.deepStrictEqual("a.b-c(d)[e] axb-c(d)[e]".match(regExp), ["a.b-c(d)[e]"]);
        });
        it("creates a RegExp from a RegExp-like string, and adds u and g flags", () => {
            assert.deepStrictEqual(createRegExp("/a+/"), /a+/gu);
            assert.deepStrictEqual(createRegExp("/a+/i"), /a+/giu);
            assert.deepStrictEqual(createRegExp("/a+/gm"), /a+/gmu);
            assert.deepStrictEqual(createRegExp("/\\/path\\//"), /\/path\//gu);
        });
        it("treats a string that is not enclosed by slashes as a string", () => {
            assert.deepStrictEqual("/a+ a+/".match(createRegExp("/a+")), ["/a+"]);
            assert.deepStrictEqual("a/b".match(createRegExp("//")), null);
        });
        it("throws an error if the string is empty", () => {
            assert.throws(() => createRegExp(""), /Empty string/);
        });
        it("throws an error if the RegExp is invalid", () => {
            assert.throws(() => createRegExp("/(/"), SyntaxError);
        });
    });
    describe("matchPatterns", () => {
        it("returns an empty array if no pattern is passed", () => {
            assert.deepStrictEqual(matchPatterns("text", []), []);
        });
        it("returns an empty array if no pattern matches", () => {
            assert.deepStrictEqual(matchPatterns("text", ["nope", "/\\d+/"]), []);
        });
        it("returns all matches with captures", () => {
            assert.deepStrictEqual(matchPatterns("key=1, KEY=22", ["/key=(\\d+)/i"]), [
                { match: "key=1", captures: ["1"], startIndex: 0, endIndex: 5 },
                { match: "KEY=22", captures: ["22"], startIndex: 7, endIndex: 13 },
            ]);
        });
        it("sorts the results by the position", () => {
            assert.deepStrictEqual(
                matchPatterns("abc abcd", ["abcd", "/abc/", "ab"]).map((result) => [
                    result.startIndex,
                    result.endIndex,
                    result.match,
                ]),
                [
                    [0, 2, "ab"],
                    [0, 3, "abc"],
                    [4, 6, "ab"],
                    [4, 7, "abc"],
                    [4, 8, "abcd"],
                ],
            );
        });
        it("removes the result of the same range", () => {
            assert.deepStrictEqual(matchPatterns("abc", ["abc", "/a(b)c/", "/ABC/i"]), [
                { match: "abc", captures: [], startIndex: 0, endIndex: 3 },
            ]);
        });
        it("returns the same results when it is called again", () => {
            const patterns = ["/a/", "b"];
            assert.deepStrictEqual(matchPatterns("aab", patterns), matchPatterns("aab", patterns));
            assert.strictEqual(matchPatterns("aab", patterns).length, 3);
        });
        it("matches by code point", () => {
            assert.deepStrictEqual(matchPatterns("a𠮷b", ["/a.b/"]), [
                { match: "a𠮷b", captures: [], startIndex: 0, endIndex: 4 },
            ]);
        });
    });
});
