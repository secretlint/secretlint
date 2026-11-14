import assert from "node:assert";
import { parseKeywordGuard, parseKeywordObject } from "../../src/helper/keyword-guard.js";

describe("keyword-guard", () => {
    describe("parseKeywordGuard", () => {
        it("parses a set and a least count", () => {
            assert.deepStrictEqual(parseKeywordGuard("[a-c]{40,}"), { chars: "abc", min: 40 });
            assert.deepStrictEqual(parseKeywordGuard("[0-9a-f]{1,}"), { chars: "0123456789abcdef", min: 1 });
            assert.deepStrictEqual(parseKeywordGuard("[x]{255,}"), { chars: "x", min: 255 });
        });
        it("sorts the characters, so the order of the items does not matter", () => {
            assert.deepStrictEqual(parseKeywordGuard("[a-c0-2_-]{4,}"), parseKeywordGuard("[_0-2a-c-]{4,}"));
            assert.strictEqual(parseKeywordGuard("[a-c0-2_-]{4,}").chars, "-012_abc");
        });
        it("reads `-` as a character only as the last item", () => {
            assert.strictEqual(parseKeywordGuard("[-]{1,}").chars, "-");
            assert.strictEqual(parseKeywordGuard("[a-]{1,}").chars, "-a");
            assert.strictEqual(parseKeywordGuard("[a-c-]{1,}").chars, "-abc");
            assert.throws(() => parseKeywordGuard("[-a]{1,}"), /last item/);
            assert.throws(() => parseKeywordGuard("[a-c-e]{1,}"), /last item/);
            assert.throws(() => parseKeywordGuard("[a\\-c]{1,}"), /Write `-` as the last item/);
        });
        it("reads `\\` only before `\\` and `]`", () => {
            assert.strictEqual(parseKeywordGuard("[\\\\]{1,}").chars, "\\");
            assert.strictEqual(parseKeywordGuard("[\\]]{1,}").chars, "]");
            assert.strictEqual(parseKeywordGuard("[a\\]\\\\[.+*]{1,}").chars, "*+.[\\]a");
            assert.throws(() => parseKeywordGuard("[\\.]{1,}"), /only before/);
            assert.throws(() => parseKeywordGuard("[\\n]{1,}"), /only before/);
            assert.throws(() => parseKeywordGuard("[\\d]{1,}"), /Write `0-9`/);
            assert.throws(() => parseKeywordGuard("[\\w]{1,}"), /Write `A-Za-z0-9_`/);
        });
        it("throws on a set that is not supported", () => {
            assert.throws(() => parseKeywordGuard("abc{4,}"), /should start with a set/);
            assert.throws(() => parseKeywordGuard("\\w{4,}"), /should start with a set/);
            assert.throws(() => parseKeywordGuard("[^a-z]{4,}"), /`\^` is not supported/);
            assert.throws(() => parseKeywordGuard("[]{4,}"), /empty/);
            assert.throws(() => parseKeywordGuard("[a-z{4,}"), /no `\]`/);
            assert.throws(() => parseKeywordGuard("[z-a]{4,}"), /not in order/);
            assert.throws(() => parseKeywordGuard("[a-a]{4,}"), /not in order/);
            assert.throws(() => parseKeywordGuard("[aa]{4,}"), /twice/);
            assert.throws(() => parseKeywordGuard("[a-zc]{4,}"), /twice/);
            assert.throws(() => parseKeywordGuard("[é]{4,}"), /only ASCII/);
        });
        it("throws on a count that is not `{n,}`, with the supported form", () => {
            assert.throws(() => parseKeywordGuard("[a-z]"), /followed by a count/);
            assert.throws(() => parseKeywordGuard("[a-z]{40}"), /Write `\{40,\}`/);
            assert.throws(() => parseKeywordGuard("[a-z]{32,40}"), /Write `\{32,\}`/);
            assert.throws(() => parseKeywordGuard("[a-z]+"), /Write `\[\.\.\.\]\{1,\}`/);
            assert.throws(() => parseKeywordGuard("[a-z]*"), /always true/);
            assert.throws(() => parseKeywordGuard("[a-z]?"), /always true/);
            assert.throws(() => parseKeywordGuard("[a-z]{0,}"), /always true/);
            assert.throws(() => parseKeywordGuard("[a-z]{0}"), /always true/);
            assert.throws(() => parseKeywordGuard("[a-z]{256,}"), /255 or less/);
            assert.throws(() => parseKeywordGuard("[a-z]{04,}"), /is not supported/);
            assert.throws(() => parseKeywordGuard("[a-z]{4, }"), /is not supported/);
            assert.throws(() => parseKeywordGuard("[a-z]{4,}[0-9]{2,}"), /is not supported/);
            assert.throws(() => parseKeywordGuard("[a-z]{4,}$"), /is not supported/);
            assert.throws(() => parseKeywordGuard("[a-z]{4,}?"), /is not supported/);
        });
    });
    describe("parseKeywordObject", () => {
        it("reads a keyword and its guard", () => {
            assert.deepStrictEqual(parseKeywordObject({ keyword: "SK", after: "[0-9a-f]{32,}" }), {
                keyword: "SK",
                after: "[0-9a-f]{32,}",
                guard: { chars: "0123456789abcdef", min: 32 },
            });
        });
        it("throws on an object that is not a keyword with a guard", () => {
            assert.throws(() => parseKeywordObject({ keyword: "SK" }), /`after` is required.*the string "SK"/s);
            assert.throws(() => parseKeywordObject({ after: "[a-z]{4,}" }), /`keyword` should be/);
            assert.throws(() => parseKeywordObject({ keyword: "キー", after: "[a-z]{4,}" }), /`keyword` should be/);
            assert.throws(
                () => parseKeywordObject({ keyword: "SK", after: ["[a-z]{4,}"] }),
                /`after` should be a string/,
            );
            assert.throws(
                () => parseKeywordObject({ keyword: "SK", after: "[a-z]{4,}", before: "[^a-z]" }),
                /unknown properties: before/,
            );
            assert.throws(() => parseKeywordObject(["SK"]), /unknown properties: 0/);
        });
    });
});
