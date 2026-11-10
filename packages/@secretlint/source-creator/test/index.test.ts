import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";
import { createFileSourceReader, createRawSource } from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "snapshots");
const createSnapshotReplacer = () => {
    return (key: string, value: any) => {
        if (key === "content") {
            return "[SNIP]";
        }
        if (typeof value === "string") {
            return (
                value
                    // replace snapshotsDir to [SNAPSHOT]
                    .replace(fixturesDir, "[SNAPSHOT]")
                    .replace(/\\/g, "/")
            );
        }
        return value;
    };
};

describe("@secretlint/source-creator", () => {
    fs.readdirSync(fixturesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
            const normalizedTestName = dirent.name;
            it(`test ${normalizedTestName}`, async (t) => {
                const fixtureDir = path.join(fixturesDir, normalizedTestName);
                const actualFilePath = fs.readdirSync(fixtureDir).find((filePath) => {
                    return filePath.startsWith("input");
                });
                if (!actualFilePath) {
                    throw new Error("should put input.* file");
                }
                const actual = await createRawSource(path.join(fixtureDir, actualFilePath));
                const expectedFilePath = path.join(fixtureDir, "output.json");
                // Usage: update snapshots
                // UPDATE_SNAPSHOT=1 npm test
                if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, JSON.stringify(actual, createSnapshotReplacer(), 4));
                    t.skip(); // skip when updating snapshots
                    return;
                }
                // compare input and output
                const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                assert.deepStrictEqual(JSON.parse(JSON.stringify(actual, createSnapshotReplacer())), expected);
            });
        });
});

describe("createRawSource content", () => {
    it("decodes binary content as UTF-8 when it is accessed", async () => {
        const filePath = path.join(fixturesDir, "image", "input.png");
        const rawSource = await createRawSource(filePath);
        assert.strictEqual(rawSource.contentType, "binary");
        assert.strictEqual(rawSource.content, fs.readFileSync(filePath).toString());
    });
    it("decodes text content as UTF-8", async () => {
        const fixtureDir = path.join(fixturesDir, "txt");
        const inputFile = fs.readdirSync(fixtureDir).find((filePath) => filePath.startsWith("input"));
        assert.ok(inputFile);
        const filePath = path.join(fixtureDir, inputFile);
        const rawSource = await createRawSource(filePath);
        assert.strictEqual(rawSource.contentType, "text");
        assert.strictEqual(rawSource.content, fs.readFileSync(filePath, "utf-8"));
    });
});

describe("createRawSource contentBytes", () => {
    it("has the bytes of the file as a non-enumerable property", async () => {
        const filePath = path.join(fixturesDir, "image", "input.png");
        const rawSource = await createRawSource(filePath);
        assert.deepStrictEqual(Buffer.from(rawSource.contentBytes as Uint8Array), fs.readFileSync(filePath));
        assert.ok(!Object.keys(rawSource).includes("contentBytes"));
        assert.ok(!("contentBytes" in JSON.parse(JSON.stringify({ ...rawSource, content: "" }))));
    });
});

describe("createFileSourceReader", () => {
    const listInputFiles = () => {
        return fs
            .readdirSync(fixturesDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
                const fixtureDir = path.join(fixturesDir, dirent.name);
                const inputFile = fs.readdirSync(fixtureDir).find((filePath) => filePath.startsWith("input"));
                return path.join(fixtureDir, inputFile as string);
            });
    };
    it("returns the same source as createRawSource", async () => {
        const readFileSource = createFileSourceReader();
        for (const filePath of listInputFiles()) {
            const expected = await createRawSource(filePath);
            const actual = readFileSource(filePath);
            assert.deepStrictEqual(Buffer.from(actual.contentBytes as Uint8Array), fs.readFileSync(filePath));
            assert.strictEqual(actual.content, expected.content);
            assert.deepStrictEqual({ ...actual }, { ...expected });
        }
    });
    it("keeps content available after reading the next file, but not contentBytes", () => {
        const readFileSource = createFileSourceReader();
        const filePaths = listInputFiles();
        const sources = filePaths.map((filePath) => {
            const source = readFileSource(filePath);
            assert.ok(source.contentBytes !== undefined);
            return source;
        });
        sources.forEach((source, index) => {
            const filePath = filePaths[index] as string;
            const isLast = index === sources.length - 1;
            assert.strictEqual(source.contentBytes === undefined, !isLast);
            assert.strictEqual(source.content, fs.readFileSync(filePath).toString());
            // content is cached
            assert.strictEqual(source.content, fs.readFileSync(filePath).toString());
        });
    });
    it("reads a file larger than the initial buffer, and an empty file", () => {
        const readFileSource = createFileSourceReader();
        const dir = fs.mkdtempSync(path.join(fixturesDir, "..", ".tmp-reader-"));
        try {
            const largeFilePath = path.join(dir, "large.txt");
            const emptyFilePath = path.join(dir, "empty.txt");
            const largeContent = "0123456789abcdef\n".repeat(20000);
            fs.writeFileSync(largeFilePath, largeContent);
            fs.writeFileSync(emptyFilePath, "");
            const large = readFileSource(largeFilePath);
            assert.strictEqual(large.contentBytes?.length, largeContent.length);
            assert.strictEqual(large.content, largeContent);
            const empty = readFileSource(emptyFilePath);
            assert.strictEqual(empty.contentBytes?.length, 0);
            assert.strictEqual(empty.content, "");
            // the shared buffer has grown. A small file is still read correctly
            const again = readFileSource(largeFilePath);
            assert.strictEqual(again.content, largeContent);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });
    it("throws if the file does not exist", () => {
        const readFileSource = createFileSourceReader();
        assert.throws(() => readFileSource(path.join(fixturesDir, "not-found.txt")), /ENOENT/);
    });
    it("throws if the file was changed before the content is read again", () => {
        const readFileSource = createFileSourceReader();
        const dir = fs.mkdtempSync(path.join(fixturesDir, "..", ".tmp-reader-"));
        try {
            const filePath = path.join(dir, "changed.txt");
            const otherFilePath = path.join(dir, "other.txt");
            fs.writeFileSync(filePath, "clean content");
            fs.writeFileSync(otherFilePath, "other");
            const source = readFileSource(filePath);
            const unchanged = readFileSource(filePath);
            readFileSource(otherFilePath);
            // the content of an unchanged file is read again
            assert.strictEqual(unchanged.content, "clean content");
            // the content that was not linted is never returned
            fs.writeFileSync(filePath, "new content with a secret");
            assert.throws(() => source.content, /The file was changed while linting/);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });
});
