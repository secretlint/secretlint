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
        const child = await extendIgnore(root, path.join(fixtureDir, "parent"), [".gitignore"]);
        expect(child.ignores("debug.log")).toBe(true);
    });

    it("merges this directory's .gitignore on top", async () => {
        const root = createRootIgnore([]);
        const parent = await extendIgnore(root, path.join(fixtureDir, "parent"), [".gitignore"]);
        expect(parent.ignores("debug.log")).toBe(true); // *.log from parent/.gitignore
        const child = await extendIgnore(parent, path.join(fixtureDir, "parent", "child"), [".gitignore"]);
        expect(child.ignores("build/")).toBe(true); // child/.gitignore
        expect(child.ignores("debug.log")).toBe(true); // inherited
        expect(child.ignores("keep-this.log")).toBe(false); // overridden by !keep-this.log
    });

    it("returns parent unchanged when no ignore file present", async () => {
        const root = createRootIgnore(["*.log"]);
        const child = await extendIgnore(root, path.join(fixtureDir, "parent", "child"), [".no-such-file"]);
        expect(child).toBe(root);
    });

    it("supports multiple ignore file names", async () => {
        const root = createRootIgnore([]);
        const ig = await extendIgnore(root, path.join(fixtureDir, "parent"), [".secretlintignore", ".gitignore"]);
        expect(ig.ignores("debug.log")).toBe(true);
    });
});
