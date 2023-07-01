import assert from "node:assert";
import { lintSource } from "../src/index.js";
import { SecretLintRawSource } from "@secretlint/types";
import { creator as example } from "./fixtures/secretlint-rule-example.js";
import { assertJsonEqual } from "assert-json-equal";

describe("lintSource", function () {
    it("should lint source with rules", async () => {
        const source: SecretLintRawSource = {
            content: "THIS IS SECRET SOURCE",
            filePath: "/path/to/secret",
            contentType: "text",
        };
        const result = await lintSource({
            source: source,
            options: {
                locale: "en",
                config: {
                    rules: [
                        {
                            id: "example",
                            rule: example,
                            options: {},
                        },
                    ],
                },
            },
        });
        assert.strictEqual(result.filePath, source.filePath);
        assertJsonEqual(result.messages, [
            {
                data: {
                    ID: "SECRET",
                },
                type: "message",
                message: "found secret: SECRET",
                messageId: "EXAMPLE_MESSAGE",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8,
                    },
                    end: {
                        line: 1,
                        column: 14,
                    },
                },
                ruleId: "example",
                severity: "error",
            },
        ]);
    });
});
