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
    it("should have the guards of the keywords as data, and check them in the scan", () => {
        const rule = createRule("guarded", "tok_");
        (rule.patterns as NonNullable<SecretLintRuleCreator["patterns"]>)[0]!.keywords = [
            "tok_",
            { keyword: "KEY_", after: "[a-z0-9]{4,}" },
        ];
        const plan = getKeywordScanPlan({ config: toConfig(rule) });
        assert.ok(plan);
        assert.deepStrictEqual(plan.keywords, ["key_", "tok_"]);
        assert.deepStrictEqual(plan.guards, [{ chars: "0123456789abcdefghijklmnopqrstuvwxyz", min: 4 }, undefined]);
        // a worker thread gets a copy of the plan
        const scanner = createKeywordScanner(structuredClone(plan));
        const scan = (content: string) => scanner.scan(new TextEncoder().encode(content));
        assert.strictEqual(scan("key_ab KEY_AB12 key_").hasKeyword, false);
        assert.deepStrictEqual([...scan("Key_ab12").found], [1, 0]);
        assert.strictEqual(scan("x key_ab12").runsRules, true);
        // the places of a guarded keyword are counted only for the profile
        assert.deepStrictEqual(scanner.takeGuardCounts(), []);
        const profiled = createKeywordScanner(plan, { profile: true });
        profiled.scan(new TextEncoder().encode("key_ab KEY_AB12 key_ key_ab12"));
        assert.deepStrictEqual(profiled.takeGuardCounts(), [{ id: "key_ [0-9a-z]{4,}", found: 4, met: 1 }]);
        // a plan that was sent as JSON has `null` for a keyword without a guard
        const jsonPlan = JSON.parse(JSON.stringify(plan));
        assert.deepStrictEqual(jsonPlan.guards[1], null);
        for (const profile of [false, true]) {
            const jsonScanner = createKeywordScanner(jsonPlan, { profile });
            const result = jsonScanner.scan(new TextEncoder().encode("key_ab tok_ab12 key_ab12"));
            assert.deepStrictEqual([...result.found], [1, 1]);
        }
        // the id of the plan has the guards
        (rule.patterns as NonNullable<SecretLintRuleCreator["patterns"]>)[0]!.keywords = ["tok_", "KEY_"];
        const unguardedPlan = getKeywordScanPlan({ config: toConfig({ ...rule }) });
        assert.notStrictEqual(unguardedPlan?.id, plan.id);
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
        assert.strictEqual(keywordScanResult.hasKeyword, false);
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
    it("should have the patterns of the rules as data", () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.deepStrictEqual(plan?.ruleCheck, {
            contentKeywordIndexes: [],
            linePatterns: [
                {
                    source: "(?:tok|key)_[a-z0-9]{4}",
                    flags: "",
                    keywordIndexes: [0],
                    profileId: "token#0 /(?:tok|key)_[a-z0-9]{4}/g",
                },
            ],
        });
    });
    it("should tell that no rule runs if no pattern matches the lines of the keywords", () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        const scanner = createKeywordScanner(structuredClone(plan));
        const scan = (content: string) => {
            const { runsRules, lineMatched } = scanner.scan(new TextEncoder().encode(content));
            return { runsRules, lineMatched };
        };
        assert.deepStrictEqual(scan("no keyword"), { runsRules: false, lineMatched: false });
        assert.deepStrictEqual(scan("tok_ only\ntok_ab"), { runsRules: false, lineMatched: false });
        assert.deepStrictEqual(scan("tok_ only\ntok_ab12"), { runsRules: true, lineMatched: true });
        // The byte order mark is not a part of the first line
        assert.deepStrictEqual(scan("\uFEFFtok_ab12"), { runsRules: true, lineMatched: true });
    });
    it("should tell that a rule runs if the content has a keyword of a rule without patterns", () => {
        const handlerRule: SecretLintRuleCreator = {
            messages,
            meta: {
                id: "handler",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
                keywords: ["SECRET"],
            },
            create() {
                return {};
            },
        };
        const plan = getKeywordScanPlan({ config: toConfig(createRule("token", "tok_"), handlerRule) });
        assert.ok(plan);
        const scanner = createKeywordScanner(plan);
        const result = scanner.scan(new TextEncoder().encode("tok_ and secret"));
        // No pattern matches the line, but the rule runs for the whole content
        assert.strictEqual(result.runsRules, true);
        assert.strictEqual(result.lineMatched, false);
    });
    it("should return a result that does not depend on the scanner that created it", async () => {
        const config = toConfig(createRule("token", "tok_"), createRule("key", "key_"));
        const plan = getKeywordScanPlan({ config });
        assert.ok(plan);
        // A scanner of another thread has scanned other contents, so its matcher has other internal states
        // than the matcher of lintSource()
        const scanner = createKeywordScanner(structuredClone(plan));
        scanner.scan(new TextEncoder().encode("key_ab12 tok_ key_\nKEY_ TOK_ab12"));
        const content = "tok_ only\nkey_ab12 and tok_cd34\nkey_";
        const keywordScanResult = structuredClone(scanner.scan(new TextEncoder().encode(content)));
        // The result has no position of a keyword: only what any thread can read
        assert.deepStrictEqual(Object.keys(keywordScanResult).sort(), [
            "found",
            "hasKeyword",
            "lineMatched",
            "planId",
            "runsRules",
        ]);
        const expected = await lintSource({ source: createBytesSource(content), options: { config } });
        const actual = await lintSource({ source: createBytesSource(content), options: { config }, keywordScanResult });
        assert.deepStrictEqual(actual, expected);
        assert.strictEqual(actual.messages.length, 2);
    });
    it("should count the tests of lines for each pattern only with the profile", () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        const bytes = new TextEncoder().encode("tok_ only\ntok_ab\nno keyword");
        const scanner = createKeywordScanner(plan);
        scanner.scan(bytes);
        assert.deepStrictEqual(scanner.lineTests(), []);
        const profiled = createKeywordScanner(plan, { profile: true });
        profiled.scan(bytes);
        const lineTests = profiled.lineTests();
        assert.deepStrictEqual(
            lineTests.map(({ profileId, count }) => ({ profileId, count })),
            [{ profileId: "token#0 /(?:tok|key)_[a-z0-9]{4}/g", count: 2 }],
        );
        assert.ok((lineTests[0]?.duration ?? -1) >= 0);
    });
    it("should not check the lines again if the result of the scan has the check", async () => {
        const plan = getKeywordScanPlan({ config: tokenConfig });
        assert.ok(plan);
        const content = "tok_ab12";
        const scanned = createKeywordScanner(plan).scan(new TextEncoder().encode(content));
        // A changed result shows that the check of the result is used. A caller should not do it
        const result = await lintSource({
            source: createBytesSource(content),
            options: { config: tokenConfig },
            keywordScanResult: { ...scanned, lineMatched: false },
        });
        assert.deepStrictEqual(result.messages, []);
    });
    it("should ignore the result of the scan for other patterns of the same keywords", async () => {
        const otherRule = createRule("token", "tok_");
        const otherPlan = getKeywordScanPlan({
            config: toConfig({
                ...otherRule,
                patterns: otherRule.patterns?.map((pattern) => ({ ...pattern, pattern: /tok_never/g })),
            }),
        });
        assert.ok(otherPlan);
        const content = "tok_ab12";
        const keywordScanResult = createKeywordScanner(otherPlan).scan(new TextEncoder().encode(content));
        assert.strictEqual(keywordScanResult.lineMatched, false);
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
