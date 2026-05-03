import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { walk } from "../src/index.js";

describe("walk - large tree", () => {
    let dir: string;
    const FILES = 10_000;
    const PER_DIR = 100;

    beforeAll(async () => {
        dir = await mkdtemp(path.join(os.tmpdir(), "walker-large-"));
        const dirCount = FILES / PER_DIR;
        for (let d = 0; d < dirCount; d++) {
            const sub = path.join(dir, `d${d}`);
            await mkdir(sub);
            await Promise.all(
                Array.from({ length: PER_DIR }, (_, i) => writeFile(path.join(sub, `f${i}.txt`), ""))
            );
        }
    }, 60_000);

    afterAll(async () => {
        if (dir) await rm(dir, { recursive: true, force: true });
    }, 60_000);

    it("walks 10k files without stack overflow or hang", async () => {
        const results = await walk({ cwd: dir });
        expect(results.length).toBe(FILES);
    }, 60_000);
});
