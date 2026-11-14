import assert from "node:assert";
import type { SecretLintCoreConfig, SecretLintRawSource, SecretLintRuleCreator } from "@secretlint/types";
import { lintSource } from "../src/index.js";
import { getLintPlan, getPlanView } from "../src/LintPlan.js";
import { creator as rulePattern, type Options } from "../src/builtin/rules/pattern/index.js";

// A rule with keywords, so that the plan has a keyword matcher. It does not report.
const keywordRule: SecretLintRuleCreator = {
    messages: {},
    meta: { id: "keyword-rule", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
    patterns: [{ pattern: /tok_[a-z0-9]{4}/, keywords: ["tok_"], report() {} }],
};
const toConfig = (options?: Options): SecretLintCoreConfig => {
    return {
        rules: [
            { id: rulePattern.meta.id, rule: rulePattern, options },
            { id: keywordRule.meta.id, rule: keywordRule },
        ],
    };
};
const textView = (options?: Options) => getPlanView(getLintPlan(toConfig(options), "en"), "text");
/**
 * A source with UTF-8 bytes, as the Node.js engine creates. `content` throws, so a test fails if the content is decoded.
 */
const bytesSource = (filePath: string, content: string, { decodable = true } = {}): SecretLintRawSource => {
    return {
        filePath,
        contentType: "text",
        contentBytes: new TextEncoder().encode(content),
        get content() {
            if (!decodable) {
                throw new Error("the content should not be decoded");
            }
            return content;
        },
    };
};
const lint = async (options: Options | undefined, source: SecretLintRawSource) => {
    const result = await lintSource({ source, options: { config: toConfig(options) } });
    return result.messages.map((message) => message.message);
};

describe("user-defined patterns of @secretlint/secretlint-rule-pattern", () => {
    it("adds nothing to the plan without options, as `secretlint --init` writes it", async () => {
        const view = textView();
        assert.deepStrictEqual(
            view.rules.find((rule) => rule.rule.descriptorRule.id === rulePattern.meta.id)?.patterns,
            [],
        );
        assert.strictEqual(view.hasAlwaysPattern, false);
        assert.strictEqual(view.hasAlwaysRule, false);
        // the file has no keyword, so its content is not decoded
        assert.deepStrictEqual(
            await lint(undefined, bytesSource("/a.txt", "password=secret", { decodable: false })),
            [],
        );
        assert.strictEqual(textView({ patterns: [] }).hasAlwaysPattern, false);
    });
    it("runs a pattern only on a file that contains its keywords", async () => {
        const options: Options = {
            patterns: [{ name: "internal token", patterns: ["/itk_[a-z0-9]{8}/"], keywords: ["ITK_"] }],
        };
        assert.strictEqual(textView(options).hasAlwaysPattern, false);
        assert.deepStrictEqual(await lint(options, bytesSource("/a.txt", "x = itk_abcd1234")), [
            "found matching internal token: itk_abcd1234",
        ]);
        assert.deepStrictEqual(await lint(options, bytesSource("/b.txt", "nothing here", { decodable: false })), []);
    });
    it("finds keywords in a pattern without `keywords`", async () => {
        const options: Options = { patterns: [{ name: "password", patterns: ["/password\\s*=\\s*\\S+/i"] }] };
        const view = textView(options);
        assert.strictEqual(view.hasAlwaysPattern, false);
        assert.ok(view.matcher?.keywords.includes("password"));
        assert.deepStrictEqual(await lint(options, bytesSource("/a.txt", "PASSWORD = hunter2")), [
            "found matching password: PASSWORD = hunter2",
        ]);
        assert.deepStrictEqual(await lint(options, bytesSource("/b.txt", "user = azu", { decodable: false })), []);
    });
    it("runs a pattern without keywords on every file", async () => {
        const options: Options = { patterns: [{ name: "hex", patterns: ["/[0-9a-f]{8}/"] }] };
        const view = textView(options);
        assert.strictEqual(view.hasAlwaysPattern, true);
        assert.ok(view.rules.some((rule) => rule.patterns?.some((p) => p.profileId.endsWith("hex (no keywords)"))));
        assert.deepStrictEqual(await lint(options, bytesSource("/a.txt", "id: deadbeef")), [
            "found matching hex: deadbeef",
        ]);
    });
    it("runs a pattern on every file with `keywords: []`", () => {
        assert.strictEqual(
            textView({ patterns: [{ name: "password", patterns: ["/password/"], keywords: [] }] }).hasAlwaysPattern,
            true,
        );
    });
    it("runs a pattern with `filePathGlobs` only for the matching paths", async () => {
        const options: Options = {
            patterns: [{ name: "env", filePathGlobs: ["**/.env"], patterns: ["/API_KEY=\\w+/"] }],
        };
        assert.deepStrictEqual(await lint(options, bytesSource("/repo/.env", "API_KEY=abc")), [
            "found matching env: API_KEY=abc",
        ]);
        assert.deepStrictEqual(await lint(options, bytesSource("/repo/a.txt", "API_KEY=abc")), []);
    });
    it("reports a file by its path with only `filePathGlobs`, without keywords", async () => {
        const options: Options = { patterns: [{ name: "env files", filePathGlobs: ["**/.env"] }] };
        const view = textView(options);
        assert.strictEqual(view.hasAlwaysPattern, false);
        assert.strictEqual(view.pathPatterns.length, 1);
        assert.deepStrictEqual(await lint(options, bytesSource("/repo/.env", "A=1")), [
            "found matching env files: .env",
        ]);
        assert.deepStrictEqual(await lint(options, bytesSource("/repo/a.txt", "A=1", { decodable: false })), []);
    });
    it("does not report a match in `allows`", async () => {
        const options: Options = {
            allows: ["/dummy/"],
            patterns: [{ name: "password", patterns: ["/password=\\w+/"], allows: ["/test/"] }],
        };
        assert.deepStrictEqual(
            await lint(options, bytesSource("/a.txt", "password=dummy\npassword=test\npassword=real")),
            ["found matching password: password=real"],
        );
    });
    it("runs a pattern only where the guard of a keyword is met", async () => {
        const options: Options = {
            patterns: [
                {
                    name: "internal key",
                    patterns: ["/00[A-Za-z0-9]{8}/"],
                    keywords: [{ keyword: "00", after: "[A-Za-z0-9]{8,}" }],
                },
            ],
        };
        // "00" is in the file, but no place meets the guard, so the content is not decoded
        assert.deepStrictEqual(await lint(options, bytesSource("/a.txt", "100\n00:00:00", { decodable: false })), []);
        assert.deepStrictEqual(await lint(options, bytesSource("/a.txt", "100\nkey = 00abcdEF12")), [
            "found matching internal key: 00abcdEF12",
        ]);
    });
    it("throws for a keyword object that is not supported, with the name of the entry", () => {
        const view = (keyword: unknown) => {
            return textView({
                patterns: [{ name: "bad", patterns: ["/00[a-z]{8}/"], keywords: [keyword] as string[] }],
            });
        };
        assert.throws(() => view({ keyword: "00", after: "[a-z]{8}" }), /Pattern "bad" has a keyword.*Write `\{8,\}`/s);
        assert.throws(() => view({ keyword: "00" }), /Pattern "bad" has a keyword.*`after` is required/s);
        assert.throws(() => view({ keyword: "00", after: "[a-z]{8,}", caseSensitive: true }), /unknown properties/);
        assert.throws(() => view(null), /Pattern "bad" has a keyword that is not a non-empty ASCII string/);
    });
    it("throws for a keyword that is not a non-empty ASCII string", () => {
        for (const keywords of [[""], ["パスワード"], "password"]) {
            assert.throws(
                () =>
                    textView({ patterns: [{ name: "bad", patterns: ["/password/"], keywords: keywords as string[] }] }),
                /Pattern "bad" has/,
            );
            // an entry with only `filePathGlobs` does not use keywords, but they are checked too
            assert.throws(
                () =>
                    textView({
                        patterns: [{ name: "bad", filePathGlobs: ["**/.env"], keywords: keywords as string[] }],
                    }),
                /Pattern "bad" has/,
            );
        }
    });
    it("throws for an entry without patterns and filePathGlobs", () => {
        assert.throws(() => textView({ patterns: [{ name: "empty" }] }), /must have either/);
    });
    it("lets the keyword scan of a worker skip files without keywords, unless a path pattern is enabled", () => {
        assert.strictEqual(textView().keywordScanPlan?.requiresKeyword, true);
        const withKeywords = textView({ patterns: [{ name: "password", patterns: ["/password=\\w+/"] }] });
        assert.strictEqual(withKeywords.keywordScanPlan?.requiresKeyword, true);
        const passwordIndex = withKeywords.keywordScanPlan?.keywords.indexOf("password=") ?? -1;
        assert.ok(withKeywords.keywordScanPlan?.ruleCheck.contentKeywordIndexes.includes(passwordIndex));
        // The scan does not check the path, so every file goes to the lint
        assert.strictEqual(
            textView({ patterns: [{ name: "env files", filePathGlobs: ["**/.env"] }] }).keywordScanPlan
                ?.requiresKeyword,
            false,
        );
    });
});
