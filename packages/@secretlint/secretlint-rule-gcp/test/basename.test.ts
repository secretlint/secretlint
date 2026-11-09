import { basename } from "../src/basename.js";
import assert from "node:assert";
import test from "node:test";

test("basename handles POSIX and Windows paths", () => {
    assert.strictEqual(basename("/Users/me/project/sa-key.json"), "sa-key.json");
    assert.strictEqual(basename("C:\\Users\\me\\project\\sa-key.json"), "sa-key.json");
});
