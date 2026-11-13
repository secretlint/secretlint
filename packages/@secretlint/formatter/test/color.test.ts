import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { loadFormatter } from "../src/index.js";
import { results } from "./snapshots/input.js";
import { snapshotReplace, snapshotsDir } from "./snapshot-replace.js";

/**
 * Make the control characters visible, so that the snapshots are readable as text
 */
const showControlCharacters = (value: string) => {
    return value.replaceAll("\u001B", "<ESC>").replaceAll("\u0007", "<BEL>");
};
/**
 * The first message of each file has docsUrl
 */
const resultsWithDocsUrl = results.map((result) => {
    return {
        ...result,
        messages: result.messages.map((message, index) => {
            return index === 0 ? { ...message, docsUrl: `https://example.com/docs#${message.messageId}` } : message;
        }),
    };
});

describe("@secretlint/formatter with color and terminalLink", () => {
    const originalEnv = { ...process.env };
    beforeAll(() => {
        // `styleText` and `terminalLink` look at the environment, because stdout of the test is not a TTY
        delete process.env.NO_COLOR;
        delete process.env.NODE_DISABLE_COLORS;
        process.env.FORCE_COLOR = "1";
        process.env.FORCE_HYPERLINK = "1";
    });
    afterAll(() => {
        for (const name of ["NO_COLOR", "NODE_DISABLE_COLORS", "FORCE_COLOR", "FORCE_HYPERLINK"]) {
            if (originalEnv[name] === undefined) {
                delete process.env[name];
            } else {
                process.env[name] = originalEnv[name];
            }
        }
    });
    // The formatters that use colors
    for (const formatterName of ["stylish", "pretty-error", "table"]) {
        it(`test ${formatterName}`, async (t) => {
            const formatter = await loadFormatter({
                color: true,
                terminalLink: true,
                formatterName,
                // The results do not have the content of the sources
                getSource: (filePath) => fs.readFileSync(filePath, "utf-8"),
            });
            const actual = showControlCharacters(snapshotReplace(formatter.format(resultsWithDocsUrl)));
            const expectedFilePath = path.join(snapshotsDir, `output.${formatterName}.color.txt`);
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(expectedFilePath, actual);
                t.skip(); // skip when updating snapshots
                return;
            }
            const expected = snapshotReplace(fs.readFileSync(expectedFilePath, "utf-8"));
            assert.strictEqual(actual, expected);
        });
    }
    it("does not output a control character when color and terminalLink are false", async () => {
        for (const formatterName of ["stylish", "pretty-error", "table"]) {
            const formatter = await loadFormatter({
                color: false,
                terminalLink: false,
                formatterName,
                getSource: (filePath) => fs.readFileSync(filePath, "utf-8"),
            });
            const output = formatter.format(resultsWithDocsUrl);
            assert.ok(!output.includes("\u001B"), `${formatterName} should not output ESC`);
        }
    });
});
