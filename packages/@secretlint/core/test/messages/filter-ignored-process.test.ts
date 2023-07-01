// LICENSE : MIT
import { filterIgnoredMessages } from "../../src/messages/filter-ignored-process.js";
import * as assert from "node:assert";
import { createIgnoredMessageFromRange, createMessageFromRange } from "./create-messages-utils.js";

describe("message-filter", function () {
    context("when pass empty messages", function () {
        it("should return empty messages", function () {
            assert.equal(
                filterIgnoredMessages({
                    ignoredMessages: [],
                    reportedMessages: [],
                }).length,
                0
            );
        });
    });
    context("when only lint messages", function () {
        it("should not change messages", function () {
            const messages = [createMessageFromRange({ range: [0, 1] })];
            const actual = {
                reportedMessages: messages,
                ignoredMessages: [],
            };
            assert.deepStrictEqual(filterIgnoredMessages(actual), messages);
        });
    });
    context("when contain ignore messages", function () {
        it("should not filtered, if index < ignore's range start ", function () {
            const reportedMessages = [createMessageFromRange({ range: [10, 15] })];
            const ignoredMessaged = [createIgnoredMessageFromRange([0, 1])];
            assert.equal(
                filterIgnoredMessages({
                    reportedMessages: reportedMessages,
                    ignoredMessages: ignoredMessaged,
                }).length,
                1
            );
        });
        it("should filtered, if start <= index <= end ", function () {
            const reportedMessages = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [1, 2] }),
                createMessageFromRange({ range: [2, 3] }),
                createMessageFromRange({ range: [3, 4] }),
            ];
            const ignoredMessages = [createIgnoredMessageFromRange([0, 2])];
            assert.deepStrictEqual(
                filterIgnoredMessages({
                    reportedMessages,
                    ignoredMessages,
                }),
                [createMessageFromRange({ range: [2, 3] }), createMessageFromRange({ range: [3, 4] })]
            );
        });
        it("should remove ignore message it-self", function () {
            const reportedMessages = [
                createMessageFromRange({ range: [0, 1] }),
                createMessageFromRange({ range: [1, 100] }),
            ];
            const ignoredMessages = [createIgnoredMessageFromRange([0, 100])];
            assert.deepStrictEqual(
                filterIgnoredMessages({
                    reportedMessages,
                    ignoredMessages,
                }),
                []
            );
        });
    });
    context("when the message has targetRuleId", function () {
        it("should only filter messages that are matched the ruleId", function () {
            const reportedMessages = [
                createMessageFromRange({ range: [1, 10], ruleId: "a" }),
                createMessageFromRange({ range: [1, 10], ruleId: "b" }),
                createMessageFromRange({ range: [1, 10], ruleId: "c" }),
            ];
            const ignoredMessages = [
                createIgnoredMessageFromRange([0, 10], "a"),
                createIgnoredMessageFromRange([0, 10], "b"),
            ];
            assert.deepStrictEqual(
                filterIgnoredMessages({
                    reportedMessages,
                    ignoredMessages,
                }),
                [createMessageFromRange({ range: [1, 10], ruleId: "c" })]
            );
        });
    });
});
