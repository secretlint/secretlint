import { createMessageFromRange } from "./create-messages-utils";
import { filterMaskSecretsData } from "../../src/messages/filter-mask-secrets";
import * as assert from "assert";

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
            messageId: "message",
        });
    });
    it("mask all data", () => {
        const message = createMessageFromRange({
            range: [0, 1],
            data: {
                key: "secret value",
            },
        });
        const [filteredMessage] = filterMaskSecretsData([message]);
        assert.deepStrictEqual(filteredMessage, {
            range: [0, 1],
            ruleId: "example",
            severity: "error",
            type: "message",
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: "message",
            messageId: "message",
            data: { key: "***********" },
        });
    });
    it("mask deep value", () => {
        const message = createMessageFromRange({
            range: [0, 1],
            data: {
                key: "secret value",
                nest: [
                    "secret array item",
                    {
                        deep: "secret values",
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
            message: "message",
            messageId: "message",
            data: {
                key: "***********",
                nest: [
                    "****************",
                    {
                        deep: "************",
                    },
                ],
                n: 1,
            },
        });
    });
});
