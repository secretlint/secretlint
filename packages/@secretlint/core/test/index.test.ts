import assert from "node:assert";
import { lintSource } from "../src/index.js";
import { SecretLintRawSource, SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
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
    it("should getPhysicalFilePath() return source.filePath if noPhysicFilePath is undefined | false", async () => {
        const source: SecretLintRawSource = {
            content: "THIS IS SECRET SOURCE",
            filePath: "/path/to/secret",
            contentType: "text",
        };
        let getFilePathResult: string | undefined = undefined;
        let getPhhyicFilePathResult: string | undefined = undefined;
        const creator: SecretLintRuleCreator = {
            messages: {},
            meta: {
                id: "@secretlint/secretlint-rule-example",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
            },
            create() {
                return {
                    file(source: SecretLintSourceCode) {
                        getFilePathResult = source.getFilePath();
                        getPhhyicFilePathResult = source.getPhysicalFilePath();
                    },
                };
            },
        };
        // run lint
        await lintSource({
            source: source,
            options: {
                locale: "en",
                config: {
                    rules: [
                        {
                            id: "example",
                            rule: creator,
                            options: {},
                        },
                    ],
                },
            },
        });
        // get result
        assert.strictEqual(getFilePathResult, source.filePath);
        assert.strictEqual(getPhhyicFilePathResult, source.filePath);
    });
    it("should getPhysicalFilePath() return undefined if noPhysicFilePath is true", async () => {
        const source: SecretLintRawSource = {
            content: "THIS IS SECRET SOURCE",
            filePath: "/path/to/secret",
            contentType: "text",
        };
        let getFilePathResult: string | undefined = undefined;
        let getPhhyicFilePathResult: string | undefined = undefined;
        const creator: SecretLintRuleCreator = {
            messages: {},
            meta: {
                id: "@secretlint/secretlint-rule-example",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
            },
            create() {
                return {
                    file(source: SecretLintSourceCode) {
                        getFilePathResult = source.getFilePath();
                        getPhhyicFilePathResult = source.getPhysicalFilePath();
                    },
                };
            },
        };
        // run lint
        await lintSource({
            source: source,
            options: {
                locale: "en",
                config: {
                    rules: [
                        {
                            id: "example",
                            rule: creator,
                            options: {},
                        },
                    ],
                },
                noPhysicFilePath: true, // this source is not physical file
            },
        });
        // get result
        assert.strictEqual(getFilePathResult, source.filePath);
        assert.strictEqual(getPhhyicFilePathResult, undefined);
    });
});
