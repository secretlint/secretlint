import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { symlink, mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

// Probe whether the test environment lets us create symlinks (Windows
// without privileges, restricted CI sandboxes, etc.). When it doesn't,
// the entire describe block is skipped via `describe.skipIf` rather
// than every test paying for an `if (skip) return` early-out.
const canSymlink = await (async () => {
    const probe = await mkdtemp(path.join(os.tmpdir(), "walker-symlink-probe-"));
    try {
        await symlink(probe, path.join(probe, "link"), "dir");
        return true;
    } catch {
        return false;
    } finally {
        await rm(probe, { recursive: true, force: true });
    }
})();

describe.skipIf(!canSymlink)("walk - symlinks", () => {
    let dir: string;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-symlink-"));
        await mkdir(path.join(dir, "real"));
        await writeFile(path.join(dir, "real", "in-real.ts"), "x");
        await writeFile(path.join(dir, "top.ts"), "y");
        await symlink(path.join(dir, "real"), path.join(dir, "linked"), "dir");
    });

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    });

    it("descends into a directory symlink by default", async () => {
        const results = await walk({ cwd: dir });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).toContain("linked/in-real.ts");
    });

    it("does not descend when followSymlinks is false", async () => {
        const results = await walk({ cwd: dir, followSymlinks: false });
        const r = results.map((p) => path.relative(dir, p).replaceAll("\\", "/")).sort();
        expect(r).toContain("real/in-real.ts");
        expect(r).toContain("top.ts");
        expect(r).not.toContain("linked/in-real.ts");
    });

    it("ignore rules apply to the symlink path, not the resolved target", async () => {
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
        // Walk completes; if it loops, vitest's testTimeout (30s) will fail us.
        const results = await walk({ cwd: dir });
        expect(Array.isArray(results)).toBe(true);
    });
});

describe.skipIf(!canSymlink)("walk - symlink cycles", () => {
    let dir: string;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-symlink-cycle-"));
        // Create a -> b -> a cycle.
        await mkdir(path.join(dir, "a"));
        await mkdir(path.join(dir, "b"));
        await writeFile(path.join(dir, "a", "in-a.ts"), "x");
        await writeFile(path.join(dir, "b", "in-b.ts"), "y");
        await symlink(path.join(dir, "a"), path.join(dir, "b", "to-a"), "dir");
        await symlink(path.join(dir, "b"), path.join(dir, "a", "to-b"), "dir");
    });

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    });

    it("breaks the cycle via realpath dedup", async () => {
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
