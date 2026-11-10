import assert from "node:assert";
import { lintSource } from "../src/index.js";
import { SecretLintRawSource, SecretLintRuleCreator, SecretLintSourceCode } from "@secretlint/types";
import { creator as example } from "./fixtures/secretlint-rule-example.js";
import { assertJsonEqual } from "assert-json-equal";

describe("lintSource", () => {
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

describe("lintSource with meta.keywords", () => {
    const createRule = (keywords: string[] | undefined, calls: string[]): SecretLintRuleCreator => {
        const id = `keyword-rule-${JSON.stringify(keywords)}`;
        return {
            messages: {},
            meta: {
                id,
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
                keywords,
            },
            create() {
                return {
                    file() {
                        calls.push(id);
                    },
                };
            },
        };
    };
    const lint = async (content: string, rules: SecretLintRuleCreator[]) => {
        await lintSource({
            source: { content, filePath: "/path/to/file.txt", contentType: "text" },
            options: {
                config: {
                    rules: rules.map((rule) => ({ id: rule.meta.id, rule, options: {} })),
                },
            },
        });
    };
    it("should call the rule only when the content contains one of the keywords", async () => {
        const calls: string[] = [];
        const rule = createRule(["ghp_", "gho_"], calls);
        await lint("nothing here", [rule]);
        assert.deepStrictEqual(calls, []);
        await lint("token: gho_xxxx", [rule]);
        assert.deepStrictEqual(calls, [rule.meta.id]);
    });
    it("should match keywords ASCII case-insensitively", async () => {
        const calls: string[] = [];
        const rule = createRule(["Secret"], calls);
        await lint("AWS_SECRET_ACCESS_KEY", [rule]);
        assert.deepStrictEqual(calls, [rule.meta.id]);
    });
    it("should always call the rule without keywords", async () => {
        const calls: string[] = [];
        const rule = createRule(undefined, calls);
        await lint("nothing here", [rule]);
        assert.deepStrictEqual(calls, [rule.meta.id]);
    });
    it("should always call the rule if the keywords are empty or include an invalid keyword", async () => {
        const calls: string[] = [];
        const emptyRule = createRule([], calls);
        const nonAsciiRule = createRule(["秘密", "ghp_"], calls);
        await lint("nothing here", [emptyRule, nonAsciiRule]);
        assert.deepStrictEqual(calls.sort(), [emptyRule.meta.id, nonAsciiRule.meta.id].sort());
    });
    it("should filter each rule by its own keywords", async () => {
        const calls: string[] = [];
        const githubRule = createRule(["ghp_"], calls);
        const npmRule = createRule(["npm_"], calls);
        await lint("npm_xxxx", [githubRule, npmRule]);
        assert.deepStrictEqual(calls, [npmRule.meta.id]);
    });
    it("should not decode binary content when no rule supports binary content", async () => {
        let contentAccessed = false;
        const calls: string[] = [];
        const rule = createRule(["ghp_"], calls);
        await lintSource({
            source: {
                get content() {
                    contentAccessed = true;
                    return "ghp_";
                },
                filePath: "/path/to/file.png",
                contentType: "binary",
            },
            options: {
                config: { rules: [{ id: rule.meta.id, rule, options: {} }] },
            },
        });
        assert.strictEqual(contentAccessed, false);
        assert.deepStrictEqual(calls, []);
    });
});
