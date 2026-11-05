import assert from "node:assert/strict";
import test from "node:test";
import { lintSource } from "@secretlint/core";
import { snapshot } from "@secretlint/tester";
import { creator as rule } from "../src/index.js";

// Synthetic values with repeated bodies; no issued credentials are used.
const prefix = "pypi-AgEIcHlwaS5vcmc";
const lint = (content: string, options = {}, locale = "en", maskSecrets = false) =>
    lintSource({
        source: { content, filePath: "test.txt", contentType: "text" },
        options: {
            config: { rules: [{ id: rule.meta.id, rule, options }] },
            locale,
            maskSecrets,
        },
    });

test("@secretlint/secretlint-rule-pypi", async (t) => {
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

test("detects complete token bodies at the supported length boundaries", async () => {
    for (const [length, expected] of [
        [49, 0],
        [50, 1],
        [1000, 1],
        [1001, 0],
    ]) {
        const result = await lint(prefix + "A".repeat(length));
        assert.equal(result.messages.length, expected, `body length ${length}`);
    }
});

test("reports multiple tokens with exact ranges and a URL-safe body", async () => {
    const token = prefix + "Az09_-".repeat(10);
    const content = `token="${token}"\nnext=${token}`;
    const result = await lint(content);
    assert.equal(result.messages.length, 2);
    for (const message of result.messages) {
        assert.equal(message.messageId, "PYPI_API_TOKEN");
        assert.equal(content.slice(...message.range), token);
    }
    assert.deepEqual(
        result.messages.map((m) => m.range[0]),
        [7, 14 + token.length],
    );
});

test("does not match embedded names or a different macaroon header", async () => {
    const token = prefix + "A".repeat(80);
    for (const value of [`word${token}`, `名前${token}`, `${token}名前`, token.replace("AgEI", "AgEJ")]) {
        assert.equal((await lint(value)).messages.length, 0);
    }
});

test("supports exact and RegExp-like allows", async () => {
    const a = prefix + "A".repeat(80);
    const b = prefix + "B".repeat(80);
    const c = prefix + "C".repeat(80);
    const result = await lint(`${a}\n${b}\n${c}`, { allows: [a, "/B{80}$/"] });
    assert.equal(result.messages.length, 1);
    assert.deepEqual(result.messages[0].data, { ID: c });
});

test("supports Japanese messages and engine masking", async () => {
    const token = prefix + "A".repeat(80);
    const result = await lint(token, {}, "ja", true);
    assert.equal(result.messages.length, 1);
    assert.match(result.messages[0].message, /がみつかりました/);
    assert.ok(!result.messages[0].message.includes(token));
    assert.ok(!JSON.stringify(result.messages[0]).includes(token));
});
