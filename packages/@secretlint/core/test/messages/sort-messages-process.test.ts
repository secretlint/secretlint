// LICENSE : MIT
import * as assert from "node:assert";
import { sortMessagesByLocation } from "../../src/messages/sort-messages-process.js";
import { createMessageFromRange } from "./create-messages-utils.js";

describe("sort-message", () => {
    describe("when empty array", function () {
        it("should return empty array", () => {
            assert.strictEqual(sortMessagesByLocation([]).length, 0);
        });
    });
    describe("when reverse line", function () {
        it("should sort by range", () => {
            const message = [createMessageFromRange({ range: [0, 1] }), createMessageFromRange({ range: [2, 3] })];
            const expected = [createMessageFromRange({ range: [0, 1] }), createMessageFromRange({ range: [2, 3] })];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    describe("when reverse column", function () {
        it("should sort by range", () => {
            const message = [createMessageFromRange({ range: [2, 3] }), createMessageFromRange({ range: [0, 1] })];
            const expected = [createMessageFromRange({ range: [0, 1] }), createMessageFromRange({ range: [2, 3] })];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    describe("when reverse both", function () {
        it("should sort by range", () => {
            const message = [
                createMessageFromRange({ range: [3, 4] }),
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [2, 3] }),
            ];
            const expected = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [2, 3] }),
                createMessageFromRange({ range: [3, 4] }),
            ];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    describe("when same start index", function () {
        it("should sort by end index", () => {
            const message = [
                createMessageFromRange({ range: [0, 4] }),
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 3] }),
            ];
            const expected = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 3] }),
                createMessageFromRange({ range: [0, 4] }),
            ];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
});
