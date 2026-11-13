import { describe, it, expect } from "vitest";
import { createKeywordMatcher, type KeywordHits, type KeywordMatcher } from "../../src/helper/keyword-matcher.js";
import { createFilterTables } from "../../src/helper/keyword-scan-kernel.js";
import { recommendedRules } from "../../src/builtin/index.js";

/**
 * The hits as [index, keywords], so two matchers are compared by the keywords and not by the ids of the states
 */
const toHits = (matcher: KeywordMatcher, hits: KeywordHits): string[] => {
    const result: string[] = [];
    for (let i = 0; i < hits.positions.length; i += 2) {
        const keywords = matcher
            .keywordsOfState(hits.positions[i] as number)
            .map((index) => matcher.keywords[index])
            .sort();
        result.push(`${hits.positions[i + 1]}:${keywords.join("|")}`);
    }
    return result;
};
const expectSameHits = (keywords: string[], caseSensitive: boolean[], bytes: Uint8Array, start: number = 0) => {
    const withKernel = createKeywordMatcher(keywords, caseSensitive);
    const withLoop = createKeywordMatcher(keywords, caseSensitive, { useKernel: false });
    const kernelHits = withKernel.scan(bytes, start);
    const loopHits = withLoop.scan(bytes, start);
    expect(toHits(withKernel, kernelHits)).toEqual(toHits(withLoop, loopHits));
    expect(Array.from(kernelHits.found)).toEqual(Array.from(loopHits.found));
    return loopHits.count;
};
// a linear congruential generator, so the test is the same in each run
const createRandom = (seed: number) => {
    let state = seed;
    return (max: number): number => {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state % max;
    };
};
const encoder = new TextEncoder();

const recommendedKeywords = (): { keywords: string[]; caseSensitive: boolean[] } => {
    const keywords: string[] = [];
    const caseSensitive: boolean[] = [];
    for (const rule of recommendedRules) {
        for (const pattern of "patterns" in rule && Array.isArray(rule.patterns) ? rule.patterns : []) {
            for (const keyword of pattern.keywords ?? []) {
                keywords.push(keyword);
                caseSensitive.push(pattern.caseSensitiveKeywords === true);
            }
        }
    }
    return { keywords, caseSensitive };
};

describe("keyword scan kernel", () => {
    it("is available in the test environment", () => {
        // If this fails, the other tests compare the loop with the loop
        expect(typeof WebAssembly).toBe("object");
        expect(createFilterTables(["abc"]).masks.length).toBe(192);
    });
    it("finds the same hits as the loop for the keywords of the recommended rules", () => {
        const { keywords, caseSensitive } = recommendedKeywords();
        expect(keywords.length).toBeGreaterThan(30);
        const random = createRandom(20261114);
        const filler = [
            "const value = ",
            "https://example.com/path?q=1 ",
            "\n",
            "  // comment ",
            "0123456789abcdef",
            "é日本語 ",
        ];
        let total = 0;
        for (let round = 0; round < 200; round++) {
            let text = "";
            const parts = 20 + random(200);
            for (let i = 0; i < parts; i++) {
                const kind = random(10);
                if (kind < 6) {
                    text += filler[random(filler.length)];
                } else if (kind < 8) {
                    const keyword = keywords[random(keywords.length)] as string;
                    // The whole keyword, the keyword in uppercase, or a part of it
                    const variant = random(3);
                    text +=
                        variant === 0
                            ? keyword
                            : variant === 1
                              ? keyword.toUpperCase()
                              : keyword.slice(0, 1 + random(keyword.length));
                } else {
                    text += String.fromCharCode(32 + random(95));
                }
            }
            total += expectSameHits(keywords, caseSensitive, encoder.encode(text), random(4) === 0 ? random(8) : 0);
        }
        expect(total).toBeGreaterThan(1000);
    });
    it("finds the same hits for random keywords and random bytes", () => {
        const random = createRandom(7);
        const alphabet = "abAB_-./:0";
        const randomString = (length: number): string => {
            let value = "";
            for (let i = 0; i < length; i++) value += alphabet[random(alphabet.length)];
            return value;
        };
        for (let round = 0; round < 300; round++) {
            const keywords = Array.from({ length: 1 + random(40) }, () => randomString(1 + random(8)).toLowerCase());
            const caseSensitive = keywords.map(() => random(4) === 0);
            const bytes = new Uint8Array(256 + random(3000));
            const text = randomString(bytes.length);
            for (let i = 0; i < bytes.length; i++) {
                // Mostly the characters of the keywords, and some other bytes including non-ASCII ones
                bytes[i] = random(20) === 0 ? random(256) : text.charCodeAt(i);
            }
            expectSameHits(keywords, caseSensitive, bytes, random(3) === 0 ? random(40) : 0);
        }
    });
    it("finds a keyword at the beginning, at the end, and over the blocks of 16 bytes", () => {
        const keywords = ["secret_access", "npm_", "sg.", "x"];
        for (let length = 256; length < 256 + 40; length++) {
            for (const keyword of keywords) {
                for (const position of [
                    0,
                    1,
                    15,
                    16,
                    17,
                    31,
                    32,
                    length - keyword.length - 1,
                    length - keyword.length,
                ]) {
                    const bytes = new Uint8Array(length).fill(0x20);
                    bytes.set(encoder.encode(keyword), position);
                    expect(
                        expectSameHits(keywords, [], bytes),
                        `${keyword} at ${position} of ${length}`,
                    ).toBeGreaterThan(0);
                }
            }
        }
    });
    it("falls back to the loop for an input that has more hits than the kernel keeps", () => {
        const bytes = encoder.encode("npm_".repeat(10000));
        expect(expectSameHits(["npm_", "m_n"], [], bytes)).toBe(19999);
    });
});
