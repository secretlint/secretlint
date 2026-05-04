import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extendIgnore, createRootIgnore, isIgnoredByChain } from "../src/ignore-stack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "ignore-stack");

describe("createRootIgnore", () => {
    it("starts empty", () => {
        const chain = createRootIgnore(fixtureDir, []);
        expect(isIgnoredByChain(chain, path.join(fixtureDir, "foo.txt"), false)).toBe(false);
    });
    it("applies extra patterns", () => {
        const chain = createRootIgnore(fixtureDir, ["*.log"]);
        expect(isIgnoredByChain(chain, path.join(fixtureDir, "debug.log"), false)).toBe(true);
        expect(isIgnoredByChain(chain, path.join(fixtureDir, "main.ts"), false)).toBe(false);
    });
});

describe("extendIgnore (chain) and isIgnoredByChain", () => {
    it("inherits parent rules", async () => {
        // Root with explicit *.log; descend into parent/ which has its own
        // .gitignore (also `*.log`). Both layers contribute.
        const root = createRootIgnore(fixtureDir, ["*.log"]);
        const parentDir = path.join(fixtureDir, "parent");
        const child = await extendIgnore(root, parentDir, [".gitignore"]);
        expect(isIgnoredByChain(child, path.join(parentDir, "debug.log"), false)).toBe(true);
    });

    it("nested .gitignore rules anchor to their own directory", async () => {
        // parent/.gitignore     → `*.log`
        // parent/child/.gitignore → `build/` and `!keep-this.log`
        const parentDir = path.join(fixtureDir, "parent");
        const childDir = path.join(parentDir, "child");
        const root = createRootIgnore(parentDir, []);
        const parent = await extendIgnore(root, parentDir, [".gitignore"]);
        const chain = await extendIgnore(parent, childDir, [".gitignore"]);

        // Parent's `*.log` matches anywhere under parent.
        expect(isIgnoredByChain(chain, path.join(parentDir, "debug.log"), false)).toBe(true);
        expect(isIgnoredByChain(chain, path.join(childDir, "sub", "debug.log"), false)).toBe(true);

        // Child's `build/` matches only under the child level. (No build/
        // sibling exists in the parent fixture; the cascade test relies on
        // the path being inside child/.)
        expect(isIgnoredByChain(chain, path.join(childDir, "build"), true)).toBe(true);
        expect(isIgnoredByChain(chain, path.join(childDir, "some", "build"), true)).toBe(true);

        // Child's `!keep-this.log` un-ignores a file the parent's `*.log`
        // would otherwise have caught — but only inside the child level.
        expect(isIgnoredByChain(chain, path.join(childDir, "keep-this.log"), false)).toBe(false);
        // Outside the child level the parent rule still applies.
        expect(isIgnoredByChain(chain, path.join(parentDir, "keep-this.log"), false)).toBe(true);
    });

    it("returns parent unchanged when no ignore file present", async () => {
        const root = createRootIgnore(fixtureDir, ["*.log"]);
        const childDir = path.join(fixtureDir, "parent", "child");
        const child = await extendIgnore(root, childDir, [".no-such-file"]);
        expect(child).toBe(root);
    });

    it("supports multiple ignore file names", async () => {
        const parentDir = path.join(fixtureDir, "parent");
        const root = createRootIgnore(parentDir, []);
        const chain = await extendIgnore(root, parentDir, [".secretlintignore", ".gitignore"]);
        expect(isIgnoredByChain(chain, path.join(parentDir, "debug.log"), false)).toBe(true);
    });

    it("does not skip the level for paths inside a directory whose name starts with `..`", async () => {
        // Regression: the previous guard `rel.startsWith("..")` also skipped
        // valid relative paths like `..config/file` (not the `..` parent
        // directive). The level should still apply because the path is
        // inside the chain's directory.
        const root = createRootIgnore(fixtureDir, ["..config"]);
        // path.relative(fixtureDir, fixtureDir/..config/file) === "..config/file"
        // — starts with `..` but is a real descent, not a parent traversal.
        expect(isIgnoredByChain(root, path.join(fixtureDir, "..config", "file"), false)).toBe(true);
    });

    it("still skips the level when the path is above the chain dir", async () => {
        // Sanity: `path.relative(parent, /sibling/x)` returns
        // "../sibling/x" — that IS a parent-traversal and must skip.
        const parentDir = path.join(fixtureDir, "parent");
        const root = createRootIgnore(parentDir, ["sibling"]);
        expect(isIgnoredByChain(root, path.join(fixtureDir, "sibling", "x"), false)).toBe(false);
    });
});
