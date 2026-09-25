import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { symlink, mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { searchFiles } from "../src/search.js";
import { cli, run } from "../src/cli.js";

// Probe whether the test environment lets us create symlinks (Windows
// without privileges, restricted CI sandboxes, etc.).
const canSymlink = await (async () => {
    const probe = await mkdtemp(path.join(os.tmpdir(), "secretlint-symlink-probe-"));
    try {
        await symlink(probe, path.join(probe, "link"), "dir");
        return true;
    } catch {
        return false;
    } finally {
        await rm(probe, { recursive: true, force: true });
    }
})();

describe.skipIf(!canSymlink)("searchFiles - symlinks", () => {
    let root: string;
    let cwd: string;

    beforeAll(async () => {
        // root/
        //   outside/secret.txt       <- outside of cwd
        //   project/                 <- cwd
        //     real/in-real.txt
        //     top.txt
        //     file-link.txt -> ../outside/secret.txt
        //     dir-link -> ../outside
        //     inner-link -> real
        root = await mkdtemp(path.join(os.tmpdir(), "secretlint-search-symlink-"));
        cwd = path.join(root, "project");
        await mkdir(path.join(root, "outside"));
        await writeFile(path.join(root, "outside", "secret.txt"), "OUTSIDE_OF_CWD_CONTENT");
        await mkdir(path.join(cwd, "real"), { recursive: true });
        await writeFile(path.join(cwd, "real", "in-real.txt"), "x");
        await writeFile(path.join(cwd, "top.txt"), "y");
        await symlink(path.join(root, "outside", "secret.txt"), path.join(cwd, "file-link.txt"), "file");
        await symlink(path.join(root, "outside"), path.join(cwd, "dir-link"), "dir");
        await symlink(path.join(cwd, "real"), path.join(cwd, "inner-link"), "dir");
    });

    afterAll(async () => {
        if (root) await rm(root, { recursive: true, force: true });
    });

    const relative = (items: string[]) => items.map((p) => path.relative(cwd, p).replaceAll("\\", "/")).sort();

    it("does not follow symlinks found while walking", async () => {
        const { ok, items } = await searchFiles(["**/*"], { cwd });
        expect(ok).toBe(true);
        expect(relative(items)).toEqual(["real/in-real.txt", "top.txt"]);
    });

    it("still scans a symlink passed explicitly as a pattern", async () => {
        const { ok, items } = await searchFiles(["file-link.txt"], { cwd });
        expect(ok).toBe(true);
        expect(relative(items)).toEqual(["file-link.txt"]);
    });

    it("does not include the symlink target in the CLI JSON report", async () => {
        const result = await run(["**/*"], {
            ...cli.flags,
            cwd,
            color: false,
            format: "json",
            secretlintrcJSON: JSON.stringify({ rules: [] }),
        });
        const report = JSON.parse(result.stdout) as { filePath: string }[];
        expect(relative(report.map((r) => r.filePath))).toEqual(["real/in-real.txt", "top.txt"]);
        expect(result.stdout).not.toContain("OUTSIDE_OF_CWD_CONTENT");
    });
});
