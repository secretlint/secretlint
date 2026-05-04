import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "no-glob");
const toPosix = (p: string): string => (path.sep === "\\" ? p.replaceAll("\\", "/") : p);

describe("walk - noGlob mode", () => {
    it("treats glob-like paths as literal", async () => {
        const target = path.join(fixtureDir, "(group)/a.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
            noGlob: true,
        });
        expect(results).toEqual([toPosix(target)]);
    });

    it("treats [param] as a literal directory", async () => {
        const target = path.join(fixtureDir, "[param]/b.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
            noGlob: true,
        });
        expect(results).toEqual([toPosix(target)]);
    });
});

describe("walk - stat-then-fallback for literal paths", () => {
    it("treats an existing file with bracket characters as literal without --no-glob", async () => {
        const target = path.join(fixtureDir, "[param]/b.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
        });
        expect(results).toEqual([toPosix(target)]);
    });

    it("treats an existing file with parenthesis characters as literal without --no-glob", async () => {
        const target = path.join(fixtureDir, "(group)/a.ts");
        const results = await walk({
            cwd: fixtureDir,
            patterns: [target],
        });
        expect(results).toEqual([toPosix(target)]);
    });

    it("falls back to glob matching when the pattern does not exist on disk", async () => {
        // No file `[abc].ts` exists, so the pattern is treated as a glob.
        // It still uses gitignore-style character classes — `[abc].ts` is a
        // single-letter class and should NOT match `b.ts` because the file
        // sits inside a `[param]/` subdirectory, not at the root.
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["[abc].ts"],
        });
        expect(results).toEqual([]);
    });
});
