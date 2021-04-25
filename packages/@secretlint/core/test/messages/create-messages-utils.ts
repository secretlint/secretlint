import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";

export const createMessageFromRange = (
    range: number[],
    ruleId = "example",
    message = "message"
): SecretLintCoreResultMessage => {
    return {
        range: range,
        ruleId: ruleId,
        severity: "error",
        loc: {
            start: {
                line: 1,
                column: 0,
            },
            end: {
                line: 1,
                column: 0,
            },
        },
        message: message,
        messageId: message,
    };
};
export const createIgnoredMessageFromRange = (range: number[], targetRuleId = "*"): SecretLintCoreIgnoreMessage => {
    return {
        range: range,
        ruleId: "ignore",
        targetRuleId: targetRuleId,
        loc: {
            start: {
                line: 1,
                column: 0,
            },
            end: {
                line: 1,
                column: 0,
            },
        },
        message: "messages",
    };
};
