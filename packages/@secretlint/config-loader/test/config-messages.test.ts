import assert from "node:assert";
import { getConfigMessages } from "../src/config-messages.js";

describe("getConfigMessages", () => {
    it("should warn empty rules", () => {
        const messages = getConfigMessages({ rules: [] });
        assert.deepStrictEqual(
            messages.map((message) => [message.messageId, message.severity]),
            [["NO_RULES", "warning"]],
        );
    });
    it("should not report when rules are configured", () => {
        assert.deepStrictEqual(getConfigMessages({ rules: [{ id: "example" }] }), []);
    });
});
