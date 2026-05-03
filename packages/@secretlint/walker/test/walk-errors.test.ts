import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - errors", () => {
    it("returns empty when cwd does not exist", async () => {
        const results = await walk({ cwd: path.join(os.tmpdir(), "definitely-not-here-xyz-walker") });
        expect(results).toEqual([]);
    });

    describe("propagates non-ENOENT/EACCES readdir errors", () => {
        let tmpDir: string;
        let filePath: string;
        beforeAll(async () => {
            tmpDir = await mkdtemp(path.join(os.tmpdir(), "walker-errors-"));
            filePath = path.join(tmpDir, "not-a-directory.txt");
            await writeFile(filePath, "x", "utf8");
        });
        afterAll(async () => {
            await rm(tmpDir, { recursive: true, force: true });
        });
        it("rejects with ENOTDIR when cwd is a file", async () => {
            // readdir on a regular file throws ENOTDIR, which safeReaddir does
            // not swallow (only ENOENT/EACCES are soft-skipped), so it must
            // propagate out of walk().
            await expect(walk({ cwd: filePath })).rejects.toMatchObject({ code: "ENOTDIR" });
        });
    });
});
