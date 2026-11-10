import { describe, it, expect } from "vitest";
import path from "node:path";
import { relativeFrom } from "../src/relative.js";

describe("relativeFrom", () => {
    const root = path.resolve("/project");
    const cases: [string, string][] = [
        [root, path.join(root, "a.txt")],
        [root, path.join(root, "src", "nested", "b.ts")],
        [root, root],
        [root, path.join(root, "..config", "file")],
        [root, path.resolve("/project-other", "c.txt")],
        [root, path.resolve("/other", "d.txt")],
        [path.join(root, "src"), root],
        [path.parse(root).root, path.join(root, "e.txt")],
    ];
    for (const [from, to] of cases) {
        it(`returns the same result as path.relative(${JSON.stringify(from)}, ${JSON.stringify(to)})`, () => {
            expect(relativeFrom(from, to)).toBe(path.relative(from, to));
        });
    }
});
