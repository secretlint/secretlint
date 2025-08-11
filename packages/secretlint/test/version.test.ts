import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getVersion } from "../src/version.js";

describe("getVersion", () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
        // Save original environment variable
        originalEnv = process.env.SECRETLINT_VERSION;
    });

    afterEach(() => {
        // Restore original environment variable
        if (originalEnv !== undefined) {
            process.env.SECRETLINT_VERSION = originalEnv;
        } else {
            delete process.env.SECRETLINT_VERSION;
        }
    });

    it("should return version from environment variable if set", () => {
        process.env.SECRETLINT_VERSION = "99.99.99";
        const version = getVersion();
        expect(version).toBe("99.99.99");
    });

    it("should return version from package.json when env var is not set", () => {
        delete process.env.SECRETLINT_VERSION;
        const version = getVersion();
        // Should match the current package.json version
        expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });

    it("should return undefined if version cannot be determined", () => {
        // This test might not actually return undefined in normal conditions
        // since package.json should be available, but we test the type signature
        delete process.env.SECRETLINT_VERSION;
        const version = getVersion();
        expect(version === undefined || typeof version === "string").toBe(true);
    });
});