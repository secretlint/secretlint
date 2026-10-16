import assert from "node:assert";
import { SecretLintCoreResult } from "@secretlint/types";
import { loadFormatter } from "../src/index.js";
import { sanitizeTerminalOutput } from "../src/sanitize-terminal-output.js";

const ESC = "\u001b";
const BEL = "\u0007";
const hasControlCharacter = (text: string) => /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(text);
const createResults = (): SecretLintCoreResult[] => [
    {
        // file name that clears the screen, sets the window title, and inserts a fake hyperlink
        filePath: `evil${ESC}[2J${ESC}]0;title${BEL}${ESC}]8;;https://example.com${ESC}\\link${ESC}]8;;${ESC}\\\r.txt`,
        sourceContent: "THIS IS SECRET SOURCE\n",
        sourceContentType: "text",
        messages: [
            {
                data: {},
                type: "message",
                message: `found secret${ESC}[31m RED${ESC}[0m\u0008\u009b`,
                messageId: `message${ESC}[1m-id`,
                range: [8, 14],
                loc: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 14 },
                },
                ruleId: `example${ESC}[8m`,
                severity: "error",
            },
        ],
    },
];

describe("sanitizeTerminalOutput", () => {
    it("removes escape sequences and control characters", () => {
        assert.strictEqual(sanitizeTerminalOutput(`a${ESC}[31mb${ESC}[0m`), "ab");
        assert.strictEqual(sanitizeTerminalOutput(`a${ESC}]0;title${BEL}b`), "ab");
        assert.strictEqual(sanitizeTerminalOutput(`a${ESC}]8;;https://example.com${ESC}\\b${ESC}]8;;${ESC}\\`), "ab");
        assert.strictEqual(sanitizeTerminalOutput("a\rb\u0008c\u007fd\u009be\u0000f"), "abcdef");
    });
    it("keeps tab, newline, and non-ASCII text", () => {
        assert.strictEqual(sanitizeTerminalOutput("a\tb\nc 日本語"), "a\tb\nc 日本語");
    });
});

describe("formatter output does not contain control characters from results", () => {
    for (const formatterName of ["stylish", "table", "compact", "unix"]) {
        it(formatterName, async () => {
            const formatter = await loadFormatter({ color: false, formatterName });
            const output = formatter.format(createResults());
            assert.ok(!hasControlCharacter(output), JSON.stringify(output));
            assert.ok(output.includes("evil"), output);
            assert.ok(output.includes("found secret RED"), output);
        });
    }
});
