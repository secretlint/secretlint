/**
 * End-to-end check: run secretlint's file-discovery against the
 * secretlint repository itself and assert that gitignored paths do
 * not leak into the result.
 *
 * Why this exists: walker / cli tests cover ignore semantics in
 * isolation against synthetic fixtures. This test guards the same
 * behaviour against a real, multi-package monorepo with nested
 * `.gitignore` files, built `module/` directories, `.turbo` caches,
 * and `node_modules`.
 *
 * The CLI flow is exercised via `searchFiles` (the same function the
 * CLI calls). Running the full lint engine adds ~10s and provides no
 * extra coverage for the gitignore-respect question.
 */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { searchFiles } from "../src/search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const sep = path.sep;

const has = (items: readonly string[], predicate: (p: string) => boolean): string | undefined => items.find(predicate);

describe("E2E: secretlint searchFiles on its own repo", () => {
    it("default behaviour respects the root .gitignore (built `module/` is excluded)", async () => {
        const { ok, items } = await searchFiles(["**/*"], { cwd: repoRoot });
        expect(ok).toBe(true);
        expect(items.length).toBeGreaterThan(0);

        // Always-excluded by DEFAULT_IGNORE_PATTERNS regardless of .gitignore.
        expect(
            has(items, (p) => p.includes(`${sep}node_modules${sep}`)),
            "node_modules must always be excluded",
        ).toBeUndefined();
        expect(has(items, (p) => p.includes(`${sep}.git${sep}`)), ".git must always be excluded").toBeUndefined();

        // Excluded by repo-root .gitignore (`module/`).
        // Built outputs live at `packages/<name>/module/*.js` (and many `module/**`).
        const builtModuleFile = has(items, (p) =>
            /[/\\]packages[/\\][^/\\]+(?:[/\\]@secretlint[/\\][^/\\]+)?[/\\]module[/\\][^/\\]+\.(?:js|d\.ts)$/.test(p),
        );
        expect(builtModuleFile, "built `module/` files should be excluded by .gitignore").toBeUndefined();

        // Excluded by repo-root .gitignore (`.turbo`).
        expect(has(items, (p) => p.includes(`${sep}.turbo${sep}`)), ".turbo cache must be excluded").toBeUndefined();

        // Sanity: a known source file IS present.
        const knownSource = has(items, (p) =>
            p.endsWith(`${sep}packages${sep}secretlint${sep}src${sep}index.ts`),
        );
        expect(knownSource, "packages/secretlint/src/index.ts should be present").toBeDefined();
    }, 60_000);

    it("respectGitignore: false includes built `module/` outputs", async () => {
        const { items } = await searchFiles(["**/*"], { cwd: repoRoot, respectGitignore: false });

        // node_modules / .git are still excluded — those come from the always-on hard-coded patterns,
        // not from .gitignore.
        expect(
            has(items, (p) => p.includes(`${sep}node_modules${sep}`)),
            "node_modules must remain excluded even with --no-gitignore",
        ).toBeUndefined();

        // Now `module/` files appear because the root .gitignore is no longer consulted.
        const builtModuleFile = has(items, (p) =>
            /[/\\]packages[/\\][^/\\]+(?:[/\\]@secretlint[/\\][^/\\]+)?[/\\]module[/\\][^/\\]+\.(?:js|d\.ts)$/.test(p),
        );
        expect(builtModuleFile, "built `module/` files should appear when .gitignore is disabled").toBeDefined();
    }, 60_000);
});
