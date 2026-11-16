import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { walkSync } from "../src/index.js";

const hasGit = spawnSync("git", ["--version"]).status === 0;

/**
 * Compare the walk with Git in real directories that have nested `.gitignore` files.
 * `git ls-files --others --exclude-standard` lists the files that are not ignored in a repository without commits.
 *
 * It is skipped on Windows: creating the trees and starting Git for each of them takes too long there,
 * and the matcher itself is compared with Git on every OS in gitignore.test.ts.
 */
describe.skipIf(!hasGit || process.platform === "win32")("walk and Git", () => {
    it("finds the same files as `git ls-files` in random trees with nested .gitignore files", () => {
        // a linear congruential generator, so the test is the same in each run
        let seed = 20261113;
        const random = (max: number): number => {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed % max;
        };
        const pick = <T>(items: readonly T[]): T => items[random(items.length)] as T;
        const names = ["a", "b", "c", "build", "x.log", "y.log", "lib", "keep", "n.txt"];
        const segments = [...names, "*", "**", "*.log", "a*", "?", "[a-c]", "[!a]", "k*p"];
        const root = fs.mkdtempSync(path.join(os.tmpdir(), "walker-git-"));
        try {
            for (let count = 0; count < 40; count++) {
                const repository = path.join(root, String(count));
                fs.mkdirSync(repository);
                spawnSync("git", ["init", "-q", repository]);
                const dirs = [""];
                const createEntries = (dir: string, depth: number): void => {
                    for (const name of names) {
                        const kind = random(10);
                        if (kind < 3 && depth < 3) {
                            fs.mkdirSync(path.join(repository, dir, name));
                            dirs.push(`${dir}${name}/`);
                            createEntries(`${dir}${name}/`, depth + 1);
                        } else if (kind < 7) {
                            fs.writeFileSync(path.join(repository, dir, name), "");
                        }
                    }
                };
                createEntries("", 0);
                for (const dir of dirs) {
                    if (dir !== "" && random(3) !== 0) continue;
                    const rules = Array.from({ length: 1 + random(4) }, () => {
                        let rule = Array.from({ length: 1 + random(2) }, () => pick(segments)).join("/");
                        if (random(4) === 0) rule = `/${rule}`;
                        if (random(4) === 0) rule = `${rule}/`;
                        if (random(3) === 0) rule = `!${rule}`;
                        return rule;
                    });
                    fs.writeFileSync(path.join(repository, dir, ".gitignore"), `${rules.join("\n")}\n`);
                }
                const listed = spawnSync(
                    "git",
                    [
                        "-c",
                        "core.ignorecase=false",
                        // not the ignore file of the user who runs the test
                        "-c",
                        `core.excludesFile=${path.join(root, "no-such-file")}`,
                        "ls-files",
                        "--others",
                        "--exclude-standard",
                        "-z",
                    ],
                    { cwd: repository },
                );
                const expected = listed.stdout.toString().split("\0").filter(Boolean).sort();
                const actual = walkSync({ cwd: repository, patterns: ["**/*"], ignoreFiles: [".gitignore"] })
                    .map((file) => path.relative(repository, file).replaceAll("\\", "/"))
                    // Git never lists its own directory
                    .filter((file) => !file.startsWith(".git/"))
                    .sort();
                expect(actual, `repository ${count}`).toEqual(expected);
            }
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    }, 120_000);
});
