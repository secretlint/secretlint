import assert from "node:assert/strict";
import test from "node:test";
import { lintSource } from "@secretlint/core";
import { snapshot } from "@secretlint/tester";
import { creator as rule } from "../src/index.js";

const tokenTypes = [
    ["dop_v1_", "DIGITALOCEAN_PAT"],
    ["doo_v1_", "DIGITALOCEAN_OAUTH_TOKEN"],
    ["dor_v1_", "DIGITALOCEAN_OAUTH_REFRESH_TOKEN"],
] as const;
const lint = (content: string, options = {}, locale = "en", maskSecrets = false) =>
    lintSource({
        source: { content, filePath: "test.txt", contentType: "text" },
        options: { config: { rules: [{ id: rule.meta.id, rule, options }] }, locale, maskSecrets },
    });

test("@secretlint/secretlint-rule-digitalocean", async (t) => {
    await snapshot({
        defaultConfig: { rules: [{ id: rule.meta.id, rule, options: {} }] },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, run) =>
        t.test(name, async (context) => {
            const status = await run();
            if (status === "skip") {
                context.skip();
            }
        }),
    );
});

for (const [prefix, messageId] of tokenTypes) {
    test(`${messageId}: detects a token and reports its exact range`, async () => {
        // Synthetic repeated body, never an issued credential.
        const token = prefix + "0123456789abcdef".repeat(4);
        const content = `token="${token}"`;
        const result = await lint(content);
        assert.equal(result.messages.length, 1);
        assert.equal(result.messages[0].messageId, messageId);
        assert.deepEqual(result.messages[0].range, [7, 7 + token.length]);
        assert.deepEqual(result.messages[0].data, { ID: token });
    });

    test(`${messageId}: rejects truncated, overlong, and invalid bodies`, async () => {
        const token = prefix + "a".repeat(64);
        for (const content of [
            prefix + "a".repeat(63),
            token + "0",
            prefix + "A".repeat(64),
            prefix + "g".repeat(64),
            `word${token}`,
            `名前${token}`,
            `${token}word`,
            `${token}名前`,
            `${token}_suffix`,
            token.replace("v1", "v2"),
        ]) {
            assert.equal((await lint(content)).messages.length, 0, content);
        }
    });
}

test("supports allows without suppressing another token type", async () => {
    const tokens = tokenTypes.map(([prefix]) => prefix + "a".repeat(64));
    const result = await lint(tokens.join("\n"), { allows: [tokens[0], "/^doo_v1_/"] });
    assert.equal(result.messages.length, 1);
    assert.equal(result.messages[0].messageId, "DIGITALOCEAN_OAUTH_REFRESH_TOKEN");
});

test("supports Japanese messages and engine masking for all types", async () => {
    const tokens = tokenTypes.map(([prefix]) => prefix + "a".repeat(64));
    const result = await lint(tokens.join("\n"), {}, "ja", true);
    assert.equal(result.messages.length, 3);
    for (const message of result.messages) {
        assert.match(message.message, /がみつかりました/);
        for (const token of tokens) {
            assert.ok(!JSON.stringify(message).includes(token));
        }
    }
});
