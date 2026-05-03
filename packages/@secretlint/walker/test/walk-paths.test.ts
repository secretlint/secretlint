import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-nested");

describe("walk - path normalisation", () => {
    it("returns absolute paths using the OS-native separator", async () => {
        const results = await walk({ cwd: fixtureDir, ignoreFiles: [".gitignore"] });
        for (const p of results) {
            expect(path.isAbsolute(p)).toBe(true);
            // Native separator is used on the result paths
            if (path.sep === "/") {
                expect(p).not.toContain("\\");
            }
        }
    });

    it("ignore matching is unaffected by user-supplied backslash patterns", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["packages\\foo\\src\\main.ts"],
            ignoreFiles: [".gitignore"],
        });
        // patterns are normalised to forward slashes
        const relResults = results.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/"));
        expect(relResults).toEqual(["packages/foo/src/main.ts"]);
    });
});
