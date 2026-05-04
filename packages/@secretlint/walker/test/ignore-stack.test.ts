import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extendIgnore, createRootIgnore } from "../src/ignore-stack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "ignore-stack");

describe("createRootIgnore", () => {
    it("starts empty", () => {
        const ig = createRootIgnore([]);
        expect(ig.ignores("foo.txt")).toBe(false);
    });
    it("applies extra patterns", () => {
        const ig = createRootIgnore(["*.log"]);
        expect(ig.ignores("debug.log")).toBe(true);
        expect(ig.ignores("main.ts")).toBe(false);
    });
});

describe("extendIgnore", () => {
    it("inherits parent rules", async () => {
        const root = createRootIgnore(["*.log"]);
        const parentDir = path.join(fixtureDir, "parent");
        // walkRoot = parentDir → patterns from parentDir/.gitignore are added as-is.
        const child = await extendIgnore(root, parentDir, parentDir, [".gitignore"]);
        expect(child.ignores("debug.log")).toBe(true);
    });

    it("rewrites a child .gitignore's patterns to be anchored at the child's relative dir", async () => {
        const root = createRootIgnore([]);
        const parentDir = path.join(fixtureDir, "parent");
        const childDir = path.join(parentDir, "child");
        // walkRoot stays at parentDir for both calls, mirroring how the
        // walker uses the same `ignoreRoot` across the cascade.
        const parent = await extendIgnore(root, parentDir, parentDir, [".gitignore"]);
        // parent/.gitignore (`*.log`) is non-rooted at relDir="" → matches at any depth.
        expect(parent.ignores("debug.log")).toBe(true);
        expect(parent.ignores("child/sub/debug.log")).toBe(true);

        const child = await extendIgnore(parent, childDir, parentDir, [".gitignore"]);
        // child/.gitignore says `build/` and `!keep-this.log`. After rewriting
        // these are anchored to `child/`:
        //   build/         → child/**/build/
        //   !keep-this.log → !child/**/keep-this.log
        expect(child.ignores("child/build/")).toBe(true);
        expect(child.ignores("child/some/dir/build/")).toBe(true);
        expect(child.ignores("build/")).toBe(false); // not under child/
        expect(child.ignores("debug.log")).toBe(true); // parent rule still applies
        expect(child.ignores("child/keep-this.log")).toBe(false); // negation un-ignores under child/
    });

    it("returns parent unchanged when no ignore file present", async () => {
        const root = createRootIgnore(["*.log"]);
        const childDir = path.join(fixtureDir, "parent", "child");
        const child = await extendIgnore(root, childDir, fixtureDir, [".no-such-file"]);
        expect(child).toBe(root);
    });

    it("supports multiple ignore file names", async () => {
        const root = createRootIgnore([]);
        const parentDir = path.join(fixtureDir, "parent");
        const ig = await extendIgnore(root, parentDir, parentDir, [".secretlintignore", ".gitignore"]);
        expect(ig.ignores("debug.log")).toBe(true);
    });
});
