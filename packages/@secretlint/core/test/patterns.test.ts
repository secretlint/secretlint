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
type Options = { allows?: string[]; enableTokenScan?: boolean };
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
    return { messages: textResult.messages, textResult, bytesResult, state };
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
    });
    it("should not read the content when a line has a keyword but the pattern does not match the line", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { bytesSource, state } = createSources("日本語\nthis is tok_ only\ntok_AB\n");
        const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
        assert.deepStrictEqual(result.messages, []);
        assert.strictEqual(state.contentReads, 0);
    });
    it("should match keywords case-insensitively", async () => {
        const rule = createPatternRule([tokenPattern({ pattern: /sg\.[a-z0-9]{4}/gi, keywords: ["SG."] })]);
        const content = "key = SG.ab12\nsg.WXYZ\n";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["SG.ab12", "sg.WXYZ"]);
    });
    it("should throw on `caseSensitiveKeywords`, which is not a property of a pattern", async () => {
        const rule = createPatternRule([
            tokenPattern({ caseSensitiveKeywords: true } as Partial<SecretLintRulePattern<Options>>),
        ]);
        const { textSource } = createSources("tok_ab12\n");
        await assert.rejects(
            async () => lintSource({ source: textSource, options: { config: toConfig(rule) } }),
            /unknown properties: caseSensitiveKeywords/,
        );
    });
    describe("a keyword with a guard", () => {
        // "00" is in most files. The guard keeps the keyword where 8 characters of the key follow it
        const guardedPattern = (overrides: Partial<SecretLintRulePattern<Options>> = {}) => {
            return tokenPattern({
                pattern: /(?<![A-Za-z0-9])00[A-Za-z0-9]{8}(?![A-Za-z0-9])/g,
                keywords: [{ keyword: "00", after: "[A-Za-z0-9]{8,}" }],
                ...overrides,
            });
        };
        it("should report a match whose keyword meets the guard", async () => {
            const content = "id = 100\ntime = 00:00:00\nkey = 00abcdEF12\n0x0000\n";
            for (const scope of ["line", "file"] as const) {
                const { messages } = await lintBoth(content, toConfig(createPatternRule([guardedPattern({ scope })])));
                assert.deepStrictEqual(toRangeTexts(content, messages), ["00abcdEF12"]);
            }
        });
        it("should not read the content when the guard is met nowhere", async () => {
            const rule = createPatternRule([guardedPattern({ scope: "file" })]);
            const { bytesSource, state } = createSources(
                "id = 100\ntime = 00:00:00\n0x0000 00abc 00日本語日本語日本\n",
            );
            const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule) } });
            assert.deepStrictEqual(result.messages, []);
            assert.strictEqual(state.contentReads, 0);
            // without the guard, the "file" scope pattern needs the content
            const unguarded = createSources("id = 100\n");
            const unguardedRule = createPatternRule([guardedPattern({ scope: "file", keywords: ["00"] })]);
            await lintSource({ source: unguarded.bytesSource, options: { config: toConfig(unguardedRule) } });
            assert.ok(unguarded.state.contentReads > 0);
        });
        it("should match the keyword case-insensitively and the set as it is written", async () => {
            const rule = createPatternRule([
                tokenPattern({
                    pattern: /asia[A-Z0-9]{4}/gi,
                    keywords: [{ keyword: "ASIA", after: "[A-Z0-9]{4,}" }],
                }),
            ]);
            // "asiaWXYZ" has the keyword in lower case. "ASIAwxyz" does not meet the set, so the pattern does not run
            const content = "asia-northeast1\nASIAwxyz\nasiaWXYZ\nASIAAB12\n";
            const { messages } = await lintBoth(content, toConfig(rule));
            assert.deepStrictEqual(toRangeTexts(content, messages), ["asiaWXYZ", "ASIAAB12"]);
        });
        it("should select each pattern by its own guard when patterns share a keyword", async () => {
            const rule = createPatternRule([
                tokenPattern({ pattern: /00[a-z]{4}/g, keywords: [{ keyword: "00", after: "[a-z]{4,}" }] }),
                tokenPattern({ pattern: /00[0-9]{6}/g, keywords: [{ keyword: "00", after: "[0-9]{6,}" }] }),
                tokenPattern({ pattern: /x00!/g, keywords: ["00"] }),
            ]);
            const content = "00abcd\n00123456\nx00!\n00ab 0012\n";
            const { messages } = await lintBoth(content, toConfig(rule));
            assert.deepStrictEqual(toRangeTexts(content, messages), ["00abcd", "00123456", "x00!"]);
        });
        it("should use strings and keyword objects together", async () => {
            const rule = createPatternRule([
                tokenPattern({
                    pattern: /(?:tok_[a-z0-9]{4}|00[a-z]{4})/g,
                    keywords: ["tok_", { keyword: "00", after: "[a-z]{4,}" }],
                }),
            ]);
            const content = "tok_ab12\n00abcd\n0012\n";
            const { messages } = await lintBoth(content, toConfig(rule));
            assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_ab12", "00abcd"]);
        });
        it("should throw on a keyword object that is not supported, with the rule and the supported form", async () => {
            const cases: [unknown, RegExp][] = [
                [{ keyword: "00", after: "[a-z]{40}" }, /Write `\{40,\}`/],
                [{ keyword: "00", after: "[a-z]{32,40}" }, /Write `\{32,\}`/],
                [{ keyword: "00", after: "[a-z]+" }, /Write `\[\.\.\.\]\{1,\}`/],
                [{ keyword: "00", after: "[a-z]*" }, /always true/],
                [{ keyword: "00", after: "[a-z]{0,}" }, /always true/],
                [{ keyword: "00", after: "[\\d]{4,}" }, /Write `0-9`/],
                [{ keyword: "00", after: "[\\w]{4,}" }, /Write `A-Za-z0-9_`/],
                [{ keyword: "00", after: "[^a-z]{4,}" }, /`\^` is not supported/],
                [{ keyword: "00", after: "[a-z]{256,}" }, /255 or less/],
                [{ keyword: "00", after: "[a-z]{4,}$" }, /is not supported/],
                [{ keyword: "00", after: "a{4,}" }, /should start with a set/],
                [{ keyword: "00", after: "[-a]{4,}" }, /last item/],
                [{ keyword: "00", after: "[あ]{4,}" }, /only ASCII/],
                [{ keyword: "00", after: 4 }, /`after` should be a string/],
                [{ keyword: "00" }, /`after` is required/],
                [{ keyword: "", after: "[a-z]{4,}" }, /non-empty ASCII string/],
                [{ keyword: "00", after: "[a-z]{4,}", caseSensitive: true }, /unknown properties: caseSensitive/],
            ];
            for (const [keyword, expected] of cases) {
                const rule = createPatternRule([
                    tokenPattern({ keywords: [keyword] as SecretLintRulePattern<Options>["keywords"] }),
                ]);
                const { textSource } = createSources("tok_ab12\n");
                const lint = async () => lintSource({ source: textSource, options: { config: toConfig(rule) } });
                await assert.rejects(lint, expected, JSON.stringify(keyword));
                await assert.rejects(lint, /The rule "pattern-rule" has a pattern with a keyword/);
                // the error of the parser is the cause
                await assert.rejects(lint, (error: Error) => error.cause instanceof Error);
            }
        });
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
        assert.strictEqual(state.contentReads, 0);
        const unknown = createSources("tok_ab12", "unknown");
        const unknownResult = await lintSource({ source: unknown.bytesSource, options: { config: toConfig(rule) } });
        assert.strictEqual(unknownResult.messages.length, 1);
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
    it("should not run a rule that is disabled in the rules of a preset", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const handlerRule: SecretLintRuleCreator = {
            messages: {},
            meta: { id: "handler-rule", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
            create(context) {
                return {
                    file(source) {
                        context.report({ message: "found", range: [0, source.content.length] });
                    },
                };
            },
        };
        const preset: SecretLintRulePresetCreator = {
            meta: { id: "preset", recommended: true, type: "preset" },
            rules: [rule as SecretLintRuleCreator<unknown>, handlerRule as SecretLintRuleCreator<unknown>],
            create(context) {
                context.registerRule(rule);
                context.registerRule(handlerRule);
            },
        };
        const config: SecretLintCoreConfig = {
            rules: [
                {
                    id: "preset",
                    rule: preset,
                    rules: [
                        { id: "pattern-rule", disabled: true },
                        { id: "handler-rule", disabled: true },
                    ],
                },
            ],
        };
        const content = "tok_ab12";
        assert.deepStrictEqual((await lintBoth(content, config)).messages, []);
        assert.strictEqual(rule.created, 0);
        // enable the rules again with the same config object
        config.rules[0] = { id: "preset", rule: preset, rules: [{ id: "pattern-rule", disabled: false }] };
        assert.deepStrictEqual((await lintBoth(content, config)).messages.map((message) => message.ruleId).sort(), [
            "handler-rule",
            "pattern-rule",
        ]);
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
    it("should run a rule that has only patterns", async () => {
        const { create: _create, created: _created, ...rule } = createPatternRule([tokenPattern()]);
        const content = "key = tok_ab12";
        const { messages } = await lintBoth(content, toConfig(rule));
        assert.deepStrictEqual(toRangeTexts(content, messages), ["tok_ab12"]);
    });
    it("should throw if a rule has no patterns and no create()", async () => {
        const { create: _create, created: _created, patterns: _patterns, ...rule } = createPatternRule([]);
        const { textSource } = createSources("content");
        await assert.rejects(
            async () => lintSource({ source: textSource, options: { config: toConfig(rule) } }),
            /The rule should have `create` function or `patterns`: pattern-rule/,
        );
    });
    it("should throw if a pattern has a property that this version does not know", async () => {
        const futurePattern = { ...tokenPattern(), futureCondition: true };
        const rule = createPatternRule([futurePattern]);
        const { textSource, bytesSource } = createSources("key = tok_ab12");
        for (const source of [textSource, bytesSource]) {
            await assert.rejects(
                async () => lintSource({ source, options: { config: toConfig(rule) } }),
                /The rule "pattern-rule" has a pattern with unknown properties: futureCondition\nThis version of secretlint does not support the properties. Please update secretlint./,
            );
        }
    });
    it("should not run a pattern whose `when` option is not true", async () => {
        const rule = createPatternRule([
            tokenPattern({ when: "options.enableTokenScan" }),
            tokenPattern({ pattern: /key_[a-z]{2}/g, keywords: ["key_"] }),
        ]);
        const toScanConfig = (options?: Options): SecretLintCoreConfig => toConfig(rule, options);
        const { textSource, bytesSource, state } = createSources("a = tok_ab12\nb = key_xy");
        // disabled: the pattern is not a part of the lint
        for (const options of [undefined, {}, { enableTokenScan: false }, { enableTokenScan: undefined }]) {
            const config = toScanConfig(options);
            for (const source of [textSource, bytesSource]) {
                const result = await lintSource({ source, options: { config } });
                assert.deepStrictEqual(
                    result.messages.map((message) => message.message),
                    ["found: key_xy"],
                );
            }
        }
        // the keyword of a disabled pattern does not make secretlint read the content
        const { bytesSource: tokenOnlySource, state: tokenOnlyState } = createSources("a = tok_ab12");
        const tokenOnlyResult = await lintSource({ source: tokenOnlySource, options: { config: toScanConfig() } });
        assert.deepStrictEqual(tokenOnlyResult.messages, []);
        assert.strictEqual(tokenOnlyState.contentReads, 0);
        // enabled
        const enabledResult = await lintSource({
            source: bytesSource,
            options: { config: toScanConfig({ enableTokenScan: true }) },
        });
        assert.deepStrictEqual(
            enabledResult.messages.map((message) => message.message),
            ["found: tok_ab12", "found: key_xy"],
        );
        assert.ok(state.contentReads > 0);
    });
    it("should run a pattern whose `when` is negated unless the option is true", async () => {
        const rule = createPatternRule([
            tokenPattern({ when: "!options.enableTokenScan" }),
            tokenPattern({ pattern: /key_[a-z]{2}/g, keywords: ["key_"] }),
        ]);
        const { bytesSource } = createSources("a = tok_ab12\nb = key_xy");
        // enabled: the option is false or not set
        for (const options of [undefined, {}, { enableTokenScan: false }]) {
            const result = await lintSource({ source: bytesSource, options: { config: toConfig(rule, options) } });
            assert.deepStrictEqual(
                result.messages.map((message) => message.message),
                ["found: tok_ab12", "found: key_xy"],
            );
        }
        // disabled: the pattern is not a part of the lint
        const disabledConfig = toConfig(rule, { enableTokenScan: true });
        const disabledResult = await lintSource({ source: bytesSource, options: { config: disabledConfig } });
        assert.deepStrictEqual(
            disabledResult.messages.map((message) => message.message),
            ["found: key_xy"],
        );
        const { bytesSource: tokenOnlySource, state: tokenOnlyState } = createSources("a = tok_ab12");
        await lintSource({ source: tokenOnlySource, options: { config: disabledConfig } });
        assert.strictEqual(tokenOnlyState.contentReads, 0);
    });
    it("should throw if the option of `when` is not a boolean", async () => {
        const { textSource } = createSources("a = tok_ab12");
        for (const [value, type] of [
            ["true", "string"],
            [1, "number"],
            [null, "null"],
        ] as const) {
            for (const when of ["options.enableTokenScan", "!options.enableTokenScan"] as const) {
                const rule = createPatternRule([tokenPattern({ when })]);
                const config = toConfig(rule, { enableTokenScan: value as unknown as boolean });
                await assert.rejects(
                    async () => lintSource({ source: textSource, options: { config } }),
                    new RegExp(
                        `The option "enableTokenScan" of the rule "pattern-rule" should be a boolean, but it is ${type}.`,
                    ),
                );
            }
        }
    });
    it("should not enable a pattern by a property that the options inherit", async () => {
        const rule = createPatternRule([
            // the type does not accept "constructor", because it is not an option
            tokenPattern({ when: "options.constructor" as "options.enableTokenScan" }),
        ]);
        const { textSource } = createSources("a = tok_ab12");
        const result = await lintSource({ source: textSource, options: { config: toConfig(rule, {}) } });
        assert.deepStrictEqual(result.messages, []);
    });
    it("should throw if `when` of a pattern is not a supported form", async () => {
        // an expression is not supported: it should not be read as the name of an option
        for (const when of [
            true,
            "",
            "!",
            "enableTokenScan",
            "!enableTokenScan",
            "options",
            "options.",
            "!!options.a",
            "! options.a",
            "options.a.b",
            "options.enableTokenScan == true",
            "options.a && options.b",
            "sharedOptions.a",
            () => true,
        ]) {
            const rule = createPatternRule([{ ...tokenPattern(), when } as unknown as SecretLintRulePattern<Options>]);
            const { textSource } = createSources("key = tok_ab12");
            await assert.rejects(
                async () => lintSource({ source: textSource, options: { config: toConfig(rule) } }),
                /The rule "pattern-rule" has a pattern whose `when` is not supported/,
            );
        }
    });
    it("should throw if a pattern has an unknown scope", async () => {
        const rule = createPatternRule([{ ...tokenPattern(), scope: "lines" as "line" }]);
        const { textSource } = createSources("key = tok_ab12");
        await assert.rejects(
            async () => lintSource({ source: textSource, options: { config: toConfig(rule) } }),
            /The rule "pattern-rule" has a pattern with unknown scope: "lines"\nThe scope should be "line" or "file"/,
        );
    });
    it("should not return the content of the source in the result", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const found = await lintBoth("key = tok_ab12", toConfig(rule));
        assert.strictEqual(found.messages.length, 1);
        assert.deepStrictEqual(Object.keys(found.bytesResult).sort(), ["filePath", "messages", "sourceContentType"]);
        assert.deepStrictEqual(Object.keys(found.textResult).sort(), ["filePath", "messages", "sourceContentType"]);
    });
    it("should lint empty content", async () => {
        const rule = createPatternRule([tokenPattern()]);
        const { messages } = await lintBoth("", toConfig(rule));
        assert.deepStrictEqual(messages, []);
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
