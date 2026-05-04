import { describe, it, expect } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walk } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "glob-features");
const rel = (paths: string[]) => paths.map((p) => path.relative(fixtureDir, p).replaceAll("\\", "/")).sort();

/**
 * Pins the include-pattern matcher's feature support. Both must hold:
 *
 * - **Brace expansion**: `**\/*.{ts,js}` should match `.ts` and `.js`.
 * - **Dotfile traversal**: `**\/*` should descend into hidden directories
 *   and match dotfiles, so the user's "everything" pattern actually means
 *   everything.
 */
describe("walk - glob feature support", () => {
    it("brace expansion `{ts,js}` matches both extensions", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*.{ts,js}"],
        });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain("src/lib.js");
        expect(r).not.toContain("src/style.css");
    });

    it("brace expansion still walks into dotfile directories under **", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*.{ts,js}"],
        });
        // The hidden directory is descended into, and inner.ts matches the brace.
        expect(rel(results)).toContain("src/.hidden/inner.ts");
    });

    it("`**/*` includes top-level dotfiles", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*"],
        });
        const r = rel(results);
        expect(r).toContain(".dotfile");
        expect(r).toContain("src/.env");
        expect(r).toContain("src/.hidden/inner.ts");
    });

    it("multiple brace-expanded patterns combine via union", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*.{ts,js}", "**/*.css"],
        });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain("src/lib.js");
        expect(r).toContain("src/style.css");
    });

    it("negation pattern (`!**/*.css`) excludes from a positive match", async () => {
        // micromatch semantics: a file is included iff some positive
        // pattern matches AND no negation pattern matches. A naive
        // `.some(positive | negation)` lets `.css` through because
        // `picomatch("!**/*.css")` returns true on every non-css path.
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["**/*", "!**/*.css"],
        });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain("src/lib.js");
        expect(r).not.toContain("src/style.css");
    });

    it("negation-only pattern includes everything except the negated set", async () => {
        const results = await walk({
            cwd: fixtureDir,
            patterns: ["!**/*.css"],
        });
        const r = rel(results);
        expect(r).toContain("src/main.ts");
        expect(r).toContain("src/lib.js");
        expect(r).not.toContain("src/style.css");
    });
});
