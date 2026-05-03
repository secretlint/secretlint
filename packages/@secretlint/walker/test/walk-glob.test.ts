import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "glob");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

describe("walk - glob patterns", () => {
    it('"src/**/*.ini" walks only src/ and matches .ini', async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/**/*.ini"],
        });
        expect(rel(results)).toEqual(["src/a.ini", "src/sub/b.ini"]);
    });

    it('"**/*.ini" matches across the tree', async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*.ini"],
        });
        expect(rel(results)).toEqual(["other/d.ini", "src/a.ini", "src/sub/b.ini"]);
    });

    it("static path returns just that file", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/c.ts"],
        });
        expect(rel(results)).toEqual(["src/c.ts"]);
    });

    it("multiple patterns are unioned and deduplicated", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["src/**/*.ini", "src/c.ts", "src/a.ini"],
        });
        expect(rel(results)).toEqual(["src/a.ini", "src/c.ts", "src/sub/b.ini"]);
    });
});

describe("walk - glob + ignore cascade interaction", () => {
    const dir = path.join(__dirname, "fixtures", "glob-with-gitignore");
    const r = (paths: string[]) => paths.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();

    it("ancestor .gitignore is honoured when pattern has a static prefix", async () => {
        const results = await walk({
            cwd: dir,
            patterns: ["src/**/*"],
            ignoreFiles: [".gitignore"],
        });
        expect(r(results)).toEqual(["src/api.ts", "src/main.ts"]);  // NOT api.secrets
    });

    it("ancestor .gitignore is honoured for static file paths", async () => {
        const results = await walk({
            cwd: dir,
            patterns: ["src/api.secrets"],
            ignoreFiles: [".gitignore"],
        });
        expect(r(results)).toEqual([]);  // *.secrets ignored even though path was explicit
    });
});
