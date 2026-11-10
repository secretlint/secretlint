import assert from "node:assert";
import { createKeywordMatcher, getKeywordMatcher, normalizeKeyword } from "../../src/helper/keyword-matcher.js";

const found = (keywords: string[], text: string): string[] => {
    const matcher = createKeywordMatcher(keywords.map((keyword) => normalizeKeyword(keyword) as string));
    const flags = matcher.match(text);
    return matcher.keywords.filter((_, index) => flags[index] === 1);
};
describe("keyword-matcher", () => {
    it("finds keywords in the text", () => {
        assert.deepStrictEqual(found(["ghp_", "npm_", "glpat-"], "token = ghp_xxx; npm_yyy"), ["ghp_", "npm_"]);
    });
    it("matches ASCII case-insensitively", () => {
        assert.deepStrictEqual(found(["secret", "PRIVATE KEY"], "AWS_SECRET_ACCESS_KEY / private key"), [
            "secret",
            "private key",
        ]);
    });
    it("finds overlapping keywords and keywords that are suffixes of other keywords", () => {
        assert.deepStrictEqual(found(["sk-ant-api0", "ant", "api", "k-a"], "sk-ant-api03"), [
            "sk-ant-api0",
            "ant",
            "api",
            "k-a",
        ]);
        assert.deepStrictEqual(found(["abcd", "bc"], "xabcx"), ["bc"]);
    });
    it("restarts matching after a partial match", () => {
        assert.deepStrictEqual(found(["xoxb"], "xoxoxb"), ["xoxb"]);
        assert.deepStrictEqual(found(["aab"], "aaab"), ["aab"]);
    });
    it("does not match non-ASCII characters", () => {
        // U+212A KELVIN SIGN lower-cases to "k" with toLowerCase(), but it is not "k"
        assert.deepStrictEqual(found(["key"], "Key"), []);
        assert.deepStrictEqual(found(["key"], "あkeyい"), ["key"]);
    });
    it("returns no keyword for an empty text", () => {
        assert.deepStrictEqual(found(["a"], ""), []);
    });
    it("normalizeKeyword rejects empty and non-ASCII keywords", () => {
        assert.strictEqual(normalizeKeyword(""), undefined);
        assert.strictEqual(normalizeKeyword("秘密"), undefined);
        assert.strictEqual(normalizeKeyword(1), undefined);
        assert.strictEqual(normalizeKeyword("SG."), "sg.");
    });
    it("caches the matcher by keywords", () => {
        assert.strictEqual(getKeywordMatcher(["a", "b"]), getKeywordMatcher(["a", "b"]));
        assert.notStrictEqual(getKeywordMatcher(["a", "b"]), getKeywordMatcher(["a", "c"]));
    });
    it("matches the same as String#includes on random texts", () => {
        const alphabet = "abAB_-.";
        const random = (length: number) =>
            Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
        for (let i = 0; i < 200; i++) {
            const keywords = Array.from(
                new Set(Array.from({ length: 5 }, () => random(1 + Math.floor(Math.random() * 4)).toLowerCase())),
            );
            const text = random(Math.floor(Math.random() * 40));
            const expected = keywords.filter((keyword) => text.toLowerCase().includes(keyword));
            assert.deepStrictEqual(found(keywords, text), expected, JSON.stringify({ keywords, text }));
        }
    });
});
