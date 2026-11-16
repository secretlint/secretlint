import assert from "node:assert";
import { describe, it } from "vitest";
import { creator as rule } from "../../src/builtin/rules/slack/index.js";

// The Slack token pattern runs on whole lines that contain a keyword.
// These lines repeat a prefix or a section many times and contain no token.
// A pattern that backtracks over the rest of the line from each prefix takes seconds on them.
const slackTokenPattern = () => {
    const pattern = rule.patterns?.[0]?.pattern;
    assert.ok(pattern instanceof RegExp);
    return new RegExp(pattern.source, pattern.flags);
};

describe("slack token pattern", () => {
    const lines = {
        "repeated prefixes": "xapp-".repeat(32000) + "kernel",
        "repeated prefixes with a version": "xapp-1-".repeat(32000) + "kernel",
        "repeated prefixes with a digit section": "xapp-11-".repeat(32000) + "!",
        "repeated digit sections": "xapp-" + "11-".repeat(64000) + "!",
        "repeated mixed sections": "xapp-" + "a-11-".repeat(64000) + "!",
    };
    for (const [name, line] of Object.entries(lines)) {
        it(`finds no token in a line of ${name} in time`, () => {
            const pattern = slackTokenPattern();
            const start = performance.now();
            const matches = [...line.matchAll(pattern)];
            const elapsed = performance.now() - start;
            assert.strictEqual(matches.length, 0);
            // A linear scan takes a few milliseconds; a quadratic one takes seconds.
            assert.ok(elapsed < 1000, `took ${elapsed}ms`);
        });
    }
});
