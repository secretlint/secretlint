import { basename } from "../../src/builtin/path-util.js";

describe("basename", () => {
    it.each([
        ["/a/b/c.p12", "c.p12"],
        ["C:\\a\\b\\c.p12", "c.p12"],
        ["a/b/", "b"],
        ["a\\b\\\\", "b"],
        ["c.p12", "c.p12"],
        ["/", ""],
        ["", ""],
    ])("%s -> %s", (filePath, expected) => {
        expect(basename(filePath)).toBe(expected);
    });
    it("returns quickly for a path with many separators", () => {
        const start = Date.now();
        expect(basename("/".repeat(100_000) + "a" + "/".repeat(100_000))).toBe("a");
        expect(Date.now() - start).toBeLessThan(1000);
    });
});
