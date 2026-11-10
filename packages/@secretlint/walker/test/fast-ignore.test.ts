import { describe, it, expect } from "vitest";
import ignore from "ignore";
import { compileFastIgnore, type FastIgnore } from "../src/fast-ignore.js";

/**
 * node-ignore's `test()` also tests the parent directories of the path.
 * The walker does not descend into an ignored directory, so the fast matcher tests only the path.
 * To compare the two, test the parents with the fast matcher too.
 */
const testWithParents = (matcher: FastIgnore, relPath: string) => {
    const segments = relPath.replace(/\/$/, "").split("/");
    for (let index = 1; index < segments.length; index++) {
        const parent = `${segments.slice(0, index).join("/")}/`;
        if (matcher.test(parent).ignored) return { ignored: true, unignored: false };
    }
    return matcher.test(relPath);
};

const expectSameAsNodeIgnore = (rules: string[], paths: string[]) => {
    const fast = compileFastIgnore([rules.join("\n")]);
    expect(fast, `rules should be supported: ${JSON.stringify(rules)}`).not.toBeNull();
    const reference = ignore().add(rules);
    for (const relPath of paths) {
        const { ignored, unignored } = reference.test(relPath);
        expect(testWithParents(fast as FastIgnore, relPath), `${JSON.stringify(rules)} ${relPath}`).toEqual({
            ignored,
            unignored,
        });
    }
};

const PATHS = [
    "a",
    "a/",
    "a/b",
    "a/b/",
    "a/b/c",
    "a/b/c/",
    "a/x/b",
    "a/x/y/b",
    "x/a",
    "x/a/",
    "x/a/b",
    "b",
    "b/",
    "c.log",
    "x/c.log",
    "x/c.log/",
    ".log",
    "A.LOG",
    "x/C.Log",
    "node_modules/",
    "x/node_modules/",
    "x/node_modules/y",
    "Node_Modules/",
    "npm-debug.log",
    "npm-debug.log.1",
    "x/npm-debug.log.1",
    "build/Release",
    "build/Release/",
    "build/Release/x",
    "x/build/Release",
    ".idea/workspace.xml",
    ".idea/x/workspace.xml",
    ".idea/x/y/workspace.xml",
    "x/.idea/workspace.xml",
    "abc",
    "aXbXc",
    "ab",
    "abbc",
    "a.b.c",
    "lib/",
    "lib/index.js",
    "src/lib/",
    "src/lib/index.js",
];

describe("compileFastIgnore", () => {
    it("matches the same paths as node-ignore for real-world rules", () => {
        expectSameAsNodeIgnore(
            [
                "node_modules",
                "*.log",
                "/lib",
                "coverage/",
                "build/Release",
                "npm-debug.log*",
                ".idea/**/workspace.xml",
                "!x/c.log",
            ],
            PATHS,
        );
    });
    it("matches the same paths as node-ignore for each rule form", () => {
        const rules = [
            "a",
            "a/",
            "/a",
            "/a/",
            "a/b",
            "a/b/",
            "/a/b",
            "a/*",
            "a/*/b",
            "a/**",
            "a/**/b",
            "**/a",
            "**/a/",
            "**/a/b",
            "**/b",
            "*",
            "*/",
            "*.log",
            "*.LOG",
            "a*",
            "*c",
            "a*c",
            "a*b*c",
            "*b*",
            "x/*.log",
            "NODE_MODULES",
            "lib/",
            "src/lib",
        ];
        for (const rule of rules) {
            expectSameAsNodeIgnore([rule], PATHS);
            expectSameAsNodeIgnore([rule, `!${rule}`], PATHS);
            expectSameAsNodeIgnore([`!${rule}`, rule], PATHS);
            expectSameAsNodeIgnore(["*", `!${rule}`], PATHS);
        }
    });
    it("matches the same paths as node-ignore for random rule sets", () => {
        const parts = ["a", "b", "x", "*", "**", "*.log", "a*", "node_modules", "lib"];
        let seed = 1;
        const random = (n: number) => {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            return seed % n;
        };
        for (let count = 0; count < 300; count++) {
            const rules: string[] = [];
            const ruleCount = 1 + random(4);
            for (let r = 0; r < ruleCount; r++) {
                const segmentCount = 1 + random(3);
                const segments = Array.from({ length: segmentCount }, () => parts[random(parts.length)] as string);
                let rule = segments.join("/");
                if (rule === "**") continue;
                if (random(4) === 0) rule = `/${rule}`;
                if (random(4) === 0) rule = `${rule}/`;
                if (random(3) === 0) rule = `!${rule}`;
                rules.push(rule);
            }
            if (rules.length === 0) continue;
            expectSameAsNodeIgnore(rules, PATHS);
        }
    });
    it("skips blank lines and comments, and handles CRLF", () => {
        expectSameAsNodeIgnore(["# comment", "", "a\r", "b"], PATHS);
    });
    it("returns null for rules that it does not support", () => {
        for (const rule of [
            "a?c",
            "[ab]",
            "a\\*",
            "\\#a",
            "a ",
            " a",
            "a b",
            "秘密",
            "a**b",
            "**",
            "a//b",
            "./a",
            "../a",
            "{a,b}",
            "/",
            "!",
        ]) {
            expect(compileFastIgnore([rule]), rule).toBeNull();
        }
    });
    it("returns no verdict for no rules", () => {
        expect(compileFastIgnore(["# only comment\n\n"])?.test("a")).toEqual({ ignored: false, unignored: false });
    });
});
