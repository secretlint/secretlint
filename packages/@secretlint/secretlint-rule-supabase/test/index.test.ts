import assert from "node:assert/strict";
import test from "node:test";
import { lintSource } from "@secretlint/core";
import { snapshot } from "@secretlint/tester";
import { creator as rule, type Options } from "../src/index.js";

const lint = (content: string, options: Options = {}, maskSecrets = false, locale: "en" | "ja" = "en") =>
    lintSource({
        source: { content, filePath: "/test.txt", contentType: "text", ext: ".txt" },
        options: { config: { rules: [{ id: rule.meta.id, rule, options }] }, maskSecrets, locale },
    });

for (const prefix of ["sbp_", "sbp_oauth_", "sbp_v0_"]) {
    const token = prefix + "0".repeat(40);
    test(`detects ${prefix} tokens with exact source ranges`, async () => {
        const { messages } = await lint(`token="${token}";`);
        assert.equal(messages.length, 1);
        assert.equal(messages[0].messageId, "SUPABASE_PERSONAL_ACCESS_TOKEN");
        assert.deepEqual(messages[0].range, [7, 7 + token.length]);
    });
    test(`masks ${prefix} token values in diagnostics`, async () => {
        const { messages } = await lint(token, {}, true);
        assert.equal(messages.length, 1);
        assert.ok(!JSON.stringify(messages).includes(token));
        assert.match(messages[0].message, /\*+/);
    });
    test(`supports literal and regexp allowlists for ${prefix}`, async () => {
        assert.equal((await lint(token, { allows: [token] })).messages.length, 0);
        assert.equal((await lint(token, { allows: ["/^sbp_/"] })).messages.length, 0);
        assert.equal((await lint(token, { allows: ["unrelated"] })).messages.length, 1);
    });
    test(`rejects incomplete and overlong ${prefix} tokens`, async () => {
        const { messages } = await lint([prefix, token.slice(0, -1), token + "0", prefix + "0".repeat(80)].join("\n"));
        assert.equal(messages.length, 0);
    });
    test(`does not match ${prefix} inside longer identifiers`, async () => {
        const { messages } = await lint(
            ["prefix" + token, "日" + token, token + "suffix", token + "_suffix", token + "日"].join("\n"),
        );
        assert.equal(messages.length, 0);
    });
    test(`accepts all lowercase hexadecimal characters for ${prefix}`, async () => {
        const hexToken = prefix + "0123456789abcdef".repeat(2) + "01234567";
        assert.equal((await lint(hexToken)).messages.length, 1);
        assert.equal((await lint(hexToken.toUpperCase())).messages.length, 0);
        assert.equal((await lint(prefix + "A".repeat(40))).messages.length, 0);
        assert.equal((await lint(prefix + "g".repeat(40))).messages.length, 0);
    });
}

test("reports multiple tokens without suppressing non-allowlisted variants", async () => {
    const personal = "sbp_" + "0".repeat(40);
    const oauth = "sbp_oauth_" + "0".repeat(40);
    const versioned = "sbp_v0_" + "0".repeat(40);
    const { messages } = await lint(`${personal}\n${oauth}\n${versioned}`, { allows: [personal] });
    assert.equal(messages.length, 2);
    assert.deepEqual(
        messages.map(({ range }) => range),
        [
            [personal.length + 1, personal.length + 1 + oauth.length],
            [personal.length + oauth.length + 2, personal.length + oauth.length + 2 + versioned.length],
        ],
    );
});

test("handles punctuation, Unicode whitespace, and repeated occurrences", async () => {
    const token = "sbp_" + "0".repeat(40);
    const { messages } = await lint(`(${token}),\u3000${token};`);
    assert.equal(messages.length, 2);
});

test("provides a Japanese diagnostic", async () => {
    const { messages } = await lint("sbp_" + "0".repeat(40), {}, true, "ja");
    assert.equal(messages.length, 1);
    assert.match(messages[0].message, /がみつかりました/);
});

test("ignores other Supabase credential types", async () => {
    const { messages } = await lint(
        ["sb_publishable_" + "0".repeat(40), "sb_secret_" + "0".repeat(40), "sbp_oauth_v0_" + "0".repeat(40)].join(
            "\n",
        ),
    );
    assert.equal(messages.length, 0);
});

test("handles large inputs with many overlong near-matches", { timeout: 5000 }, async () => {
    const { messages } = await lint(("sbp_oauth_" + "0".repeat(41) + "\n").repeat(10000));
    assert.equal(messages.length, 0);
});

test("@secretlint/secretlint-rule-supabase snapshots", async (t) => {
    await snapshot({
        defaultConfig: { rules: [{ id: rule.meta.id, rule, options: {} }] },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, run) =>
        t.test(name, async (context) => {
            if ((await run()) === "skip") context.skip();
        }),
    );
});
