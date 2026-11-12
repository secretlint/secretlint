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
    it("should not create the rule when the content does not contain the keywords", async () => {
        const created: string[] = [];
        const rule: SecretLintRuleCreator = {
            messages: {},
            meta: {
                id: "keyword-rule-create",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
                keywords: ["ghp_"],
            },
            create() {
                created.push("create");
                return { file() {} };
            },
        };
        await lint("nothing here", [rule]);
        assert.deepStrictEqual(created, []);
        await lint("ghp_xxxx", [rule]);
        await lint("ghp_yyyy", [rule]);
        // create() is called for each file that the rule runs for
        assert.deepStrictEqual(created, ["create", "create"]);
    });
    it("should use the keywords of each rule set even if rule ids are the same", async () => {
        const calls: string[] = [];
        const ruleA = createRule(["aaa_"], calls);
        const ruleB = {
            ...createRule(["bbb_"], calls),
            meta: { ...createRule(["bbb_"], calls).meta, id: ruleA.meta.id },
        };
        await lint("aaa_", [ruleA]);
        await lint("aaa_", [ruleB]);
        await lint("bbb_", [ruleB]);
        assert.deepStrictEqual(calls, [ruleA.meta.id, `keyword-rule-${JSON.stringify(["bbb_"])}`]);
    });
    it("should use the changed keywords of the same rule creator", async () => {
        const calls: string[] = [];
        const rule = createRule(["aaa_"], calls);
        await lint("bbb_", [rule]);
        rule.meta.keywords = ["bbb_"];
        await lint("bbb_", [rule]);
        assert.deepStrictEqual(calls, [rule.meta.id]);
    });
    it("should not start any rule handler if create() of a rule throws", async () => {
        const calls: string[] = [];
        const okRule = createRule(["ghp_"], calls);
        const throwRule: SecretLintRuleCreator = {
            ...createRule(["ghp_"], calls),
            meta: { ...createRule(["ghp_"], calls).meta, id: "keyword-rule-throw" },
            create() {
                throw new Error("create error");
            },
        };
        await assert.rejects(lint("ghp_xxxx", [okRule, throwRule]), /create error/);
        assert.deepStrictEqual(calls, []);
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
    it("should always call the rule for binary content, because keywords are for text content", async () => {
        const calls: string[] = [];
        const rule: SecretLintRuleCreator = {
            ...createRule(["ghp_"], calls),
        };
        rule.meta = { ...rule.meta, supportedContentTypes: ["text", "binary"] };
        const lintAs = (contentType: "text" | "binary", contentBytes?: Uint8Array) => {
            return lintSource({
                source: { content: "no keyword", contentBytes, filePath: "/path/to/file.p12", contentType },
                options: {
                    config: { rules: [{ id: rule.meta.id, rule, options: {} }] },
                },
            });
        };
        await lintAs("text");
        await lintAs("text", new TextEncoder().encode("no keyword"));
        assert.deepStrictEqual(calls, []);
        await lintAs("binary");
        await lintAs("binary", new TextEncoder().encode("no keyword"));
        assert.deepStrictEqual(calls, [rule.meta.id, rule.meta.id]);
    });
    it('should treat "all" of an older rule as text and binary', async () => {
        const calls: string[] = [];
        const rule: SecretLintRuleCreator = { ...createRule([], calls) };
        // "all" is not in the type now, but a published rule may declare it
        rule.meta = { ...rule.meta, supportedContentTypes: ["all"] as unknown as ["text", "binary"] };
        for (const contentType of ["text", "binary"] as const) {
            await lintSource({
                source: { content: "content", filePath: "/path/to/file", contentType },
                options: { config: { rules: [{ id: rule.meta.id, rule, options: {} }] } },
            });
        }
        assert.deepStrictEqual(calls, [rule.meta.id, rule.meta.id]);
    });
    it("should give the bytes of the source to the rule as contentBytes", async () => {
        const received: (Uint8Array | undefined)[] = [];
        const rule: SecretLintRuleCreator = {
            messages: {},
            meta: {
                id: "receive-bytes",
                recommended: false,
                type: "scanner",
                supportedContentTypes: ["text", "binary"],
            },
            create() {
                return {
                    async file(source: SecretLintSourceCode) {
                        // the bytes are still available after an await in the handler
                        await Promise.resolve();
                        received.push(source.contentBytes);
                    },
                };
            },
        };
        const bytes = new Uint8Array([0x30, 0x82, 0x00, 0xff]);
        const lint = (contentBytes: Uint8Array | undefined) =>
            lintSource({
                source: { content: "binary", contentBytes, filePath: "/path/to/key.p12", contentType: "binary" },
                options: { config: { rules: [{ id: rule.meta.id, rule, options: {} }] } },
            });
        await lint(bytes);
        await lint(undefined);
        assert.deepStrictEqual(received, [bytes, undefined]);
        assert.strictEqual(received[0], bytes);
    });
    it("should not read the content of bytes without keywords", async () => {
        const calls: string[] = [];
        const rule = createRule(["ghp_"], calls);
        let contentAccessed = false;
        const result = await lintSource({
            source: {
                get content() {
                    contentAccessed = true;
                    return "nothing here";
                },
                contentBytes: new TextEncoder().encode("nothing here"),
                filePath: "/path/to/file.txt",
                contentType: "text",
            },
            options: {
                config: { rules: [{ id: rule.meta.id, rule, options: {} }] },
            },
        });
        assert.deepStrictEqual(calls, []);
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(contentAccessed, false);
        // the result does not have the content of the source
        assert.strictEqual("sourceContent" in result, false);
    });
});
