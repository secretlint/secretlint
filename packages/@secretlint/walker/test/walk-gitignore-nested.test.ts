import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "gitignore-nested");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - nested .gitignore cascade", () => {
    it("applies parent + child .gitignore additively", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const r = rel(results);
        expect(r).toContain("packages/foo/src/main.ts");
        expect(r).not.toContain("packages/foo/src/debug.log"); // parent rule
        expect(r).not.toContain("packages/foo/build/output.ts"); // child rule
    });
});
