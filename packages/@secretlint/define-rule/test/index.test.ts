import assert from "node:assert";
import { lintSource } from "@secretlint/core";
import type { SecretLintCoreConfig, SecretLintRuleCreator } from "@secretlint/types";
import { defineRule } from "../src/index.js";

const messages = {
    TOKEN: {
        en: (props: { TOKEN: string }) => `found token: ${props.TOKEN}`,
    },
    KEY: {
        en: (props: { KEY: string }) => `found key: ${props.KEY}`,
    },
};
type Options = { allows?: string[] };
const createRule = () => {
    return defineRule<Options>({
        messages,
        meta: {
            id: "example",
            recommended: true,
            type: "scanner",
            supportedContentTypes: ["text"],
        },
        patterns: [
            {
                pattern: /tok_[a-z0-9]{4}/,
                keywords: ["tok_"],
                scope: "line",
                report(match, context) {
                    if (context.options.allows?.includes(match.text)) {
                        return;
                    }
                    const t = context.createTranslator(messages);
                    context.report({ message: t("TOKEN", { TOKEN: match.text }), range: match.range });
                },
            },
            {
                pattern: /BEGIN KEY\n(?<body>[a-z]+)\nEND KEY/g,
                keywords: ["BEGIN KEY"],
                report(match, context) {
                    const t = context.createTranslator(messages);
                    context.report({ message: t("KEY", { KEY: match.groups?.body ?? "" }), range: match.range });
                },
            },
        ],
    });
};
/**
 * A rule without `patterns` and `meta.keywords`, as a secretlint that does not support `patterns` uses it
 */
const toLegacyRule = <T>(rule: SecretLintRuleCreator<T>): SecretLintRuleCreator<T> => {
    return { messages: rule.messages, meta: { ...rule.meta, keywords: undefined }, create: rule.create };
};
const lint = async (content: string, rule: SecretLintRuleCreator<Options>, options?: Options) => {
    const config: SecretLintCoreConfig = { rules: [{ id: rule.meta.id, rule, options }] };
    const result = await lintSource({
        source: { content, filePath: "/path/to/file.txt", contentType: "text" },
        options: { config },
    });
    return result.messages;
};

describe("defineRule", () => {
    it("should create meta.keywords from the keywords of the patterns", () => {
        const rule = createRule();
        assert.deepStrictEqual(rule.meta.keywords, ["tok_", "BEGIN KEY"]);
        assert.strictEqual(rule.patterns?.length, 2);
    });
    it("should not create meta.keywords if a pattern has no keywords", () => {
        const rule = defineRule({
            messages,
            meta: { id: "example", recommended: true, type: "scanner", supportedContentTypes: ["text"] },
            patterns: [
                { pattern: /a/g, keywords: ["a"], report() {} },
                { pattern: /b/g, report() {} },
            ],
        });
        assert.strictEqual(rule.meta.keywords, undefined);
    });
    it("should keep meta.keywords of the definition", () => {
        const rule = defineRule({
            messages,
            meta: {
                id: "example",
                recommended: true,
                type: "scanner",
                supportedContentTypes: ["text"],
                keywords: ["x"],
            },
            patterns: [{ pattern: /a/g, keywords: ["a"], report() {} }],
        });
        assert.deepStrictEqual(rule.meta.keywords, ["x"]);
    });
    it("should report the same messages with patterns and with create()", async () => {
        const rule = createRule();
        const content = "tok_ab12 tok_cd34\nx\nBEGIN KEY\nabc\nEND KEY\ntok_ef56";
        for (const options of [undefined, {}, { allows: ["tok_cd34"] }]) {
            const messagesOfPatterns = await lint(content, rule, options);
            const messagesOfCreate = await lint(content, toLegacyRule(rule), options);
            assert.deepStrictEqual(messagesOfCreate, messagesOfPatterns);
            assert.deepStrictEqual(
                messagesOfPatterns.map((message) => message.message),
                options?.allows
                    ? ["found token: tok_ab12", "found key: abc", "found token: tok_ef56"]
                    : ["found token: tok_ab12", "found token: tok_cd34", "found key: abc", "found token: tok_ef56"],
            );
        }
    });
});
