import { SecretLintCoreResult } from "@secretlint/types";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const results: SecretLintCoreResult[] = [
    {
        filePath: path.join(__dirname, "input.txt"),
        sourceContentType: "text",
        sourceContent: "THIS IS SECRET SOURCE",
        messages: [
            {
                data: {
                    ID: "SECRET"
                },
                type: "message",
                message: "warning found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                },
                ruleId: "example",
                severity: "warning",
                docsUrl: "https://example.com/example"
            },
            {
                data: {
                    ID: "SECRET"
                },
                type: "message",
                message: "error found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                },
                ruleId: "example",
                severity: "error",
                docsUrl: "https://example.com/example"
            },
            {
                data: {
                    ID: "SECRET"
                },
                type: "message",
                message: "error found secret: SECRET",
                messageId: "message-id",
                range: [8, 14],
                loc: {
                    start: {
                        line: 1,
                        column: 8
                    },
                    end: {
                        line: 1,
                        column: 14
                    }
                },
                ruleId: "example",
                ruleParentId: "parent",
                severity: "error",
                docsUrl: "https://example.com/example"
            }
        ]
    },
    {
        filePath: path.join(__dirname, "input.no-secret.txt"),
        sourceContentType: "text",
        sourceContent: "THIS IS PUBLIC SOURCE",
        messages: []
    }
];
