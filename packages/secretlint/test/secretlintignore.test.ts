import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { mkdir, writeFile, rm, mkdtemp } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { searchFiles } from "../src/search.js";

describe("searchFiles - ignoreFilePath", () => {
    let root: string;
    let cwd: string;

    beforeAll(async () => {
        // root/
        //   outside/custom-ignore      <- ignore file outside of cwd
        //   project/                   <- cwd
        //     config/custom-ignore
        //     .secretlintignore         <- ignores root.txt
        //     ignored.txt
        //     kept.txt
        //     root.txt
        //     sub/.secretlintignore     <- ignores nested.txt
        //     sub/ignored.txt
        //     sub/kept.txt
        //     sub/nested.txt
        root = await mkdtemp(path.join(os.tmpdir(), "secretlint-ignore-file-"));
        cwd = path.join(root, "project");
        await mkdir(path.join(root, "outside"));
        await writeFile(path.join(root, "outside", "custom-ignore"), "# comment\nignored.txt\n");
        await mkdir(path.join(cwd, "config"), { recursive: true });
        await mkdir(path.join(cwd, "sub"), { recursive: true });
        await writeFile(path.join(cwd, "config", "custom-ignore"), "ignored.txt\r\nconfig/\r\n");
        await writeFile(path.join(cwd, "ignored.txt"), "x");
        await writeFile(path.join(cwd, "kept.txt"), "x");
        await writeFile(path.join(cwd, "sub", "ignored.txt"), "x");
        await writeFile(path.join(cwd, "sub", "kept.txt"), "x");
        await writeFile(path.join(cwd, ".secretlintignore"), "root.txt\n");
        await writeFile(path.join(cwd, "root.txt"), "x");
        await writeFile(path.join(cwd, "sub", ".secretlintignore"), "nested.txt\n");
        await writeFile(path.join(cwd, "sub", "nested.txt"), "x");
    });

    afterAll(async () => {
        if (root) await rm(root, { recursive: true, force: true });
    });

    const relative = (items: string[]) => items.map((p) => path.relative(cwd, p).replaceAll("\\", "/")).sort();

    it("cascades .secretlintignore in each directory when no ignore file is given", async () => {
        const result = await searchFiles(["**/*.txt"], { cwd });
        expect(relative(result.items)).toEqual(["ignored.txt", "kept.txt", "sub/ignored.txt", "sub/kept.txt"]);
    });

    it("reads only the given file and skips the cascaded .secretlintignore files", async () => {
        const result = await searchFiles(["**/*.txt"], {
            cwd,
            ignoreFilePath: ".secretlintignore",
        });
        expect(relative(result.items)).toEqual([
            "ignored.txt",
            "kept.txt",
            "sub/ignored.txt",
            "sub/kept.txt",
            "sub/nested.txt",
        ]);
    });

    it("applies an ignore file given as an absolute path", async () => {
        const result = await searchFiles(["**/*.txt"], {
            cwd,
            ignoreFilePath: path.join(root, "outside", "custom-ignore"),
        });
        expect(result.ok).toBe(true);
        expect(relative(result.items)).toEqual(["kept.txt", "root.txt", "sub/kept.txt", "sub/nested.txt"]);
    });

    it("applies an ignore file given as a relative path with a directory", async () => {
        const result = await searchFiles(["**/*.txt"], {
            cwd,
            ignoreFilePath: "config/custom-ignore",
        });
        expect(result.ok).toBe(true);
        expect(relative(result.items)).toEqual(["kept.txt", "root.txt", "sub/kept.txt", "sub/nested.txt"]);
    });

    it.runIf(process.platform === "win32")("applies an ignore file given with backslashes on Windows", async () => {
        const result = await searchFiles(["**/*.txt"], {
            cwd,
            ignoreFilePath: "config\\custom-ignore",
        });
        expect(relative(result.items)).toEqual(["kept.txt", "root.txt", "sub/kept.txt", "sub/nested.txt"]);
    });

    it("warns and scans everything when the ignore file does not exist", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
            const missing = path.join(root, "outside", "missing-ignore");
            const result = await searchFiles(["**/*.txt"], {
                cwd,
                ignoreFilePath: missing,
            });
            expect(relative(result.items)).toEqual([
                "ignored.txt",
                "kept.txt",
                "root.txt",
                "sub/ignored.txt",
                "sub/kept.txt",
                "sub/nested.txt",
            ]);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining(missing));
        } finally {
            warn.mockRestore();
        }
    });

    it("reports the target as found when the absolute ignore file filters out every match", async () => {
        const result = await searchFiles(["ignored.txt"], {
            cwd,
            ignoreFilePath: path.join(root, "outside", "custom-ignore"),
        });
        expect(result).toEqual({ ok: true, items: [] });
    });
});
