import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { cli, run } from "../src/cli.js";

/**
 * The walker matches simple ignore rules with string comparisons, and uses node-ignore for an ignore file
 * that has other rules (see @secretlint/walker fast-ignore.ts).
 * This test runs the CLI on nested .gitignore files that use both, on every OS.
 */
const FILES: Record<string, string> = {
    ".gitignore": ["*.log", "!keep.log", "/build", "dist/", "docs/**/draft.md", "Temp"].join("\n"),
    "a.txt": "a",
    "x.log": "ignored by *.log",
    "keep.log": "un-ignored by !keep.log",
    "build/b.txt": "ignored by /build",
    "sub/build/c.txt": "/build is anchored to the root",
    "dist/d.txt": "ignored by dist/",
    // dist/ matches only a directory
    "sub/dist": "a file named dist",
    "docs/draft.md": "ignored by docs/**/draft.md",
    "docs/x/y/draft.md": "ignored by docs/**/draft.md",
    "docs/x/notes.md": "notes",
    // node-ignore matches case-insensitively by default
    "TEMP/t.txt": "ignored by Temp",
    // `?` is not supported by the fast matcher, so node-ignore matches this file's rules
    "pkg/.gitignore": ["file?.txt", "!x.log"].join("\r\n"),
    "pkg/file1.txt": "ignored by file?.txt",
    "pkg/file10.txt": "file?.txt matches one character",
    "pkg/x.log": "un-ignored by pkg/.gitignore",
    "pkg/sub/.gitignore": "*.txt\n",
    "pkg/sub/s.txt": "ignored by *.txt",
    "pkg/sub/s.md": "s",
};
const EXPECTED_FILES = [
    ".gitignore",
    "a.txt",
    "docs/x/notes.md",
    "keep.log",
    "pkg/.gitignore",
    "pkg/file10.txt",
    "pkg/sub/.gitignore",
    "pkg/sub/s.md",
    "pkg/x.log",
    "sub/build/c.txt",
    "sub/dist",
];

describe(".gitignore", () => {
    let tmpDir: string;
    beforeAll(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-cli-gitignore-"));
        for (const [name, content] of Object.entries(FILES)) {
            const filePath = path.join(tmpDir, name);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, content);
        }
    });
    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    const lintedFiles = async (patterns: string[]) => {
        const result = await run(patterns, {
            ...cli.flags,
            cwd: tmpDir,
            color: false,
            format: "json",
            secretlintrcJSON: JSON.stringify({ rules: [{ id: "@secretlint/secretlint-rule-example" }] }),
        });
        assert.ok(result.stdout);
        const results = JSON.parse(result.stdout) as { filePath: string }[];
        return results
            .map((item) => path.relative(tmpDir, item.filePath).replaceAll("\\", "/"))
            .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    };

    it("lints the files that the nested .gitignore files do not ignore", async () => {
        assert.deepStrictEqual(await lintedFiles(["**/*"]), EXPECTED_FILES);
    });
    it("applies the .gitignore files of the parent directories to a glob under a directory", async () => {
        assert.deepStrictEqual(
            await lintedFiles(["pkg/**/*"]),
            EXPECTED_FILES.filter((file) => file.startsWith("pkg/")),
        );
    });
    it("applies the .gitignore files to a directory passed as a path", async () => {
        assert.deepStrictEqual(
            await lintedFiles(["docs"]),
            EXPECTED_FILES.filter((file) => file.startsWith("docs/")),
        );
    });
});
