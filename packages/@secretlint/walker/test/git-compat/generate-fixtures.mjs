/**
 * Record which paths Git ignores for many `.gitignore` contents, into `git-check-ignore.json`.
 * `test/gitignore.test.ts` compares the matcher with the record, so the tests do not need Git.
 *
 * Usage: node test/git-compat/generate-fixtures.mjs
 *
 * It asks `git check-ignore`. The paths are created in temporary repositories,
 * because Git needs to know which path is a directory.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const git = (args, options) => {
    const result = spawnSync("git", args, options);
    if (result.error) throw result.error;
    return result;
};

/**
 * Create repositories that have `paths`. A directory path ends with "/".
 * A name can be a file in one repository and a directory in another, so the paths are put into some repositories.
 * Returns a function that asks Git about all the paths for the content of `.gitignore`.
 */
const createOracle = (paths) => {
    const worlds = [];
    const typeAt = (segments, index, isDirectory) => (index < segments.length || isDirectory ? "dir" : "file");
    const fits = (world, segments, isDirectory) => {
        for (let index = 1; index <= segments.length; index++) {
            const type = world.types.get(segments.slice(0, index).join("/"));
            if (type && type !== typeAt(segments, index, isDirectory)) return false;
        }
        return true;
    };
    paths.forEach((target, index) => {
        const isDirectory = target.endsWith("/");
        const relativePath = isDirectory ? target.slice(0, -1) : target;
        const segments = relativePath.split("/");
        let world = worlds.find((item) => fits(item, segments, isDirectory));
        if (!world) {
            world = { repository: fs.mkdtempSync(path.join(os.tmpdir(), "gitignore-")), types: new Map(), items: [] };
            git(["init", "-q", world.repository]);
            worlds.push(world);
        }
        for (let end = 1; end <= segments.length; end++) {
            world.types.set(segments.slice(0, end).join("/"), typeAt(segments, end, isDirectory));
        }
        world.items.push({ index, relativePath });
    });
    for (const world of worlds) {
        for (const [relativePath, type] of world.types) {
            const fullPath = path.join(world.repository, relativePath);
            if (type === "dir") {
                fs.mkdirSync(fullPath, { recursive: true });
            } else {
                fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                fs.writeFileSync(fullPath, "");
            }
        }
    }
    const check = (content, ignoreCase) => {
        const results = new Array(paths.length);
        for (const world of worlds) {
            fs.writeFileSync(path.join(world.repository, ".gitignore"), content);
            const result = git(
                ["-c", `core.ignorecase=${ignoreCase}`, "check-ignore", "--no-index", "-v", "-n", "-z", "--stdin"],
                { cwd: world.repository, input: `${world.items.map((item) => item.relativePath).join("\0")}\0` },
            );
            if (result.status !== 0 && result.status !== 1) {
                throw new Error(`git check-ignore failed for ${JSON.stringify(content)}: ${result.stderr}`);
            }
            // <source> NUL <line> NUL <pattern> NUL <path> NUL for each path
            const fields = result.stdout.toString().split("\0");
            world.items.forEach((item, position) => {
                const pattern = fields[position * 4 + 2];
                // "-": no rule matches, "i": ignored, "u": a negative rule matches
                results[item.index] = pattern === "" ? "-" : pattern.startsWith("!") ? "u" : "i";
            });
        }
        // Run-length encoding: "12-3i" is 12 times "-" and 3 times "i"
        return results.join("").replace(/(.)\1*/g, (run, character) => `${run.length}${character}`);
    };
    const dispose = () => {
        for (const world of worlds) fs.rmSync(world.repository, { recursive: true, force: true });
    };
    return { check, dispose };
};

// A linear congruential generator, so the record is the same in each run
let seed = 20261113;
const random = (max) => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed % max;
};
const pick = (items) => items[random(items.length)];

