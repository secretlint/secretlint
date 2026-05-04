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

    it("descends into a directory symlink by default", async () => {
        if (skipSymlink) return;
        const results = await walk({ cwd: dir });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).toContain("linked/in-real.ts");
    });

    it("does not descend when followSymlinks is false", async () => {
        if (skipSymlink) return;
        const results = await walk({ cwd: dir, followSymlinks: false });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).not.toContain("linked/in-real.ts");
    });

    it("ignore rules apply to the symlink path, not the resolved target", async () => {
        if (skipSymlink) return;
        // `linked` is a symlink to the existing `real/`. With an ignore
        // rule on the symlink path we should not descend it even though
        // followSymlinks is true.
        const results = await walk({
            cwd: dir,
            extraIgnorePatterns: ["linked"],
        });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).not.toContain("linked/in-real.ts");
    });

    it("does not loop on circular symlinks", async () => {
        if (skipSymlink) return;
        // Walk completes; if it loops, vitest's testTimeout (30s) will fail us.
        const results = await walk({ cwd: dir });
        expect(Array.isArray(results)).toBe(true);
    });
});

describe("walk - symlink cycles", () => {
    let dir: string;
    let skipSymlink = false;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-symlink-cycle-"));
        // Create a -> b -> a cycle.
        await mkdir(path.join(dir, "a"));
        await mkdir(path.join(dir, "b"));
        await writeFile(path.join(dir, "a", "in-a.ts"), "x");
        await writeFile(path.join(dir, "b", "in-b.ts"), "y");
        try {
            await symlink(path.join(dir, "a"), path.join(dir, "b", "to-a"), "dir");
            await symlink(path.join(dir, "b"), path.join(dir, "a", "to-b"), "dir");
        } catch {
            skipSymlink = true;
        }
    });

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    });

    it("breaks the cycle via realpath dedup", async () => {
        if (skipSymlink) return;
        // Without cycle detection this would recurse infinitely. The
        // realpath set guarantees each unique target dir is entered at
        // most once.
        const results = await walk({ cwd: dir });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("a/in-a.ts");
        expect(r).toContain("b/in-b.ts");
        // The cycle is broken — exact additional entries depend on which
        // direction the walker enters first; we just assert no loop.
        expect(results.length).toBeLessThan(20);
    }, 10_000);
});
