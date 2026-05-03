import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-glob");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - .gitignore with glob patterns", () => {
    it("rooted glob `src/**/*.ts` excludes only files under src/", async () => {
        const results = await walk({ cwd: fixtureDir, ignoreFiles: [".gitignore"] });
        const r = rel(results);
        // Excluded by `src/**/*.ts`
        expect(r).not.toContain("src/main.ts");
        expect(r).not.toContain("src/sub/util.ts");
        // Not excluded — `top.ts` is at root, the rule is rooted at src/
        expect(r).toContain("top.ts");
        // Not excluded — different extension under src/
        expect(r).toContain("src/keep.md");
    });

    it("anchored glob `**/*.test.js` excludes at any depth", async () => {
        const results = await walk({ cwd: fixtureDir, ignoreFiles: [".gitignore"] });
        const r = rel(results);
        expect(r).not.toContain("lib/main.test.js");
        expect(r).toContain("lib/main.js");
    });

    it("when patterns include `**/*` the gitignored files are still excluded", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*"],
            ignoreFiles: [".gitignore"],
        });
        const r = rel(results);
        expect(r).not.toContain("src/main.ts");
        expect(r).not.toContain("lib/main.test.js");
        expect(r).toContain("top.ts");
        expect(r).toContain("lib/main.js");
        expect(r).toContain("src/keep.md");
    });
});
