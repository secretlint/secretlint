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
