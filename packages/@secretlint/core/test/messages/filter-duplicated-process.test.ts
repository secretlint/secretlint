// LICENSE : MIT
import { filterDuplicatedMessages } from "../../src/messages/filter-duplicated-process.js";
import * as assert from "node:assert";
import { createMessageFromRange } from "./create-messages-utils.js";

describe("message-filter", () => {
    describe("when pass empty messages", function () {
        it("should return empty messages", () => {
            assert.equal(filterDuplicatedMessages([]).length, 0);
        });
    });
    describe("when only lint messages", function () {
        it("should not change messages", () => {
            const messages = [createMessageFromRange({ range: [0, 1] })];
            assert.deepStrictEqual(filterDuplicatedMessages(messages), messages);
        });
    });
    describe("when contain duplicated messages", function () {
        it("should filter to be one", () => {
            const messages = [createMessageFromRange({ range: [0, 1] }), createMessageFromRange({ range: [0, 1] })];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 1);
        });
        it("should filter 3 -> 1", () => {
            const messages = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 1] }),
            ];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 1);
        });
    });
    describe("when duplicated message, but ruleId is difference", function () {
        it("should filter messages", () => {
            const messages = [
                createMessageFromRange({
                    range: [0, 1],
                    ruleId: "a",
                }),
                createMessageFromRange({ range: [0, 1], ruleId: "b" }),
            ];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 1);
        });
    });
    describe("when duplicated ruleId, but message is difference", function () {
        it("should not filter messages", () => {
            const messages = [
                createMessageFromRange({ range: [0, 1], ruleId: "a", message: "message a" }),
                createMessageFromRange({ range: [0, 1], ruleId: "a", message: "message b" }),
            ];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 2);
        });
    });
});
