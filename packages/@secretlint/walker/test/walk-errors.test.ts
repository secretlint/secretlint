import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import os from "node:os";

// Track if we should throw EIO on the next readdir call
let throwEIOOnce = false;

vi.mock("node:fs/promises", async (importActual) => {
    const actual = await importActual<typeof import("node:fs/promises")>();
    return {
        ...actual,
        readdir: vi.fn(async (...args: Parameters<typeof actual.readdir>) => {
            if (throwEIOOnce) {
                throwEIOOnce = false;
                throw Object.assign(new Error("boom"), { code: "EIO" });
            }
            // @ts-expect-error overloaded function
            return actual.readdir(...args);
        }),
    };
});

const { walk } = await import("../src/index.js");

describe("walk - errors", () => {
    it("returns empty when cwd does not exist", async () => {
        const results = await walk({ cwd: path.join(os.tmpdir(), "definitely-not-here-xyz-walker") });
        expect(results).toEqual([]);
    });

    it("propagates non-ENOENT/EACCES readdir errors", async () => {
        throwEIOOnce = true;
        await expect(walk({ cwd: os.tmpdir() })).rejects.toThrow("boom");
    });
});
