// LICENSE : MIT
"use strict";
import { filterDuplicatedMessages } from "../../src/messages/filter-duplicated-process";
import * as assert from "assert";
import { createMessageFromRange } from "./create-messages-utils";

describe("message-filter", function () {
    context("when pass empty messages", function () {
        it("should return empty messages", function () {
            assert.equal(filterDuplicatedMessages([]).length, 0);
        });
    });
    context("when only lint messages", function () {
        it("should not change messages", function () {
            const messages = [createMessageFromRange({ range: [0, 1] })];
            assert.deepStrictEqual(filterDuplicatedMessages(messages), messages);
        });
    });
    context("when contain duplicated messages", function () {
        it("should filter to be one", function () {
            const messages = [createMessageFromRange({ range: [0, 1] }), createMessageFromRange({ range: [0, 1] })];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 1);
        });
        it("should filter 3 -> 1", function () {
            const messages = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [0, 1] }),
            ];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 1);
        });
    });
    context("when duplicated message, but ruleId is difference", function () {
        it("should filter messages", function () {
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
    context("when duplicated ruleId, but message is difference", function () {
        it("should not filter messages", function () {
            const messages = [
                createMessageFromRange({ range: [0, 1], ruleId: "a", message: "message a" }),
                createMessageFromRange({ range: [0, 1], ruleId: "a", message: "message b" }),
            ];
            assert.strictEqual(filterDuplicatedMessages(messages).length, 2);
        });
    });
});
