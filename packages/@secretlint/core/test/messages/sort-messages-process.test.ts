// LICENSE : MIT
"use strict";
import * as assert from "assert";
import { sortMessagesByLocation } from "../../src/messages/sort-messages-process";
import { createMessageFromRange } from "./create-messages-utils";

describe("sort-message", function() {
    context("when empty array", function() {
        it("should return empty array", function() {
            assert.strictEqual(sortMessagesByLocation([]).length, 0);
        });
    });
    context("when reverse line", function() {
        it("should sort by range", function() {
            const message = [createMessageFromRange([0, 1]), createMessageFromRange([2, 3])];
            const expected = [createMessageFromRange([0, 1]), createMessageFromRange([2, 3])];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    context("when reverse column", function() {
        it("should sort by range", function() {
            const message = [createMessageFromRange([2, 3]), createMessageFromRange([0, 1])];
            const expected = [createMessageFromRange([0, 1]), createMessageFromRange([2, 3])];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    context("when reverse both", function() {
        it("should sort by range", function() {
            const message = [
                createMessageFromRange([3, 4]),
                createMessageFromRange([0, 1]),
                createMessageFromRange([2, 3])
            ];
            const expected = [
                createMessageFromRange([0, 1]),
                createMessageFromRange([2, 3]),
                createMessageFromRange([3, 4])
            ];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
    context("when same start index", function() {
        it("should sort by end index", function() {
            const message = [
                createMessageFromRange([0, 4]),
                createMessageFromRange([0, 1]),
                createMessageFromRange([0, 3])
            ];
            const expected = [
                createMessageFromRange([0, 1]),
                createMessageFromRange([0, 3]),
                createMessageFromRange([0, 4])
            ];
            assert.deepStrictEqual(sortMessagesByLocation(message), expected);
        });
    });
});
