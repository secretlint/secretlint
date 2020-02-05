import assert from "assert";
import { lintSource } from "../src";
import { SecretLintSource } from "@secretlint/types";
import example from "./fixtures/rules/secretlint-rule-example";

describe('lintSource', function () {
    it("should lint source with rules", async () => {
        const source: SecretLintSource = {
            content: "THIS IS SECRET SOURCE",
            filePath: "/path/to/secret"
        };
        const result = await lintSource(source, {
            rules: [{
                id: "example",
                rule: example,
                options: {}
            }]
        });
        assert.strictEqual(result.filePath, source.filePath);
        assert.deepStrictEqual(result.messages, [
            {
                message: 'found secret: {{ID}}',
                data: {
                    ID: "SECRET"
                },
                range: [8, 14]
            }
        ]);
    });
});