const NAMES = [
    "a",
    "b",
    "A",
    "B",
    "ab",
    "aB",
    "abc",
    "a.b",
    "a.b.c",
    "-",
    "]",
    "[",
    "!",
    "^",
    "#a",
    "a b",
    "a ",
    " a",
    "é",
    "aé",
    "é.log",
    "É.LOG",
    "秘密",
    "a-b",
    "a]",
    "[a]",
    "a[1]",
    "a:b",
    "0",
    "a0",
    "a1",
    "a12",
    "ba",
    "a!",
    "..a",
    "a.",
    "z",
    "c.log",
    "A.LOG",
    ".log",
    "a*",
    "a?c",
    "aXc",
    "a\\b",
    "{a,b}",
    ".v1",
    ".v12x",
    "lib",
    "foo",
    "bar",
    "node_modules",
];
const PATHS = [];
const addPath = (target) => {
    if (!PATHS.includes(target)) PATHS.push(target);
};
for (const name of NAMES) {
    addPath(name);
    addPath(`${name}/`);
    addPath(`d/${name}`);
    addPath(`d/e/${name}`);
    addPath(`${name}/a`);
    addPath(`a/${name}/b`);
}
for (const target of [
    "a/b/c/d",
    "a/x/y/b",
    "x/a/b",
    "x/c.log/",
    "x/C.Log",
    "foo/bar/baz",
    "foo/baz/bar",
    "src/lib/index.js",
    "lib/index.js",
    "build/Release/x",
    "x/build/Release",
    ".idea/x/y/workspace.xml",
    "x/node_modules/y",
    "x/秘密.txt",
]) {
    addPath(target);
}

const RULES = [
    "a",
    "a/",
    "/a",
    "/a/",
    "a/b",
    "a/b/",
    "a/*",
    "a/*/b",
    "a/**",
    "a/**/b",
    "**/a",
    "**/a/",
    "**/b",
    "*",
    "*/",
    "*.log",
    "*.LOG",
    "a*",
    "*c",
    "a*c",
    "a*b*c",
    "**",
    "a**",
    "**a",
    "a**b",
    "a/**b",
    "a**/b",
    "a/***/b",
    "***",
    "/**",
    "**/",
    "/**/a",
    "a/**/",
    "**/**/a",
    "a/**/**/b",
    "**\\/a",
    "a/**\\/b",
    "a?c",
    "?",
    "a?",
    "??",
    "[ab]",
    "[a-c]",
    "a[0-9]",
    "a[!0-9]",
    "a[^0-9]",
    "[!a]",
    "[^a]",
    "[z-a]",
    "[a-Z]",
    "[A-z]",
    "a[",
    "[a",
    "a]",
    "[]",
    "[]a]",
    "[!]a]",
    "[a]]",
    "[[]",
    "[\\]]",
    "[a\\]b]",
    "a[[:digit:]]",
    "[[:alpha:]]",
    "[[:upper:]]*",
    "[[:lower:]]",
    "[[:punct:]]",
    "[[:space:]]a",
    "[[:alnum:]][[:xdigit:]]",
    "[[:foo:]]",
    "[[:a]",
    "[[:]",
    "[a-]",
    "[-a]",
    "[!-]",
    "[^]",
    "a[b",
    "a[b/c]",
    "[a/b]",
    "[a\\-c]",
    "[\\a-c]",
    "[a-\\c]",
    "[--0]",
    "[!!]",
    "[a^]",
    "a\\*",
    "\\#a",
    "\\!a",
    "a\\?c",
    "a\\.c",
    "a\\[1\\]",
    "a\\",
    "a\\\\b",
    "\\a",
    "\\A",
    "a\\ b",
    "a b",
    "a ",
    "a  ",
    "a\\ ",
    " a",
    "\\ a",
    "#a",
    "!a",
    "!",
    "/",
    "//",
    "a//b",
    "./a",
    "../a",
    "a/./b",
    "a/../b",
    "{a,b}",
    "a{",
    "a|b",
    "a+",
    "(a)",
    "a$",
    "^a",
    "a^",
    "a.c",
    "a!",
    "秘密",
    "*.txt",
    "é.log",
    "é?",
    "?é",
    "é*",
    "[é]",
    "a\t",
    "\ta",
    "﻿a",
    "foo/bar",
    "foo/**/bar",
    "foo/*",
    "!foo/bar",
    "A",
    "a.",
    "..a",
    "x/**",
    "x/**/",
    "**/x/**",
    "*/a",
    "*/*",
    "*/*/",
    "a//",
    "*a*",
    "**/*",
    "*/**",
    "lib",
    "/lib/",
    "src/*/",
    "node_modules",
    "build/Release",
    ".idea/**/workspace.xml",
    ".v[0-9]*/",
    "npm-debug.log*",
    "d/e",
    "d/*/a",
    "d/**/a",
    "/d/e/",
    "d/e/**",
];
const SEGMENTS = [
    "a",
    "b",
    "x",
    "A",
    "c.log",
    "*",
    "**",
    "*.log",
    "a*",
    "*b",
    "?",
    "[a-c]",
    "[!a]",
    "a?c",
    "\\a",
    "a b",
    "秘密",
    "**a",
    "a**",
    "*.l[a-z]g",
    "lib",
    "foo",
    "bar",
    ".v[0-9]*",
    "\\#a",
    "[[:digit:]]",
    "a[",
    "é*",
    "d",
    "e",
];
const CHARACTERS = [
    "a",
    "a",
    "b",
    "A",
    "B",
    "/",
    "/",
    "*",
    "*",
    "**",
    "?",
    "[",
    "]",
    "!",
    "^",
    "-",
    "\\",
    "\\",
    ":",
    ".",
    "é",
    "0",
    "[a-b]",
    "[!a]",
    "[[:alpha:]]",
    "[[:upper:]]",
    "[]",
    "[A-B]",
    "d",
    "e",
    " ",
    "z",
];

