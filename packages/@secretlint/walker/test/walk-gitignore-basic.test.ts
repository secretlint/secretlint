import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-basic");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - .gitignore basic", () => {
    it("respects root .gitignore when ignoreFiles includes it", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        expect(rel(results)).toEqual([".gitignore", "keep.ts", "src/main.ts"]);
    });

    it("ignores .gitignore when not in ignoreFiles", async () => {
        const results = await walk({ cwd: fixtureDir });
        expect(rel(results)).toContain("src/debug.log");
    });
});
