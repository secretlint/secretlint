import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureDir = path.join(__dirname, "fixtures", "prune");

// Track readdir calls via a wrapper module mock
const readdirCalls: string[] = [];

vi.mock("node:fs/promises", async (importActual) => {
    const actual = await importActual<typeof import("node:fs/promises")>();
    return {
        ...actual,
        readdir: vi.fn(async (...args: Parameters<typeof actual.readdir>) => {
            readdirCalls.push(String(args[0]));
            // @ts-expect-error overloaded function
            return actual.readdir(...args);
        }),
    };
});

// Import walk AFTER mock is set up (hoisted by vitest)
const { walk } = await import("../src/index.js");

describe("walk - subtree pruning", () => {
    beforeEach(() => {
        readdirCalls.length = 0;
    });

    it("does not call readdir on ignored directories", async () => {
        await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        const calledIntoNodeModules = readdirCalls.some((d) => d.includes(`${path.sep}node_modules`));
        expect(calledIntoNodeModules).toBe(false);
    });

    it("calls readdir on src/", async () => {
        await walk({
            cwd: fixtureDir,
            ignoreFiles: [".gitignore"],
        });
        expect(readdirCalls.some((d) => d.endsWith(`${path.sep}src`))).toBe(true);
    });
});
