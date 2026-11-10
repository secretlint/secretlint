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
    describe("scan", () => {
        const scanPositions = (keywords: string[], input: string | Uint8Array, start?: number) => {
            const matcher = createKeywordMatcher(keywords);
            const hits = matcher.createHits();
            const found = matcher.scan(input, hits, start);
            const positions: [string[], number][] = [];
            for (let i = 0; i < hits.count; i++) {
                positions.push([
                    matcher.keywordsOfState(hits.positions[i * 2] as number).map((index) => keywords[index] as string),
                    hits.positions[i * 2 + 1] as number,
                ]);
            }
            return { found, positions, flags: [...hits.found] };
        };
        it("returns the keywords and the index of their last character", () => {
            assert.deepStrictEqual(scanPositions(["ghp_", "npm_"], "a ghp_x NPM_y ghp_"), {
                found: true,
                positions: [
                    [["ghp_"], 5],
                    [["npm_"], 11],
                    [["ghp_"], 17],
                ],
                flags: [1, 1],
            });
        });
        it("returns all keywords that end at the same index", () => {
            assert.deepStrictEqual(scanPositions(["abc", "bc", "c"], "xabc").positions, [[["abc", "bc", "c"], 3]]);
        });
        it("finds the same keywords in a string and in its UTF-8 bytes", () => {
            const text = "日本語 ghp_x\n𠮷 npm_y é ghp_";
            const bytes = new TextEncoder().encode(text);
            const ofText = scanPositions(["ghp_", "npm_"], text);
            const ofBytes = scanPositions(["ghp_", "npm_"], bytes);
            assert.deepStrictEqual(ofBytes.flags, ofText.flags);
            assert.deepStrictEqual(
                ofBytes.positions.map(([keywords]) => keywords),
                ofText.positions.map(([keywords]) => keywords),
            );
            // indexes are bytes for bytes
            const decoder = new TextDecoder();
            ofBytes.positions.forEach(([keywords, index]) => {
                assert.strictEqual(decoder.decode(bytes.subarray(index - 3, index + 1)), keywords[0]);
            });
        });
        it("scans from the start index", () => {
            assert.deepStrictEqual(scanPositions(["ab"], "ab ab", 1).positions, [[["ab"], 4]]);
            assert.deepStrictEqual(scanPositions(["ab"], new TextEncoder().encode("ab ab"), 1).positions, [
                [["ab"], 4],
            ]);
        });
        it("resets the hits for each scan, and keeps many hits", () => {
            const matcher = createKeywordMatcher(["a", "b"]);
            const hits = matcher.createHits();
            assert.strictEqual(matcher.scan("a".repeat(1000), hits), true);
            assert.strictEqual(hits.count, 1000);
            assert.deepStrictEqual([...hits.found], [1, 0]);
            assert.strictEqual(matcher.scan("xxb", hits), true);
            assert.strictEqual(hits.count, 1);
            assert.deepStrictEqual([...hits.found], [0, 1]);
            assert.strictEqual(matcher.scan("xx", hits), false);
            assert.strictEqual(hits.count, 0);
        });
        it("finds nothing without keywords", () => {
            assert.deepStrictEqual(scanPositions([], "abc"), { found: false, positions: [], flags: [] });
        });
    });
});
