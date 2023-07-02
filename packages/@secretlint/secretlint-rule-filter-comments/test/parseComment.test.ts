import { parseComment } from "../src/parse-comment.js";
import * as assert from "node:assert";

describe("parseComment", function () {
    it("should return [] when no option ", () => {
        const results = parseComment("");
        assert.deepStrictEqual(results, []);
    });
    it("should parse rule id: a ", () => {
        const results = parseComment("secretlint-rule-a");
        assert.deepStrictEqual(results, ["secretlint-rule-a"]);
    });
    it("should parse rule ids: a,b,c ", () => {
        const results = parseComment(" a, b,c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
    it("should ignore comment: -- ", () => {
        const results = parseComment(" -- comment ");
        assert.deepStrictEqual(results, []);
    });
    it("should parse rule ids + comment : a,b,c -- comment", () => {
        const results = parseComment(" a,  b,   c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
    it("should parse markdown comment : a,b,c -->", () => {
        const results = parseComment("a, b,   c ");
        assert.deepStrictEqual(results, ["a", "b", "c"]);
    });
});
