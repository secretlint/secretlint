import { parseComment } from "../src/parse-comment";
import * as assert from "assert";

describe("parseComment", function () {
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
