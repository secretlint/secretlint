import assert from "node:assert/strict";
import { lintSource } from "@secretlint/core";

import { creator as rule } from "../src/index.js";

import test from "node:test";
test("@secretlint/secretlint-rule-github", async (t) => {
    const snapshot = (await import("@secretlint/tester")).snapshot;
    await snapshot({
        defaultConfig: {
            rules: [
                {
                    id: "@secretlint/secretlint-rule-github",
                    rule,
                    options: {},
                },
            ],
        },
        updateSnapshot: !!process.env.UPDATE_SNAPSHOT,
        snapshotDirectory: new URL("snapshots", import.meta.url),
    }).forEach((name, test) => {
        return t.test(name, async (context) => {
            const status = await test();
            if (status === "skip") {
                context.skip();
            }
        });
    });
});

const lint = (content: string, options: { allows?: string[]; checkChecksum?: boolean } = {}, maskSecrets = false) =>
    lintSource({
        source: { content, filePath: "/test.txt", contentType: "text", ext: ".txt" },
        options: { config: { rules: [{ id: rule.meta.id, rule, options }] }, maskSecrets },
    });

// Synthetic vectors cross-checked with Python's zlib.crc32 and the issue's Base62 alphabet.
const checksumVectors = [
    ["0".repeat(30), "2C8GjS"],
    ["A".repeat(30), "0uCPlr"],
    ["a".repeat(30), "1yLcDB"],
    ["1234567890".repeat(3), "2PDSiF"],
] as const;

for (const prefix of ["ghp", "gho", "ghu", "ghs", "ghr"]) {
    test(`checksum validation keeps valid ${prefix} tokens and their exact range`, async () => {
        for (const [entropy, checksum] of checksumVectors) {
            const token = `${prefix}_${entropy}${checksum}`;
            const { messages } = await lint(`token="${token}";`, { checkChecksum: true });
            assert.equal(messages.length, 1);
            assert.deepEqual(messages[0].range, [7, 7 + token.length]);
        }
    });

    test(`checksum validation rejects corrupted ${prefix} entropy and checksums`, async () => {
        const entropy = "0".repeat(30);
        for (const suffix of ["000000", "2C8GjT", "2c8GjS", "zzzzzz"]) {
            assert.equal((await lint(`${prefix}_${entropy}${suffix}`, { checkChecksum: true })).messages.length, 0);
        }
        assert.equal((await lint(`${prefix}_1${entropy.slice(1)}2C8GjS`, { checkChecksum: true })).messages.length, 0);
    });
}

test("checksum validation is disabled by default and when explicitly false", async () => {
    const token = "ghp_" + "0".repeat(36);
    assert.equal((await lint(token)).messages.length, 1);
    assert.equal((await lint(token, { checkChecksum: false })).messages.length, 1);
    assert.equal((await lint(token, { checkChecksum: true })).messages.length, 0);
});

test("a leading-zero checksum must retain its six-character encoding", async () => {
    const entropy = "A".repeat(30);
    assert.equal((await lint(`ghp_${entropy}0uCPlr`, { checkChecksum: true })).messages.length, 1);
    assert.equal((await lint(`ghp_${entropy}uCPlr0`, { checkChecksum: true })).messages.length, 0);
});

test("checksum validation preserves fine-grained and JWT-style installation token detection", async () => {
    const fineGrained = "github_pat_" + "0".repeat(82);
    const installation = "ghs_1_" + "A".repeat(10) + "." + "B".repeat(10) + "." + "C".repeat(12);
    assert.equal(installation.length, 40);
    for (const token of [fineGrained, installation]) {
        const { messages } = await lint(token, { checkChecksum: true });
        assert.equal(messages.length, 1);
        assert.deepEqual(messages[0].range, [0, token.length]);
    }
});

test("checksum validation preserves token shapes outside the documented Base62 format", async () => {
    const token = "ghp_" + "_".repeat(36);
    assert.equal((await lint(token, { checkChecksum: true })).messages.length, 1);
});

test("checksum validation respects allowlists for valid tokens", async () => {
    const token = "ghp_" + "0".repeat(30) + "2C8GjS";
    assert.equal((await lint(token, { checkChecksum: true, allows: [token] })).messages.length, 0);
    assert.equal((await lint(token, { checkChecksum: true, allows: ["/^ghp_0/"] })).messages.length, 0);
});

test("checksum validation preserves masking", async () => {
    const token = "ghp_" + "0".repeat(30) + "2C8GjS";
    const { messages } = await lint(token, { checkChecksum: true }, true);
    assert.equal(messages.length, 1);
    assert.ok(!JSON.stringify(messages).includes(token));
    assert.match(messages[0].message, /\*+/);
});

test("checksum validation handles many matching placeholders", { timeout: 5000 }, async () => {
    const token = "ghp_" + "0".repeat(36);
    assert.equal((await lint((token + "\n").repeat(10000), { checkChecksum: true })).messages.length, 0);
});
