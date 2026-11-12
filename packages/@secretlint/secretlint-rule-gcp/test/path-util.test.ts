import { basename } from "../src/path-util.js";
import test from "node:test";
import assert from "node:assert";

test("basename: POSIX paths are split only by /", () => {
    assert.strictEqual(basename("/repo/keys/input.p12"), "input.p12");
    assert.strictEqual(basename("/repo/keys/"), "keys");
    // a backslash is a character of the file name on POSIX
    assert.strictEqual(basename("/repo/staging\\input.p12"), "staging\\input.p12");
    assert.strictEqual(basename("input.p12"), "input.p12");
});

test("basename: Windows paths are split by \\", () => {
    assert.strictEqual(basename("C:\\repo\\keys\\input.p12"), "input.p12");
    assert.strictEqual(basename("C:\\repo\\keys\\"), "keys");
});
