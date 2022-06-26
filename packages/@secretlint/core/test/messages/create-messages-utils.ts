import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";

export const createMessageFromRange = ({
    range,
    ruleId = "example",
    message = "message",
    messageId = "message-id",
    data,
}: {
    range: readonly [startIndex: number, endIndex: number];
    ruleId?: string;
    message?: string;
    messageId?: string;
    data?: object;
}): SecretLintCoreResultMessage => {
    return {
        range: range,
        ruleId: ruleId,
        severity: "error",
        type: "message",
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
        messageId: messageId,
        ...(data ? { data } : {}),
    };
};
export const createIgnoredMessageFromRange = (
    range: readonly [startIndex: number, endIndex: number],
    targetRuleId = "*"
): SecretLintCoreIgnoreMessage => {
    return {
        range: range,
        ruleId: "ignore",
        type: "ignore",
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
