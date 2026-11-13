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
    it("finds the last matching rule among a name, an extension and a path", () => {
        expectSameAsNodeIgnore(["*.log", "!c.log", "x/c.log"], PATHS);
        expectSameAsNodeIgnore(["x/c.log", "!*.log", "c.log"], PATHS);
        expectSameAsNodeIgnore(["node_modules", "!x/node_modules/", "**/node_modules"], PATHS);
        expectSameAsNodeIgnore(["a", "!a/b", "*b", "!/b"], PATHS);
        expectSameAsNodeIgnore(["**/a", "!x/a", "a/"], PATHS);
        expectSameAsNodeIgnore(["npm-debug.log*", "!*.1", "x/*.1"], PATHS);
    });
    it("picks the rules for a path by the directory", () => {
        expectSameAsNodeIgnore(["a/b"], PATHS);
        expectSameAsNodeIgnore(["a/*/b"], PATHS);
        expectSameAsNodeIgnore(["a/**"], PATHS);
        expectSameAsNodeIgnore(["a/**/b"], PATHS);
        expectSameAsNodeIgnore(["a/**/y/b"], PATHS);
        expectSameAsNodeIgnore(["**/x/**/b"], PATHS);
        expectSameAsNodeIgnore(["A/**/B", "!a/x/b"], PATHS);
        expectSameAsNodeIgnore(["x/**", "!x/a", "x/*.log/"], PATHS);
    });
    it("is the same as node-ignore for random rules", () => {
        // a linear congruential generator, so the test is the same in each run
        let seed = 20261113;
        const random = (max: number): number => {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed % max;
        };
        const pick = <T>(items: readonly T[]): T => items[random(items.length)] as T;
        const names = ["a", "b", "x", "y", "A", "c.log", ".log", "a.tar.gz", "node_modules", "build", "b.js"];
        const segments = [...names, "*", "**", "*.log", "*.js", "*.tar.gz", "a*", "*b", "*.l*", ".*", "b*d", "*.LOG"];
        const createRule = (): string => {
            let rule = Array.from({ length: 1 + random(3) }, () => pick(segments)).join("/");
            if (random(4) === 0) rule = `/${rule}`;
            if (random(4) === 0) rule = `${rule}/`;
            if (random(4) === 0) rule = `!${rule}`;
            return rule;
        };
        const createPath = (): string => {
            const relPath = Array.from({ length: 1 + random(4) }, () => pick(names)).join("/");
            return random(3) === 0 ? `${relPath}/` : relPath;
        };
        let count = 0;
        for (let index = 0; index < 3000; index++) {
            const rules = Array.from({ length: 1 + random(5) }, createRule);
            if (compileFastIgnore([rules.join("\n")]) === null) {
                continue;
            }
            expectSameAsNodeIgnore(rules, Array.from({ length: 20 }, createPath));
            count++;
        }
        expect(count).toBeGreaterThan(1000);
    });
});
