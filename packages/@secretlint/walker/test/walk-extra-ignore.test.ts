import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "extra-ignore");
const gitDir = path.join(fixtureDir, ".git");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - extraIgnorePatterns", () => {
    beforeAll(async () => {
        await mkdir(gitDir, { recursive: true });
        await writeFile(path.join(gitDir, "HEAD"), "x");
    });
    afterAll(async () => {
        await rm(gitDir, { recursive: true, force: true });
    });

    it("excludes .git and node_modules via extraIgnorePatterns", async () => {
        const results = await walk({
            cwd: fixtureDir,
            extraIgnorePatterns: ["**/.git/**", "**/node_modules/**"],
        });
        expect(rel(results)).toEqual(["src/main.ts"]);
    });

    it("includes everything when extraIgnorePatterns is empty", async () => {
        const results = await walk({ cwd: fixtureDir });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain(".git/HEAD");
        expect(r).toContain("node_modules/some-dep/index.js");
    });
});
