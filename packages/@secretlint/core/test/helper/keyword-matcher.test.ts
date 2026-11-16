import assert from "node:assert";
import { createKeywordMatcher, getKeywordMatcher, normalizeKeyword } from "../../src/helper/keyword-matcher.js";
import { parseKeywordGuard } from "../../src/helper/keyword-guard.js";

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
    describe("keywords with a guard", () => {
        const scanKeywords = (
            keywords: string[],
            afters: (string | undefined)[],
            input: string | Uint8Array,
            start?: number,
        ) => {
            const guards = afters.map((after) => (after === undefined ? undefined : parseKeywordGuard(after)));
            const matcher = createKeywordMatcher(keywords, guards);
            const hits = matcher.scan(input, start);
            const positions: [number[], number][] = [];
            for (let i = 0; i < hits.count; i++) {
                positions.push([
                    [...matcher.keywordsOfState(hits.positions[i * 2] as number)],
                    hits.positions[i * 2 + 1] as number,
                ]);
            }
            return { positions, flags: [...hits.found] };
        };
        const forTextAndBytes = (text: string, test: (input: string | Uint8Array) => void) => {
            test(text);
            test(new TextEncoder().encode(text));
        };
        it("records a keyword only where its guard is met", () => {
            forTextAndBytes("100 00:00 00abcd 00ab", (input) => {
                assert.deepStrictEqual(scanKeywords(["00"], ["[a-z]{4,}"], input), {
                    positions: [[[0], 11]],
                    flags: [1],
                });
            });
            forTextAndBytes("100 00:00 00ab", (input) => {
                assert.deepStrictEqual(scanKeywords(["00"], ["[a-z]{4,}"], input), { positions: [], flags: [0] });
            });
        });
        it("is met by a run that is longer than the count, and not by the end of the input", () => {
            forTextAndBytes("00abcdefgh", (input) => {
                assert.deepStrictEqual(scanKeywords(["00"], ["[a-z]{4,}"], input).flags, [1]);
            });
            forTextAndBytes("00abc", (input) => {
                assert.deepStrictEqual(scanKeywords(["00"], ["[a-z]{4,}"], input).flags, [0]);
            });
        });
        it("finds the keyword case-insensitively and compares the set as it is written", () => {
            forTextAndBytes("asia-northeast1 ASIAwxyz asiaWXYZ", (input) => {
                assert.deepStrictEqual(scanKeywords(["asia"], ["[A-Z0-9]{4,}"], input).positions, [[[0], 28]]);
            });
        });
        it("is not met by a character that is not ASCII, in a string and in bytes", () => {
            // U+212A (Kelvin sign) and "é" are not in a set of ASCII characters
            forTextAndBytes("00abKcd 00abécd 00abcd", (input) => {
                const result = scanKeywords(["00"], ["[a-zA-Z]{4,}"], input);
                assert.strictEqual(result.positions.length, 1);
                assert.deepStrictEqual(result.flags, [1]);
            });
        });
        it("keeps a keyword without a guard, and the keywords that overlap", () => {
            // "00" with a guard, "00" without a guard, and "x00" end at the same index
            const keywords = ["00", "00", "x00", "0a"];
            const afters = ["[a-z]{2,}", undefined, undefined, undefined];
            forTextAndBytes("x00ab 00.", (input) => {
                assert.deepStrictEqual(scanKeywords(keywords, afters, input).positions, [
                    [[2, 0, 1], 2],
                    [[3], 3],
                    [[1], 7],
                ]);
            });
        });
        it("selects each entry of the same keyword by its own guard", () => {
            const keywords = ["00", "00"];
            const afters = ["[a-z]{4,}", "[0-9]{4,}"];
            forTextAndBytes("00abcd 001234 00ab12", (input) => {
                assert.deepStrictEqual(scanKeywords(keywords, afters, input), {
                    positions: [
                        [[0], 1],
                        [[1], 8],
                    ],
                    flags: [1, 1],
                });
            });
        });
        it("goes on from the same place after a check", () => {
            // the guard reads "0000" after the first "00", and the scan still finds the keywords in it
            forTextAndBytes("000000", (input) => {
                assert.deepStrictEqual(
                    scanKeywords(["00"], ["[0-9]{2,}"], input).positions.map(([, index]) => index),
                    [1, 2, 3],
                );
            });
        });
        it("counts the places of a guarded keyword only when it is asked", () => {
            const guards = [parseKeywordGuard("[a-z]{4,}"), undefined, parseKeywordGuard("[a-z]{4,}")];
            const counting = createKeywordMatcher(["00", "tok_", "zz"], guards, { countGuards: true });
            counting.scan("00abcd 00 00 tok_");
            counting.scan(new TextEncoder().encode("00abcd 00"));
            // "zz" is not found, so it is not in the result
            assert.deepStrictEqual(counting.takeGuardCounts(), [{ keywordIndex: 0, found: 5, met: 2 }]);
            // the counts start again after they are taken
            assert.deepStrictEqual(counting.takeGuardCounts(), []);
            const matcher = createKeywordMatcher(["00", "tok_", "zz"], guards);
            matcher.scan("00abcd 00 00 tok_");
            assert.deepStrictEqual(matcher.takeGuardCounts(), []);
        });
        it("caches the matcher by the keywords and their guards", () => {
            const guard = parseKeywordGuard("[a-z0-9]{4,}");
            assert.strictEqual(
                getKeywordMatcher(["x"], [guard]),
                getKeywordMatcher(["x"], [parseKeywordGuard("[0-9a-z]{4,}")]),
            );
            assert.notStrictEqual(getKeywordMatcher(["x"], [guard]), getKeywordMatcher(["x"]));
            assert.strictEqual(getKeywordMatcher(["x"], [undefined]), getKeywordMatcher(["x"]));
        });
        it("matches the same as a regular expression on random texts", () => {
            const alphabet = "abAB01_.é";
            const random = (length: number) =>
                Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
            const sets = ["[a-b]", "[A-Ba-b]", "[0-1_]", "[a-bA-B0-1_.]"];
            const escape = (text: string) => text.replace(/[.\\[\]]/g, "\\$&");
            for (let i = 0; i < 300; i++) {
                const keywords = Array.from(new Set(Array.from({ length: 4 }, () => random(1 + (i % 3)))))
                    .filter((keyword) => !keyword.includes("é"))
                    .map((keyword) => keyword.toLowerCase());
                const afters = keywords.map(() => {
                    return Math.random() < 0.3
                        ? undefined
                        : `${sets[Math.floor(Math.random() * sets.length)]}{${1 + Math.floor(Math.random() * 3)},}`;
                });
                const text = random(Math.floor(Math.random() * 40));
                const expected = keywords.map((keyword, index) => {
                    const after = afters[index];
                    const source = `${escape(keyword)}${after === undefined ? "" : `(?=${after.replace(/\{(\d+),\}/, "{$1}")})`}`;
                    // the keyword is case-insensitive, and the set is not
                    const keywordSource = source.replace(/[a-z]/g, (char, offset: number) => {
                        return offset < escape(keyword).length ? `[${char}${char.toUpperCase()}]` : char;
                    });
                    return new RegExp(keywordSource).test(text) ? 1 : 0;
                });
                forTextAndBytes(text, (input) => {
                    assert.deepStrictEqual(
                        scanKeywords(keywords, afters, input).flags,
                        expected,
                        JSON.stringify({ keywords, afters, text }),
                    );
                });
            }
        });
    });
});