const oracle = createOracle(PATHS);
const cases = [];
const record = (rules, ignoreCase) => {
    const content = `${rules.join("\n")}\n`;
    cases.push([content, ignoreCase ? 1 : 0, oracle.check(content, ignoreCase)]);
};
for (const rule of RULES) {
    record([rule], false);
    record([rule], true);
    record(["*", `!${rule}`], false);
    record([rule, `!${rule}`], false);
}
record(["a/", "!a/b"], false);
record(["a/*", "!a/b"], false);
record(["/*", "!/a", "/a/*", "!/a/b"], false);
record(["# comment", "", "a\r", "b"], false);
record(["*.log", "!c.log", "d/c.log"], false);
record(
    ["node_modules", "*.log", "/lib", "build/Release", "npm-debug.log*", ".idea/**/workspace.xml", "!d/c.log"],
    true,
);
// rules made of segments
for (let count = 0; count < 400; count++) {
    const rules = Array.from({ length: 1 + random(5) }, () => {
        let rule = Array.from({ length: 1 + random(3) }, () => pick(SEGMENTS)).join("/");
        if (random(4) === 0) rule = `/${rule}`;
        if (random(4) === 0) rule = `${rule}/`;
        if (random(4) === 0) rule = `!${rule}`;
        if (random(12) === 0) rule = `${rule} `;
        return rule;
    });
    record(rules, random(3) === 0);
}
// rules made of characters, to find the edge cases of the syntax
for (let count = 0; count < 600; count++) {
    const rules = Array.from({ length: 1 + random(2) }, () => {
        const rule = Array.from({ length: 1 + random(6) }, () => pick(CHARACTERS)).join("");
        return random(6) === 0 ? `!${rule}` : rule;
    });
    record(rules, random(3) === 0);
}
oracle.dispose();

const version = git(["--version"]).stdout.toString().trim();
const output = path.join(path.dirname(fileURLToPath(import.meta.url)), "git-check-ignore.json");
const lines = cases.map((item) => `        ${JSON.stringify(item)}`).join(",\n");
fs.writeFileSync(
    output,
    `{\n    "git": ${JSON.stringify(version)},\n    "paths": ${JSON.stringify(PATHS)},\n    "cases": [\n${lines}\n    ]\n}\n`,
);
console.log(`${version}: ${cases.length} cases x ${PATHS.length} paths -> ${output}`);
