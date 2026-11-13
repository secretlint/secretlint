import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { compileGitignore, type Gitignore } from "../src/gitignore.js";

/**
 * The results of `git check-ignore` for many `.gitignore` contents.
 * `test/git-compat/generate-fixtures.mjs` records them.
 */
const record: { git: string; paths: string[]; cases: [content: string, ignoreCase: 0 | 1, results: string][] } =
    JSON.parse(fs.readFileSync(new URL("./git-compat/git-check-ignore.json", import.meta.url), "utf8"));

/** Decode the run-length encoding of the record: "12-3i" is 12 times "-" and 3 times "i" */
const decodeResults = (encoded: string): string => {
    return encoded.replace(/(\d+)(.)/g, (_, count: string, character: string) => character.repeat(Number(count)));
};

/**
 * Git does not look into an ignored directory, so a path under an ignored directory is ignored.
 * The matcher tests only the path, because a walker does not descend into an ignored directory.
 * To compare the two, test the parent directories with the matcher too.
 */
const testLikeGit = (matcher: Gitignore, relPath: string): string => {
    const segments = relPath.replace(/\/$/, "").split("/");
    for (let index = 1; index < segments.length; index++) {
        if (matcher.test(`${segments.slice(0, index).join("/")}/`).ignored) return "i";
    }
    const result = matcher.test(relPath);
    return result.ignored ? "i" : result.unignored ? "u" : "-";
};

const check = (rules: string[], paths: Record<string, "i" | "u" | "-">, ignoreCase = false) => {
    const matcher = compileGitignore([rules.join("\n")], { ignoreCase });
    const actual = Object.fromEntries(Object.keys(paths).map((relPath) => [relPath, testLikeGit(matcher, relPath)]));
    expect(actual, JSON.stringify(rules)).toEqual(paths);
};

describe("compileGitignore", () => {
    it(`gives the same results as ${record.git}`, () => {
        expect(record.cases.length).toBeGreaterThan(1000);
        const differences: string[] = [];
        for (const [content, ignoreCase, encoded] of record.cases) {
            const expected = decodeResults(encoded);
            expect(expected.length).toBe(record.paths.length);
            const matcher = compileGitignore([content], { ignoreCase: ignoreCase === 1 });
            record.paths.forEach((relPath, index) => {
                const actual = testLikeGit(matcher, relPath);
                if (actual !== expected[index]) {
                    differences.push(
                        `${JSON.stringify(content)}${ignoreCase ? " (ignoreCase)" : ""} ${relPath}: git=${expected[index]} actual=${actual}`,
                    );
                }
            });
        }
        expect(differences.slice(0, 20)).toEqual([]);
    });
    it("matches a name at any depth, and a rule with a slash from the directory of the ignore file", () => {
        check(["node_modules", "/lib", "build/Release", "doc/"], {
            "node_modules/": "i",
            "x/node_modules": "i",
            "lib/": "i",
            "x/lib/": "-",
            "build/Release": "i",
            "x/build/Release": "-",
            "doc/": "i",
            doc: "-",
            "x/doc/": "i",
        });
    });
    it("lets the last matching rule decide", () => {
        check(["*.log", "!keep.log", "x/keep.log"], {
            "a.log": "i",
            "keep.log": "u",
            "x/keep.log": "i",
            "y/keep.log": "u",
        });
    });
    it("lets the rules of a later content decide", () => {
        const matcher = compileGitignore(["*.log\n", "!keep.log\n"]);
        expect(matcher.test("keep.log")).toEqual({ ignored: false, unignored: true });
        expect(matcher.test("a.log")).toEqual({ ignored: true, unignored: false });
    });
    it("matches `**` as directories only when it is a whole segment", () => {
        check(["a/**/b", "**/c", "d/**", "x**/y"], {
            "a/b": "i",
            "a/x/y/b": "i",
            c: "i",
            "x/c": "i",
            "d/": "-",
            "d/x": "i",
            // Git compares the beginning without wildcards (`x`) first, and the rest of the rule starts with `**/`
            xy: "i",
            "x/z/y": "i",
            "xz/y": "i",
            "ax/y": "-",
        });
    });
    it("matches `?`, a character class, and an escaped character", () => {
        check(["a?c", ".v[0-9]*/", "[!a-c]x", "\\#a", "\\!b", "a\\*"], {
            abc: "i",
            "a/c": "-",
            ac: "-",
            ".v1/": "i",
            ".v12x/": "i",
            ".vx/": "-",
            ".v1": "-",
            dx: "i",
            ax: "-",
            "#a": "i",
            "!b": "i",
            "a*": "i",
            ab: "-",
        });
    });
    it("matches bytes like Git: `?` is one byte", () => {
        check(["a?", "b??", "秘*"], { aé: "-", bé: "i", 秘密: "i" });
    });
    it("removes the trailing spaces that are not escaped, a CR before a line feed, and a BOM", () => {
        check(["a  ", "b\\ ", "c\r"], { a: "i", "a ": "-", "b ": "i", b: "-", c: "i" });
        expect(compileGitignore(["﻿a\n"]).test("a").ignored).toBe(true);
    });
    it("skips blank lines and comments", () => {
        check(["# comment", "", "a", "#b"], { a: "i", "#b": "-", "# comment": "-" });
        expect(compileGitignore(["# only comment\n\n"]).test("a")).toEqual({ ignored: false, unignored: false });
    });
    it("ignores a rule that matches nothing", () => {
        check(["a\\", "[a", "/", "!", "[[:foo:]]", "b"], { a: "-", "a\\": "-", "[a": "-", b: "i" });
    });
    it("is case-sensitive by default, and folds only A-Z with `ignoreCase`", () => {
        check(["Build", "*.LOG", "É"], { build: "-", Build: "i", "a.log": "-", "a.LOG": "i" });
        check(
            ["Build", "*.LOG", "É", "src/Lib"],
            { build: "i", BUILD: "i", "a.log": "i", é: "-", É: "i", "SRC/lib": "i" },
            true,
        );
    });
    it("does not fold an escaped letter and a letter of a class with `ignoreCase`, like Git", () => {
        check(["[A]x", "\\By", "[C-D]z"], { ax: "-", Ax: "-", by: "-", By: "-", cz: "i", Cz: "i" }, true);
    });
    it("tests an entry of a directory without the path", () => {
        const matcher = compileGitignore(["*.log\nbuild/out\n!build/keep.log\n/src/**/tmp\npackages/*/lib\n"]);
        const entry = (relDir: string, name: string, isDirectory: boolean) => {
            const result = matcher.testEntry(matcher.forDirectory(relDir), name, isDirectory);
            expect(result, relDir + name).toEqual(matcher.test(relDir + name + (isDirectory ? "/" : "")));
            return result.ignored ? "i" : result.unignored ? "u" : "-";
        };
        expect(entry("", "a.log", false)).toBe("i");
        expect(entry("build/", "out", true)).toBe("i");
        expect(entry("build/", "keep.log", false)).toBe("u");
        expect(entry("x/build/", "out", true)).toBe("-");
        expect(entry("src/a/b/", "tmp", false)).toBe("i");
        expect(entry("src/", "tmp", false)).toBe("i");
        expect(entry("packages/a/", "lib", true)).toBe("i");
        expect(entry("packages/a/b/", "lib", true)).toBe("-");
    });
});
