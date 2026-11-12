import type { LintResult } from "../../src/formatters/lint/types.js";

const loc = (line: number, column: number, endColumn: number) => {
    return { start: { line, column }, end: { line, column: endColumn } };
};
/**
 * The results that have each severity, the characters to escape and fullwidth characters
 */
export const results: LintResult[] = [
    {
        filePath: "/path/to/a&b.txt",
        messages: [
            {
                ruleId: "rule-error",
                message: '[ID] found <secret> & "token".',
                line: 1,
                column: 8,
                range: [8, 14],
                loc: loc(1, 8, 14),
                severity: 2,
            },
            {
                ruleId: "preset > rule-warning",
                message: "[ID] 日本語のメッセージ",
                line: 12,
                column: 0,
                range: [100, 110],
                loc: loc(12, 0, 10),
                severity: 1,
            },
            {
                ruleId: "rule-info",
                message: "[ID] it's 100%\nsecond line",
                line: 3,
                column: 123,
                range: [200, 210],
                loc: loc(3, 123, 133),
                severity: 3,
            },
        ],
    },
    {
        filePath: "/path/to/no-message.txt",
        messages: [],
    },
    {
        filePath: "/path/to/c,d:e.txt",
        messages: [
            {
                ruleId: "rule-unknown-severity",
                message: "[ID] message",
                line: 2,
                column: 4,
                range: [10, 12],
                loc: loc(2, 4, 6),
                severity: 0,
            },
        ],
    },
];
