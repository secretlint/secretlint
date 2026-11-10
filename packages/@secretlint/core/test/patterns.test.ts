import assert from "node:assert";
import { lintSource } from "../src/index.js";
import type {
    SecretLintCoreConfig,
    SecretLintRawSource,
    SecretLintRuleCreator,
    SecretLintRulePattern,
    SecretLintRulePresetCreator,
} from "@secretlint/types";

const messages = {
    FOUND: {
        en: (props: { TEXT: string }) => `found: ${props.TEXT}`,
    },
};
type Options = { allows?: string[] };
const reportMatch: SecretLintRulePattern<Options>["report"] = (match, context) => {
    if (context.options.allows?.includes(match.text)) {
        return;
    }
    const t = context.createTranslator(messages);
    context.report({ message: t("FOUND", { TEXT: match.text }), range: match.range });
};
const createPatternRule = (
    patterns: SecretLintRulePattern<Options>[],
    overrides: Partial<SecretLintRuleCreator<Options>["meta"]> = {},
): SecretLintRuleCreator<Options> & { created: number } => {
    const rule = {
        created: 0,
        messages,
        meta: {
            id: "pattern-rule",
            recommended: true,
            type: "scanner" as const,
            supportedContentTypes: ["text" as const],
            ...overrides,
        },
        patterns,
        create() {
            rule.created++;
            return {};
        },
    };
    return rule;
};
const tokenPattern = (overrides: Partial<SecretLintRulePattern<Options>> = {}): SecretLintRulePattern<Options> => {
    return {
        pattern: /tok_[a-z0-9]{4}/g,
        keywords: ["tok_"],
        scope: "line",
        report: reportMatch,
        ...overrides,
    };
};
const toConfig = (rule: SecretLintRuleCreator<Options>, options?: Options): SecretLintCoreConfig => {
    return { rules: [{ id: rule.meta.id, rule, options }] };
};
/**
 * A source of a string, and a source of UTF-8 bytes that counts the reads of `content`
 */
const createSources = (content: string, contentType: SecretLintRawSource["contentType"] = "text") => {
    const state = { contentReads: 0 };
    const textSource: SecretLintRawSource = { content, filePath: "/path/to/file.txt", contentType };
    const bytesSource: SecretLintRawSource = {
        get content() {
            state.contentReads++;
            return content;
        },
        contentBytes: new TextEncoder().encode(content),
        filePath: "/path/to/file.txt",
        contentType,
    };
    return { textSource, bytesSource, state };
};
/**
 * Lint the content as a string and as bytes. Both should report the same messages.
 */
const lintBoth = async (content: string, config: SecretLintCoreConfig) => {
    const { textSource, bytesSource, state } = createSources(content);
    const textResult = await lintSource({ source: textSource, options: { config } });
    const bytesResult = await lintSource({ source: bytesSource, options: { config } });
    assert.deepStrictEqual(bytesResult.messages, textResult.messages);
    return { messages: textResult.messages, bytesResult, state };
};
const toRangeTexts = (content: string, messages: { range: readonly [number, number] }[]) => {
    return messages.map((message) => content.slice(message.range[0], message.range[1]));
};

