/**
 * End-to-end check: run secretlint's file discovery against the
 * secretlint repository itself and use `git check-ignore -v` as the
 * oracle for which paths are gitignored.
 *
 * Walker scope vs. git scope:
 *   The walker only reads `.gitignore` files at or below the cwd.
 *   Global gitignore (`core.excludesfile`) and `.git/info/exclude`
 *   are intentionally out of scope (mirrors the design spec). Git's
 *   `check-ignore` always consults all sources, so we filter the
 *   results to only count rules sourced from in-repo `.gitignore`
 *   files. Otherwise developers with a populated global gitignore
 *   (e.g. `.DS_Store`, `.idea/`) would see false-positive leaks.
 */
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { searchFiles } from "../src/search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

/**
 * Run `git check-ignore -v --no-index --stdin` against the given
 * relative paths and return the subset that is ignored by an in-repo
 * `.gitignore` file. Each `git check-ignore -v` line is formatted as
 * `<source>:<linenum>:<pattern>\t<path>`.
 *
 * Sources that come from outside the repo (absolute paths) and from
 * `.git/info/exclude` are filtered out so the result reflects only
 * what the walker is supposed to honour.
 */
const ignoredByRepoGitignore = (relPaths: readonly string[]): string[] => {
    if (relPaths.length === 0) return [];
    const result = spawnSync("git", ["check-ignore", "--no-index", "-v", "--stdin"], {
        cwd: repoRoot,
        input: relPaths.join("\n"),
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
    });
    if (result.status === 128) {
        throw new Error(`git check-ignore failed: ${result.stderr}`);
    }
    const ignored: string[] = [];
    for (const line of result.stdout.split("\n")) {
        if (line === "") continue;
        // Format: `<source>:<linenum>:<pattern>\t<path>`
        const tab = line.indexOf("\t");
        if (tab < 0) continue;
        const meta = line.slice(0, tab);
        const target = line.slice(tab + 1);
        const firstColon = meta.indexOf(":");
        const secondColon = meta.indexOf(":", firstColon + 1);
        const source = meta.slice(0, firstColon);
        const pattern = secondColon >= 0 ? meta.slice(secondColon + 1) : "";
        // Skip global excludes (absolute path source) and .git/info/exclude.
        if (path.isAbsolute(source)) continue;
        if (source.startsWith(".git/")) continue;
        // Skip negation rules — `git check-ignore -v` lists them as "matching"
        // even though the pattern un-ignores the path.
        if (pattern.startsWith("!")) continue;
        ignored.push(target);
    }
    return ignored;
};

describe("E2E: secretlint searchFiles vs git check-ignore", () => {
    it("default behaviour returns no path that an in-repo .gitignore covers", async () => {
        const { ok, items } = await searchFiles(["**/*"], { cwd: repoRoot });
        expect(ok).toBe(true);
        expect(items.length).toBeGreaterThan(0);

        const relItems = items.map((p) => path.relative(repoRoot, p));
        const ignored = ignoredByRepoGitignore(relItems);

        expect(
            ignored,
            `secretlint returned ${ignored.length} gitignored paths (first 10):\n${ignored.slice(0, 10).join("\n")}`,
        ).toEqual([]);
    }, 60_000);

    it("respectGitignore: false leaks at least one in-repo gitignored path", async () => {
        // Sanity check on the methodology: when we explicitly disable
        // .gitignore respect, in-repo gitignored paths should appear in the
        // result. Otherwise the assertion above could be passing for the
        // wrong reason (e.g. searchFiles returning nothing).
        const { items } = await searchFiles(["**/*"], { cwd: repoRoot, respectGitignore: false });
        const relItems = items.map((p) => path.relative(repoRoot, p));
        const ignored = ignoredByRepoGitignore(relItems);

        expect(ignored.length).toBeGreaterThan(0);
    }, 60_000);
});
