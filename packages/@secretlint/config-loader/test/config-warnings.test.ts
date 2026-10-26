import assert from "node:assert";
import { getConfigWarnings } from "../src/config-warnings.js";

describe("getConfigWarnings", () => {
    it("should warn empty rules", () => {
        const warnings = getConfigWarnings({ rules: [] });
        assert.deepStrictEqual(
            warnings.map((warning) => warning.messageId),
            ["NO_RULES"],
        );
    });
    it("should not warn when rules are configured", () => {
        assert.deepStrictEqual(getConfigWarnings({ rules: [{ id: "example" }] }), []);
    });
});
