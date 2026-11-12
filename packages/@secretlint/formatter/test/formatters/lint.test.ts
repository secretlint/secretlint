import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import checkstyle from "../../src/formatters/lint/checkstyle.js";
import compact from "../../src/formatters/lint/compact.js";
import github from "../../src/formatters/lint/github.js";
import jslintXml from "../../src/formatters/lint/jslint-xml.js";
import junit from "../../src/formatters/lint/junit.js";
import prettyError from "../../src/formatters/lint/pretty-error.js";
import stylish from "../../src/formatters/lint/stylish.js";
import { createFormatter as createTapFormatter } from "../../src/formatters/lint/tap.js";
import unix from "../../src/formatters/lint/unix.js";
import type { LintFormatter, LintResult } from "../../src/formatters/lint/types.js";
import { results } from "./lint-fixtures.js";

const snapshotsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "snapshots");
const formatters: Record<string, LintFormatter> = {
    checkstyle,
    compact,
    github,
    "jslint-xml": jslintXml,
    junit,
    stylish,
    tap: createTapFormatter((value) => yaml.dump(value)),
    unix,
};
const ESC = "\u001B";

describe("lint formatters", () => {
    // The results have each severity, the characters to escape, a message of two lines, and fullwidth characters
    for (const [formatterName, formatter] of Object.entries(formatters)) {
        it(`${formatterName} formats the results`, (t) => {
            const actual = formatter(results, { color: false });
            const expectedFilePath = path.join(snapshotsDir, `output.${formatterName}.txt`);
            // Usage: update snapshots
            // UPDATE_SNAPSHOT=1 npm test
            if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                fs.mkdirSync(snapshotsDir, { recursive: true });
                fs.writeFileSync(expectedFilePath, actual);
                t.skip(); // skip when updating snapshots
                return;
            }
            assert.strictEqual(actual, fs.readFileSync(expectedFilePath, "utf-8"));
        });
    }

    describe("no message", () => {
        const noMessageResults: LintResult[] = [{ filePath: "/path/to/file.txt", messages: [] }];
        it("stylish, compact, unix and github output nothing", () => {
            assert.strictEqual(stylish(noMessageResults, {}), "");
            assert.strictEqual(compact(noMessageResults, {}), "");
            assert.strictEqual(unix(noMessageResults, {}), "");
            assert.strictEqual(github(noMessageResults, {}), "");
        });
        it("tap outputs ok", () => {
            assert.strictEqual(
                formatters.tap(noMessageResults, {}),
                "TAP version 13\n1..1\nok 1 - /path/to/file.txt\n",
            );
        });
        it("the XML formatters output a document without messages", () => {
            assert.strictEqual(
                junit(noMessageResults, {}),
                '<?xml version="1.0" encoding="utf-8"?>\n<testsuites>\n</testsuites>\n',
            );
            assert.strictEqual(
                jslintXml(noMessageResults, {}),
                '<?xml version="1.0" encoding="utf-8"?><jslint><file name="/path/to/file.txt"></file></jslint>\n',
            );
            assert.strictEqual(
                checkstyle(noMessageResults, {}),
                '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"><file name="/path/to/file.txt"></file></checkstyle>\n',
            );
        });
    });

    describe("one message", () => {
        const oneMessageResults: LintResult[] = [{ filePath: "/path/to/file.txt", messages: [results[2].messages[0]] }];
        it("uses the singular form", () => {
            assert.ok(
                stylish(oneMessageResults, { color: false }).endsWith("✖ 1 problem (0 errors, 1 warning, 0 infos)\n"),
            );
            assert.ok(compact(oneMessageResults, {}).endsWith("\n\n1 problem\n"));
            assert.ok(unix(oneMessageResults, {}).endsWith("\n\n1 problem\n"));
        });
    });

    describe("github", () => {
        it("escapes line breaks, so that a message can not start a new workflow command", () => {
            const output = github(
                [
                    {
                        filePath: "/path/to/a\nb.txt",
                        messages: [{ ...results[0].messages[0], message: "first\r\n::error::forged", ruleId: "a,b:c" }],
                    },
                ],
                {},
            );
            assert.strictEqual(
                output,
                "::group::/path/to/a%0Ab.txt\n" +
                    "::error file=/path/to/a%0Ab.txt,line=1,endLine=1,col=8,endColumn=14,title=TextLint [a%2Cb%3Ac]::first%0D%0A::error::forged | 1:8\n" +
                    "::endgroup::\n",
            );
        });
    });

    describe("stylish", () => {
        it("does not output escape sequences if color is false", () => {
            assert.ok(!stylish(results, { color: false }).includes(ESC));
        });
    });

    describe("pretty-error", () => {
        let tmpDir: string;
        beforeAll(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "secretlint-formatter-"));
        });
        afterAll(() => {
            fs.rmSync(tmpDir, { recursive: true });
        });
        const message = (line: number, column: number, severity: number) => {
            return {
                ruleId: "rule",
                message: "[ID] found secret",
                line,
                column,
                range: [0, 1] as const,
                loc: { start: { line, column }, end: { line, column: column + 1 } },
                severity,
            };
        };
        it("outputs the line of the message with the lines around it, and marks the column", () => {
            const filePath = path.join(tmpDir, "three-lines.txt");
            fs.writeFileSync(filePath, "first\nkey = SECRET\nthird\n");
            const output = prettyError([{ filePath, messages: [message(2, 6, 2)] }], { color: false });
            assert.strictEqual(
                output,
                [
                    "rule: [ID] found secret",
                    `${filePath}:2:6`,
                    "            v",
                    "    1. first",
                    "    2. key = SECRET",
                    "    3. third",
                    "            ^",
                    "",
                    "✖ 1 problem (1 error)",
                    "",
                ].join("\n"),
            );
        });
        it("marks the column by the width of the characters", () => {
            const filePath = path.join(tmpDir, "fullwidth.txt");
            fs.writeFileSync(filePath, "日本語 SECRET");
            const output = prettyError([{ filePath, messages: [message(1, 4, 1)] }], { color: false });
            assert.strictEqual(
                output,
                [
                    "rule: [ID] found secret",
                    `${filePath}:1:4`,
                    "             v",
                    "    0. ",
                    "    1. 日本語 SECRET",
                    "    2. ",
                    "             ^",
                    "",
                    "✖ 1 problem (1 warning)",
                    "",
                ].join("\n"),
            );
        });
        it("aligns the line numbers, and counts the messages of each severity", () => {
            const filePath = path.join(tmpDir, "ten-lines.txt");
            fs.writeFileSync(filePath, Array.from({ length: 10 }, (_, index) => `line ${index + 1}`).join("\n"));
            const output = prettyError(
                [{ filePath, messages: [message(10, 2, 2), message(1, 2, 3), message(1, 2, 0)] }],
                { color: false },
            );
            assert.ok(output.includes("     9. line 9\n    10. line 10\n    11. \n"));
            assert.ok(output.endsWith("✖ 3 problems (1 error, 1 warning, 1 info)\n"));
        });
        it("outputs colors if color is not false", () => {
            const filePath = path.join(tmpDir, "color.txt");
            fs.writeFileSync(filePath, "SECRET");
            const output = prettyError([{ filePath, messages: [message(1, 2, 2)] }], {});
            assert.ok(output.startsWith(`${ESC}[90mrule: ${ESC}[31m[ID] found secret${ESC}[0m\n`));
        });
        it("outputs nothing if the results have no message", () => {
            const filePath = path.join(tmpDir, "no-message.txt");
            fs.writeFileSync(filePath, "text");
            assert.strictEqual(prettyError([{ filePath, messages: [] }], {}), "");
        });
    });
});
