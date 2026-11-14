import assert from "node:assert";
import { getKeywordScanPlan, lintSource } from "../src/index.js";
import { createKeywordScanner } from "../src/keyword-scan.js";
import type { SecretLintCoreConfig, SecretLintRawSource, SecretLintRuleCreator } from "@secretlint/types";

const messages = {
    FOUND: {
        en: (props: { TEXT: string }) => `found: ${props.TEXT}`,
    },
};
const createRule = (id: string, keyword: string | undefined): SecretLintRuleCreator => {
    return {
        messages,
        meta: { id, recommended: true, type: "scanner", supportedContentTypes: ["text"] },
        patterns: [
            {
                pattern: /(?:tok|key)_[a-z0-9]{4}/g,
                keywords: keyword === undefined ? undefined : [keyword],
                scope: "line",
                report: (match, context) => {
                    const t = context.createTranslator(messages);
                    context.report({ message: t("FOUND", { TEXT: match.text }), range: match.range });
                },
            },
        ],
        create() {
            return {};
        },
    };
};
const toConfig = (...rules: SecretLintRuleCreator[]): SecretLintCoreConfig => {
    return { rules: rules.map((rule) => ({ id: rule.meta.id, rule })) };
};
const createBytesSource = (content: string): SecretLintRawSource => {
    return {
        content,
        contentBytes: new TextEncoder().encode(content),
        filePath: "/path/to/file.txt",
        contentType: "text",
    };
};
const tokenConfig = toConfig(createRule("token", "tok_"));

describe("keyword scan", () => {
    it("should return the plan as data that can be cloned", () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        assert.deepStrictEqual(plan.keywords, ["tok_"]);
        assert.strictEqual(plan.requiresKeyword, true);
        assert.deepStrictEqual(structuredClone(plan), plan);
    });
    it("should return no plan if no rule has keywords", () => {
        assert.strictEqual(getKeywordScanPlan({ config: toConfig(createRule("always", undefined)) }), undefined);
    });
    it("should not require a keyword if a pattern without keywords is enabled", () => {
        const plan = getKeywordScanPlan({
            config: toConfig(createRule("token", "tok_"), createRule("always", undefined)),
        });
        assert.strictEqual(plan?.requiresKeyword, false);
    });
    it("should report the same messages with the result of the scan", async () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        // The plan is sent to another thread, so create the scanner from a clone
        const scanner = createKeywordScanner(structuredClone(plan));
        for (const content of [
            "first line\nkey = tok_ab12 and tok_cd34\nlast tok_ef56",
            "﻿日本語 tok_ab12\r\ntok_\n",
            "no keyword",
            "",
        ]) {
            const source = createBytesSource(content);
            const keywordScanResult = structuredClone(scanner.scan(source.contentBytes as Uint8Array));
            const expected = await lintSource({ source: createBytesSource(content), options: { config: tokenConfig } });
            const actual = await lintSource({ source, options: { config: tokenConfig }, keywordScanResult });
            assert.deepStrictEqual(actual, expected);
        }
    });
    it("should not scan the bytes again if the result of the scan is passed", async () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        const scanner = createKeywordScanner(plan);
        // The result of other bytes shows that the result is used. A caller should not do it
        const keywordScanResult = scanner.scan(new TextEncoder().encode("no keyword"));
        const result = await lintSource({
            source: createBytesSource("tok_ab12"),
            options: { config: tokenConfig },
            keywordScanResult,
        });
        assert.deepStrictEqual(result.messages, []);
    });
    it("should ignore the result of the scan for other keywords", async () => {
        const otherPlan = getKeywordScanPlan({ config: toConfig(createRule("key", "key_")) });
        assert.ok(otherPlan);
        const content = "tok_ab12";
        const keywordScanResult = createKeywordScanner(otherPlan).scan(new TextEncoder().encode(content));
        assert.strictEqual(keywordScanResult.hits.count, 0);
        const result = await lintSource({
            source: createBytesSource(content),
            options: { config: tokenConfig },
            keywordScanResult,
        });
        assert.deepStrictEqual(
            result.messages.map((message) => message.message),
            ["found: tok_ab12"],
        );
    });
});
