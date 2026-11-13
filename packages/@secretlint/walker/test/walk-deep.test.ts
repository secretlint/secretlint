import { describe, it, expect, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { walkSync } from "../src/index.js";

/**
 * A tree that is as deep as the OS allows must not overflow the call stack.
 * It is skipped on Windows, where a path is limited to about 260 characters.
 */
describe.skipIf(process.platform === "win32")("walk - deep tree", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "walker-deep-"));
    let deepest = root;
    afterAll(() => {
        // Remove the directories from the deepest one: a recursive `rmSync` overflows the call stack for this tree
        fs.rmSync(path.join(deepest, "f"), { force: true });
        for (let dir = deepest; dir.startsWith(root); dir = path.dirname(dir)) {
            fs.rmdirSync(dir);
        }
    });
    it("finds a file below about 2,000 directories", () => {
        let dir = root;
        let depth = 0;
        // Linux allows a path of 4,096 bytes, and macOS of 1,024 bytes
        for (; depth < 2020; depth++) {
            const next = path.join(dir, "d");
            try {
                fs.mkdirSync(next);
            } catch {
                break;
            }
            dir = next;
        }
        // Leave room for the file name
        if (depth < 2020) {
            fs.rmdirSync(dir);
            dir = path.dirname(dir);
        }
        deepest = dir;
        fs.writeFileSync(path.join(dir, "f"), "");
        expect(depth).toBeGreaterThan(100);
        const files = walkSync({ cwd: root, ignoreFiles: [".gitignore"], extraIgnorePatterns: ["**/.git"] });
        expect(files).toEqual([path.join(dir, "f")]);
    });
});