describe("lintSource with patterns", () => {
    it("should report the matches of a pattern without calling create()", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const content = "first line\nkey = tok_ab12 and tok_cd34\nlast tok_ef56";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_ab12", "tok_cd34", "tok_ef56"]);
        assert.deepStrictEqual(
            messages.map((message) => [message.message, message.messageId, message.ruleId, message.loc.start]),
            [
                ["found: tok_ab12", "FOUND", "pattern-rule", { line: 2, column: 6 }],
                ["found: tok_cd34", "FOUND", "pattern-rule", { line: 2, column: 19 }],
                ["found: tok_ef56", "FOUND", "pattern-rule", { line: 3, column: 5 }],
            ],
        );
        assert.strictEqual(rule.created, 0);
    });
    it("should report the same range after non-ASCII characters, a BOM, and CRLF", async () => {
        const rule = createPatternRule([tokenPattern()]);
        for (const content of [
            "日本語 tok_ab12\n𠮷野家 tok_cd34 é\n",
            "﻿tok_ab12\r\n日本語\r\ntok_cd34\r\n",
            "﻿日本語\ntok_ab12",
        ]) {
            const { messages } = await lintBoth(content, toConfig(rule));
            // ranges are for the content without the BOM
            const contentWithoutBOM = content.replace(/^﻿/, "");
            assert.deepStrictEqual(
                toRangeTexts(contentWithoutBOM, messages),
                ["tok_ab12", "tok_cd34"].slice(0, messages.length),
            );
            assert.ok(messages.length >= 1);
        }
    });
    it("should not read the content when the bytes have no keyword", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { bytesSource, state } = createSources("no keyword here\n".repeat(10));
        const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(state.contentReads, 0);
        // the result reads the content lazily
        assert.strictEqual(result.sourceContent, "no keyword here\n".repeat(10));
        assert.strictEqual(state.contentReads, 1);
    });
    it("should not read the content when a line has a keyword but the pattern does not match the line", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { bytesSource, state } = createSources("日本語\nthis is tok_ only\ntok_AB\n");
        const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(state.contentReads, 0);
    });
    it("should match keywords case-sensitively if caseSensitiveKeywords is true", async () => {
        const createRule = (caseSensitiveKeywords: boolean) => {
            return createPatternRule([
                tokenPattern({ pattern: /SG\.[a-z0-9]{4}/g, keywords: ["SG."], caseSensitiveKeywords }),
                // the same keyword text of another pattern stays case-insensitive
                tokenPattern({ pattern: /sg\.[A-Z]{4}/gi, keywords: ["sg."] }),
            ]);
        };
        const content = "msg.x()\nkey = SG.ab12\nsg.WXYZ\n";
        for (const caseSensitiveKeywords of [true, false]) {
            const { messages } = await lintBoth(content, toConfig(createRule(caseSensitiveKeywords)));
            assert.deepStrictEqual(toRangeTexts(content, messages), ["SG.ab12", "sg.WXYZ"]);
        }
        // a file that has the keyword only in another case is not read
        const rule = createPatternRule([
            tokenPattern({
                pattern: /SG\.[a-z0-9]{4}/g,
                keywords: ["SG."],
                scope: "file",
                caseSensitiveKeywords: true,
            }),
        ]);
        const { bytesSource, state } = createSources("msg.send()\nsg.ab12\n");
        const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(state.contentReads, 0);
        // without the option, the "file" scope pattern needs the content
        const insensitiveRule = createPatternRule([
            tokenPattern({ pattern: /SG\.[a-z0-9]{4}/g, keywords: ["SG."], scope: "file" }),
        ]);
        const insensitive = createSources("msg.send()\nsg.ab12\n");
        await lintSource({ source: insensitive.bytesSource, options: { config: toConfig(insensitiveRule) } });
        assert.ok(insensitive.state.contentReads > 0);
    });
    it("should run a 'line' scope pattern on each line", async () => {
        // `^` and `$` are the start and the end of a line in the "line" scope
        const rule = createPatternRule([tokenPattern({ pattern: /^tok_[a-z0-9]{4}$/ })]);
        const content = "tok_ab12\n tok_cd34\ntok_ef56 \ntok_gh78";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_gh78"]);
        // a line includes its line break
        const ruleWithLineBreak = createPatternRule([tokenPattern({ pattern: /^tok_[a-z0-9]{4}\n/ })]);
        const result = await lintBoth(content, toConfig(ruleWithLineBreak));
        assert.deepStrictEqual(toRangeTexts(content, result.messages), ["tok_ab12\n"]);
    });
    it("should run a 'file' scope pattern on the whole content", async () => {
        const rule = createPatternRule([
            tokenPattern({ pattern: /BEGIN\n([a-z\n]+)\nEND tok_/g, scope: "file" }),
            // scope is "file" by default
            tokenPattern({ pattern: /tok_\n[0-9]+/g, scope: undefined }),
        ]);
        const content = "x\nBEGIN\nabc\ndef\nEND tok_\n123\n";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["BEGIN\nabc\ndef\nEND tok_", "tok_\n123"]);
    });
    it("should run a pattern without keywords for all content", async () => {
        const rule = createPatternRule([tokenPattern({ pattern: /[0-9]{6}/g, keywords: undefined })]);
        const content = "a 123456\nb 654321";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["123456", "654321"]);
    });
    it("should use the 'file' scope if the keywords can not find a line", async () => {
        const content = "a\nb tok_\nc";
        for (const keywords of [undefined, [], ["秘密"], ["tok_\nc"]]) {
            const rule = createPatternRule([tokenPattern({ pattern: /b tok_\nc/g, keywords, scope: "line" })]);
            const { messages } = await lintBoth(content, toConfig(rule));
            assert.deepStrictEqual(toRangeTexts(content, messages), ["b tok_\nc"], JSON.stringify(keywords));
        }
    });
    it("should match keywords ASCII case-insensitively", async () => {
        const rule = createPatternRule([tokenPattern({ pattern: /TOK_[A-Z0-9]{4}/g, keywords: ["Tok_"] })]);
        const content = "TOK_AB12";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["TOK_AB12"]);
    });
    it("should find all matches of a pattern without the 'g' flag, and should not change the pattern", async () => {
        const pattern = /tok_[a-z0-9]{4}/;
        const rule = createPatternRule([tokenPattern({ pattern })]);
        const content = "tok_ab12 tok_cd34";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_ab12", "tok_cd34"]);
        assert.strictEqual(pattern.lastIndex, 0);
    });
    it("should pass captures, groups, options, and the source to report()", async () => {
        const calls: unknown[] = [];
        const rule = createPatternRule([
            tokenPattern({
                pattern: /tok_(?<body>[a-z0-9]{2})([a-z0-9]{2})/g,
                report(match, context) {
                    calls.push({
                        text: match.text,
                        captures: [...match.captures],
                        groups: { ...match.groups },
                        options: context.options,
                        filePath: context.source.filePath,
                        content: context.source.content,
                    });
                },
            }),
        ]);
        const { textSource } = createSources("x\n tok_ab12");
        await lintSource({ source: textSource, options: { config: toConfig(rule, { allows: ["a"] }) } });
        await lintSource({ source: textSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(calls, [
            {
                text: "tok_ab12",
                captures: ["tok_ab12", "ab", "12"],
                groups: { body: "ab" },
                options: { allows: ["a"] },
                filePath: "/path/to/file.txt",
                content: "x\n tok_ab12",
            },
            {
                text: "tok_ab12",
                captures: ["tok_ab12", "ab", "12"],
                groups: { body: "ab" },
                // options is {} by default
                options: {},
                filePath: "/path/to/file.txt",
                content: "x\n tok_ab12",
            },
        ]);
    });
    it("should use the options of the config", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const content = "tok_ab12 tok_cd34";
        const { messages } = await lintBoth(content, toConfig(rule, { allows: ["tok_ab12"] }));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_cd34"]);
    });
    it("should stop at empty matches", async () => {
        const rule = createPatternRule([
            tokenPattern({ pattern: /x*/g, keywords: ["x"] }),
            tokenPattern({ pattern: /(?=𠮷)/gu, keywords: ["k"], scope: "file" }),
        ]);
        const content = "axxb 𠮷k";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.ok(messages.some((message) => content.slice(...message.range) === "xx"));
    });
    it("should run patterns only for the supported content type", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { bytesSource, state } = createSources("tok_ab12", "binary");
        const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(result.sourceContent, undefined);
        assert.strictEqual(state.contentReads, 0);
        const unknown = createSources("tok_ab12", "unknown");
        const unknownResult = await lintSource({ source: unknown.bytesSource, options: { config: toConfig(rule) } });
        assert.strictEqual(unknownResult.messages.length, 1);
        assert.strictEqual(unknownResult.sourceContent, undefined);
    });
    it("should run pattern rules and other rules together, and sort messages by location", async () => {
        const patternRule = createPatternRule([tokenPattern()]);
        const handlerRule: SecretLintRuleCreator = {
            messages,
            meta: {
                id: "handler-rule",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
                keywords: ["hand_"],
            },
            create(context) {
                const t = context.createTranslator(messages);
                return {
                    file(source) {
                        for (const match of source.content.matchAll(/hand_[a-z]{2}/g)) {
                            context.report({
                                message: t("FOUND", { TEXT: match[0] }),
                                range: [match.index, match.index + match[0].length],
                            });
                        }
                    },
                };
            },
        };
        const config: SecretLintCoreConfig = {
            rules: [
                { id: handlerRule.meta.id, rule: handlerRule },
                { id: patternRule.meta.id, rule: patternRule, severity: "warning" },
            ],
        };
        const content = "tok_ab12 hand_ab\nhand_cd tok_cd34";
        const result = await lintBoth(content, config);
        assert.deepStrictEqual(
            result.messages.map((message) => [message.ruleId, message.severity, content.slice(...message.range)]),
            [
                ["pattern-rule", "warning", "tok_ab12"],
                ["handler-rule", "error", "hand_ab"],
                ["handler-rule", "error", "hand_cd"],
                ["pattern-rule", "warning", "tok_cd34"],
            ],
        );
    });
    it("should run pattern rules in a preset with the options of the preset", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const preset: SecretLintRulePresetCreator = {
            meta: { id: "preset", recommended: true, type: "preset" },
            rules: [rule as SecretLintRuleCreator<unknown>],
            create(context) {
                context.registerRule(rule);
            },
        };
        const config: SecretLintCoreConfig = {
            rules: [
                {
                    id: "preset",
                    rule: preset,
                    rules: [{ id: "pattern-rule", options: { allows: ["tok_ab12"] }, allowMessageIds: [] }],
                },
            ],
        };
        const content = "tok_ab12 tok_cd34";
        const { messages } = await lintBoth(content, config);
        assert.deepStrictEqual(
            messages.map((message) => [message.ruleId, message.ruleParentId, content.slice(...message.range)]),
            [["pattern-rule", "preset", "tok_cd34"]],
        );
    });
    it("should reject if report() throws", async () => {
        const rule = createPatternRule([
            tokenPattern({
                report() {
                    throw new Error("report error");
                },
            }),
        ]);
        const { textSource, bytesSource } = createSources("tok_ab12");
        await assert.rejects(lintSource({ source: textSource, options: { config: toConfig(rule) } }), /report error/);
        await assert.rejects(lintSource({ source: bytesSource, options: { config: toConfig(rule) } }), /report error/);
    });
    it("should use the changed config and patterns with the same config object", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const config = toConfig(rule);
        const content = "tok_ab12 new_ab12";
        assert.deepStrictEqual(toRangeTexts(content, (await lintBoth(content, config)).messages), ["tok_ab12"]);
        rule.patterns = [tokenPattern({ pattern: /new_[a-z0-9]{4}/g, keywords: ["new_"] })];
        assert.deepStrictEqual(toRangeTexts(content, (await lintBoth(content, config)).messages), ["new_ab12"]);
        config.rules = [{ id: rule.meta.id, rule, options: { allows: ["new_ab12"] } }];
        assert.deepStrictEqual(toRangeTexts(content, (await lintBoth(content, config)).messages), []);
        config.rules = [{ id: rule.meta.id, rule, disabled: true }];
        assert.deepStrictEqual(toRangeTexts(content, (await lintBoth(content, config)).messages), []);
    });
    it("should lint empty content", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { messages, bytesResult } = await lintBoth("", toConfig(rule));
        assert.deepStrictEqual(messages, []);
        assert.strictEqual(bytesResult.sourceContent, "");
    });
    it("should lint the bytes of a view of a larger buffer", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const content = "a\ntok_ab12\n";
        const buffer = new TextEncoder().encode(`tok_zz99\n${content}tok_yy88`);
        const contentBytes = buffer.subarray(9, 9 + content.length);
        const result = await lintSource({
            source: { content, contentBytes, filePath: "/path/to/file.txt", contentType: "text" },
            options: { config: toConfig(rule) },
        });
        assert.deepStrictEqual(toRangeTexts(content, result.messages), ["tok_ab12"]);
    });
});
