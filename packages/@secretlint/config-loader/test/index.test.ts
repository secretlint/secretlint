import path from "path";
import assert from "assert";
import { loadConfig } from "../src";
import { moduleInterop } from "@textlint/module-interop";

describe("@secretlint/config-loader", function() {
    it("should load .secretlintrc.json", () => {
        const config = loadConfig({
            cwd: path.join(__dirname, "fixtures/valid-config")
        });
        assert.deepStrictEqual(config, {
            ok: true,
            config: {
                rules: [
                    {
                        id: "example",
                        rule: moduleInterop(require("@secretlint/secretlint-rule-example"))
                    },
                    {
                        id: "example-2",
                        rule: moduleInterop(require("@secretlint/secretlint-rule-example")),
                        disabled: true
                    }
                ]
            },
            configFilePath: path.join(__dirname, "fixtures/valid-config/.secretlintrc.json")
        });
    });
    it("should return errors if rule module is not found in .secretlintrc.json", () => {
        const config = loadConfig({
            cwd: path.join(__dirname, "fixtures/missing-rule-config")
        });
        assert.strictEqual(config.ok, false);
        if (!config.ok) {
            assert.strictEqual(config.errors.length, 1);
        }
    });
});
