import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fix = (name: string) => path.join(__dirname, "fixtures", name);
const rel = (paths: string[], cwd: string) =>
    paths.map((p) => path.relative(cwd, p).replaceAll("\\", "/")).sort();

/**
 * Pin the walker against the family of "nested .gitignore is treated
 * as project-root" bugs that Biome shipped with its VCS integration.
 *
 * - biomejs/biome#2312 — nested .gitignore not respected at all
 * - biomejs/biome#6252 — `.venv/.gitignore: *` ignores everything
 * - biomejs/biome#6715 — `.a/.gitignore: *` ignores everything
 *
 * The chain-of-matchers cascade keeps each .gitignore anchored to its
 * own directory by virtue of where its matcher sits in the chain, so
 * none of these scenarios should leak rules across directories.
 */
describe("walk - biome-style nested .gitignore regressions", () => {
    it("biome#6252: subdir `.venv/.gitignore: *` only ignores files under .venv/", async () => {
        const cwd = fix("biome-regression-6252");
        const results = await walk({ cwd, ignoreFiles: [".gitignore"] });
        const r = rel(results, cwd);
        // Files outside the .venv subdirectory must remain visible.
        expect(r).toContain("index.js");
        expect(r).toContain("src/main.ts");
        // Files inside .venv are ignored by the wildcard rule.
        expect(r).not.toContain(".venv/cached.txt");
    });

    it("biome#6715: hidden subdir `.a/.gitignore: *` only ignores files under .a/", async () => {
        const cwd = fix("biome-regression-6715");
        const results = await walk({ cwd, ignoreFiles: [".gitignore"] });
        const r = rel(results, cwd);
        expect(r).toContain("index.js");
        expect(r).not.toContain(".a/inside.ts");
    });
});
