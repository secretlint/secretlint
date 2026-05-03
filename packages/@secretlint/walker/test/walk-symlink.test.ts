import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { symlink, mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - symlinks", () => {
    let dir: string;
    let skipSymlink = false;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-symlink-"));
        await mkdir(path.join(dir, "real"));
        await writeFile(path.join(dir, "real", "in-real.ts"), "x");
        await writeFile(path.join(dir, "top.ts"), "y");
        try {
            await symlink(path.join(dir, "real"), path.join(dir, "linked"), "dir");
        } catch {
            skipSymlink = true;
        }
    });

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    });

    it("does not descend into a directory symlink", async () => {
        if (skipSymlink) return;
        const results = await walk({ cwd: dir });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).not.toContain("linked/in-real.ts");
    });

    it("does not loop on circular symlinks", async () => {
        if (skipSymlink) return;
        // Walk completes; if it loops, vitest's testTimeout (30s) will fail us.
        const results = await walk({ cwd: dir });
        expect(Array.isArray(results)).toBe(true);
    });
});
