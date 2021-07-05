import { SecretLintCoreResult } from "@secretlint/types";
import path from "path";

export const results: SecretLintCoreResult[] = [
    {
        filePath: path.join(__dirname, "input.txt"),
        messages: [
            {
                data: {
                    ID: "SECRET",
                },
                type: "message",
                message: "warning found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8,
                    },
                    end: {
                        line: 1,
                        column: 14,
                    },
                },
                ruleId: "example",
                severity: "warning",
            },
            {
                data: {
                    ID: "SECRET",
                },
                type: "message",
                message: "error found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8,
                    },
                    end: {
                        line: 1,
                        column: 14,
                    },
                },
                ruleId: "example",
                severity: "error",
            },
            {
                data: {
                    ID: "SECRET",
                },
                type: "message",
                message: "error found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8,
                    },
                    end: {
                        line: 1,
                        column: 14,
                    },
                },
                ruleId: "example",
                ruleParentId: "parent",
                severity: "error",
            },
        ],
    },
    {
        filePath: path.join(__dirname, "input.no-secret.txt"),
        messages: [],
    },
];
