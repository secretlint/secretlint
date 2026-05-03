import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "negation");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - negation patterns", () => {
    it("child !pattern resurrects file ignored by parent", async () => {
        const results = await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const r = rel(results);
        expect(r).not.toContain("debug.log"); // parent *.log
        expect(r).toContain("sub/important.log"); // child !important.log
        expect(r).not.toContain("sub/other.log"); // still ignored
    });
});
