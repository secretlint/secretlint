import assert from "assert";
import { lintSource } from "../src";
import { SecretLintRawSource } from "@secretlint/types";
import example from "./fixtures/secretlint-rule-example";

describe("lintSource", function() {
    it("should lint source with rules", async () => {
        const source: SecretLintRawSource = {
            content: "THIS IS SECRET SOURCE",
            filePath: "/path/to/secret",
            contentType: "text"
        };
        const result = await lintSource(source, {
            rules: [
                {
                    id: "example",
                    rule: example,
                    options: {}
                }
            ]
        });
        assert.strictEqual(result.filePath, source.filePath);
        assert.deepStrictEqual(result.messages, [
            {
                data: {
                    ID: "SECRET"
                },
                message: "found secret: SECRET",
                messageId: "EXAMPLE_MESSAGE",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                },
                ruleId: "example",
                severity: "error"
            }
        ]);
    });
});
