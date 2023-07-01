import { createMessageFromRange } from "./create-messages-utils.js";
import { filterMaskSecretsData } from "../../src/messages/filter-mask-secrets.js";
import * as assert from "node:assert";

describe("filter-mask-secrets", function () {
    it("should not mask if data is not defined", () => {
        const message = createMessageFromRange({
            range: [0, 1],
        });
        const [filteredMessage] = filterMaskSecretsData([message]);
        assert.deepStrictEqual(filteredMessage, {
            range: [0, 1],
            ruleId: "example",
            severity: "error",
            type: "message",
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: "message",
            messageId: "message-id",
        });
    });
    it("mask all data", () => {
        const message = createMessageFromRange({
            message: "found SECRET_VALUE",
            range: [0, 1],
            data: {
                key: "SECRET_VALUE",
            },
        });
        const [filteredMessage] = filterMaskSecretsData([message]);
        assert.deepStrictEqual(filteredMessage, {
            range: [0, 1],
            ruleId: "example",
            severity: "error",
            type: "message",
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: "found ************",
            messageId: "message-id",
            data: { key: "************" },
        });
    });
    it("mask all data, but it will includes false-positive - just match", () => {
        const message = createMessageFromRange({
            // "This is testing code. id is ${id}"
            message: "This is testing code. id is test",
            range: [0, 1],
            data: {
                id: "test",
            },
        });
        const [filteredMessage] = filterMaskSecretsData([message]);
        assert.deepStrictEqual(filteredMessage, {
            range: [0, 1],
            ruleId: "example",
            severity: "error",
            type: "message",
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: "This is ****ing code. id is ****",
            //                ^^^^ This is false-positive
            messageId: "message-id",
            data: { id: "****" },
        });
    });

    it("mask deep values", () => {
        const message = createMessageFromRange({
            range: [0, 1],
            message: "found SECRET_VALUE",
            data: {
                key: "SECRET_VALUE",
                nest: [
                    "secret array item",
                    {
                        deep: "SECRET_VALUEs",
                    },
                ],
                n: 1,
            },
        });
        const [filteredMessage] = filterMaskSecretsData([message]);
        assert.deepStrictEqual(filteredMessage, {
            range: [0, 1],
            ruleId: "example",
            severity: "error",
            type: "message",
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: "found ************",
            messageId: "message-id",
            data: {
                key: "************",
                nest: [
                    "*****************",
                    {
                        deep: "*************",
                    },
                ],
                n: 1,
            },
        });
    });
});
