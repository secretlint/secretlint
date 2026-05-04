import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "basic");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - basic", () => {
    it("returns all files when no patterns / ignores given", async () => {
        const results = await walk({ cwd: fixtureDir });
        expect(rel(results)).toEqual(["other/x.ts", "src/main.ts", "src/sub/util.ts"]);
    });

    it("returns absolute paths", async () => {
        const results = await walk({ cwd: fixtureDir });
        for (const p of results) expect(path.isAbsolute(p)).toBe(true);
    });
});
