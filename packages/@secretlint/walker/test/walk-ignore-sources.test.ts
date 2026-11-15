import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { walkSync } from "../src/index.js";

describe("walk - each source of ignore rules decides by itself", () => {
    let cwd: string;
    beforeAll(async () => {
        // .secretlintignore: a.txt
        // .gitignore:        *.txt, !a.txt, !b.txt, !node_modules
        // sub/.gitignore:    !c.txt
        // sub/.secretlintignore: c.txt, !d.txt
        cwd = await mkdtemp(path.join(os.tmpdir(), "walker-ignore-sources-"));
        await mkdir(path.join(cwd, "sub"));
        await mkdir(path.join(cwd, "node_modules"));
        await writeFile(path.join(cwd, ".secretlintignore"), "a.txt\n");
        await writeFile(path.join(cwd, ".gitignore"), "*.txt\n!a.txt\n!b.txt\n!node_modules\n");
        await writeFile(path.join(cwd, "sub", ".gitignore"), "!c.txt\n");
        await writeFile(path.join(cwd, "sub", ".secretlintignore"), "c.txt\n!d.txt\n");
        for (const file of ["a.txt", "b.txt", "x.txt", "sub/c.txt", "sub/d.txt", "node_modules/m.js"]) {
            await writeFile(path.join(cwd, file), "x");
        }
    });
    afterAll(async () => {
        if (cwd) await rm(cwd, { recursive: true, force: true });
    });
    const rel = (paths: string[]) => paths.map((p) => path.relative(cwd, p).replaceAll("\\", "/")).sort();
    const walkTxt = (extraIgnoreSources?: string[][]) =>
        rel(
            walkSync({
                cwd,
                patterns: ["**/*.txt", "**/*.js"],
                ignoreFiles: [".secretlintignore", ".gitignore"],
                extraIgnorePatterns: ["**/node_modules"],
                extraIgnoreSources,
            }),
        );

    it("ignores a path that any source ignores, and `!` includes again only within its source", () => {
        // a.txt: .gitignore includes it again, but .secretlintignore ignores it
        // b.txt: .gitignore includes it again, and no other source ignores it
        // x.txt: .gitignore ignores it
        // sub/c.txt: sub/.gitignore includes it again, but sub/.secretlintignore ignores it
        // sub/d.txt: `!d.txt` of sub/.secretlintignore does not include again what .gitignore (*.txt) ignores
        // node_modules/m.js: `!node_modules` of .gitignore does not include again what the extra patterns ignore
        expect(walkTxt()).toEqual(["b.txt"]);
    });

    it("treats each of extraIgnoreSources as a source of its own", () => {
        expect(walkTxt([["b.txt"]])).toEqual([]);
        // `!x.txt` of the extra source does not include again what .gitignore ignores
        expect(walkTxt([["!x.txt"]])).toEqual(["b.txt"]);
    });

    it("tests a path given directly with the same sources", () => {
        const results = walkSync({
            cwd,
            patterns: ["a.txt", "b.txt"],
            ignoreFiles: [".secretlintignore", ".gitignore"],
        });
        expect(rel(results)).toEqual(["b.txt"]);
    });
});
