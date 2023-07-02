import { parseComment } from "../src/parse-comment.js";
import * as assert from "node:assert";
import test from "node:test";

test("parseComment", async (t) => {
    await t.test("should return [] when no option ", () => {
        const results = parseComment("");
        assert.deepStrictEqual(results, []);
    });
    await t.test("should parse rule id: a ", () => {
        const results = parseComment("secretlint-rule-a");
        assert.deepStrictEqual(results, ["secretlint-rule-a"]);
    });
    await t.test("should parse rule ids: a,b,c ", () => {
        const results = parseComment(" a, b,c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
    await t.test("should ignore comment: -- ", () => {
        const results = parseComment(" -- comment ");
        assert.deepStrictEqual(results, []);
    });
    await t.test("should parse rule ids + comment : a,b,c -- comment", () => {
        const results = parseComment(" a,  b,   c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
    await t.test("should parse markdown comment : a,b,c -->", () => {
        const results = parseComment("a, b,   c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
});
