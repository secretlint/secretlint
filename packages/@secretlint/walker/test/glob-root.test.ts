import { describe, it, expect } from "vitest";
import { splitGlobRoot, isDynamicPattern } from "../src/glob-root.js";

describe("isDynamicPattern", () => {
    it("returns true for *", () => {
        expect(isDynamicPattern("src/*.ts")).toBe(true);
    });
    it("returns true for **", () => {
        expect(isDynamicPattern("**/*.ini")).toBe(true);
    });
    it("returns true for ?", () => {
        expect(isDynamicPattern("file?.txt")).toBe(true);
    });
    it("returns true for braces", () => {
        expect(isDynamicPattern("file.{js,ts}")).toBe(true);
    });
    it("returns true for character class", () => {
        expect(isDynamicPattern("file[12].txt")).toBe(true);
    });
    it("returns false for static path", () => {
        expect(isDynamicPattern("src/foo.ts")).toBe(false);
    });
    it("returns false for empty string", () => {
        expect(isDynamicPattern("")).toBe(false);
    });
});

describe("splitGlobRoot", () => {
    it("extracts static prefix before glob", () => {
        expect(splitGlobRoot("src/**/*.ini")).toEqual({ rootDir: "src", matchPattern: "**/*.ini" });
    });
    it("returns empty rootDir when leading **", () => {
        expect(splitGlobRoot("**/*.ini")).toEqual({ rootDir: "", matchPattern: "**/*.ini" });
    });
    it("handles deeper static prefix", () => {
        expect(splitGlobRoot("a/b/c/**/*.ts")).toEqual({ rootDir: "a/b/c", matchPattern: "**/*.ts" });
    });
    it("handles brace at first segment", () => {
        expect(splitGlobRoot("{src,test}/**/*.ts")).toEqual({ rootDir: "", matchPattern: "{src,test}/**/*.ts" });
    });
    it("handles single-segment glob", () => {
        expect(splitGlobRoot("*.ts")).toEqual({ rootDir: "", matchPattern: "*.ts" });
    });
    it("handles static path (no glob chars)", () => {
        expect(splitGlobRoot("src/foo.ts")).toEqual({ rootDir: "src", matchPattern: "foo.ts" });
    });
});
