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
        // keywords may contain "\n"
        assert.deepStrictEqual(getKeywordMatcher(["a\nb"]).keywords, ["a\nb"]);
        assert.deepStrictEqual(getKeywordMatcher(["a", "b"]).match("a"), Uint8Array.from([1, 0]));
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
            const hits = matcher.scan(input, start);
            const found = hits.count > 0;
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
        it("returns new hits for each scan, and keeps many hits", () => {
            const matcher = createKeywordMatcher(["a", "b"]);
            const many = matcher.scan("a".repeat(1000));
            const one = matcher.scan("xxb");
            const none = matcher.scan("xx");
            // the next scan does not change the hits of the previous scan
            assert.strictEqual(many.count, 1000);
            assert.strictEqual(many.positions.length, 2000);
            assert.strictEqual(many.positions[1999], 999);
            assert.deepStrictEqual([...many.found], [1, 0]);
            assert.strictEqual(one.count, 1);
            assert.deepStrictEqual([...one.positions], [...matcher.scan("xxb").positions]);
            assert.deepStrictEqual([...one.found], [0, 1]);
            assert.strictEqual(none.count, 0);
            assert.deepStrictEqual([...none.found], [0, 0]);
        });
        it("finds nothing without keywords", () => {
            assert.deepStrictEqual(scanPositions([], "abc"), { found: false, positions: [], flags: [] });
        });
    });
    describe("case-sensitive keywords", () => {
        const scanKeywords = (keywords: string[], caseSensitive: boolean[], input: string | Uint8Array) => {
            const matcher = createKeywordMatcher(keywords, caseSensitive);
            const hits = matcher.scan(input);
            const found = hits.count > 0;
            const positions: [string[], number][] = [];
            for (let i = 0; i < hits.count; i++) {
                positions.push([
                    matcher.keywordsOfState(hits.positions[i * 2] as number).map((index) => keywords[index] as string),
                    hits.positions[i * 2 + 1] as number,
                ]);
            }
            return { found, positions, flags: [...hits.found] };
        };
        const forTextAndBytes = (text: string, test: (input: string | Uint8Array) => void) => {
            test(text);
            test(new TextEncoder().encode(text));
        };
        it("finds a case-sensitive keyword only in the same case", () => {
            forTextAndBytes("msg.x sg.y SG.z Sg.", (input) => {
                assert.deepStrictEqual(scanKeywords(["SG."], [true], input), {
                    found: true,
                    positions: [[["SG."], 13]],
                    flags: [1],
                });
            });
            forTextAndBytes("msg.x sg.y", (input) => {
                assert.deepStrictEqual(scanKeywords(["SG."], [true], input), {
                    found: false,
                    positions: [],
                    flags: [0],
                });
            });
        });
        it("finds case-insensitive keywords as before", () => {
            forTextAndBytes("AKIA akia GHP_ ghp_", (input) => {
                assert.deepStrictEqual(scanKeywords(["AKIA", "ghp_"], [true, false], input), {
                    found: true,
                    positions: [
                        [["AKIA"], 3],
                        [["ghp_"], 13],
                        [["ghp_"], 18],
                    ],
                    flags: [1, 1],
                });
            });
        });
        it("keeps the other keywords that end at the same index", () => {
            // "abc" (case-sensitive), "ABC" (case-sensitive), "bc" (case-insensitive) end at the same index
            const keywords = ["abc", "ABC", "bc"];
            const caseSensitive = [true, true, false];
            forTextAndBytes("abc ABC aBc Abc", (input) => {
                assert.deepStrictEqual(scanKeywords(keywords, caseSensitive, input).positions, [
                    [["abc", "bc"], 2],
                    [["ABC", "bc"], 6],
                    [["bc"], 10],
                    [["bc"], 14],
                ]);
            });
        });
        it("returns new hits for each scan", () => {
            const matcher = createKeywordMatcher(["SG."], [true]);
            const sameCase = matcher.scan("SG. SG.");
            const differentCase = matcher.scan("sg. sg.");
            assert.strictEqual(sameCase.count, 2);
            assert.deepStrictEqual([...sameCase.found], [1]);
            assert.strictEqual(differentCase.count, 0);
            assert.deepStrictEqual([...differentCase.found], [0]);
        });
        it("caches the matcher by the keywords and their case-sensitivity", () => {
            assert.strictEqual(getKeywordMatcher(["x"], [true]), getKeywordMatcher(["x"], [true]));
            assert.notStrictEqual(getKeywordMatcher(["x"], [true]), getKeywordMatcher(["x"]));
            assert.strictEqual(getKeywordMatcher(["x"], [false]), getKeywordMatcher(["x"]));
        });
        it("matches the same as String#includes on random texts", () => {
            const alphabet = "abAB_.";
            const random = (length: number) =>
                Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
            for (let i = 0; i < 300; i++) {
                const keywords = Array.from(new Set(Array.from({ length: 5 }, () => random(1 + (i % 4)))));
                const caseSensitive = keywords.map(() => Math.random() < 0.5);
                const normalized = keywords.map((keyword, index) =>
                    caseSensitive[index] ? keyword : keyword.toLowerCase(),
                );
                const text = random(Math.floor(Math.random() * 40));
                const expected = normalized.map((keyword, index) =>
                    (caseSensitive[index] ? text.includes(keyword) : text.toLowerCase().includes(keyword)) ? 1 : 0,
                );
                forTextAndBytes(text, (input) => {
                    assert.deepStrictEqual(
                        scanKeywords(normalized, caseSensitive, input).flags,
                        expected,
                        JSON.stringify({ normalized, caseSensitive, text }),
                    );
                });
            }
        });
    });
});
