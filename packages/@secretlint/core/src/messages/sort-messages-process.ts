// LICENSE : MIT
import { SecretLintCoreResultMessage } from "@secretlint/types";

/**
 * sort messages by line and column
 */
export function sortMessagesByLocation(messages: SecretLintCoreResultMessage[]): SecretLintCoreResultMessage[] {
    // sort by line and column
    return messages.sort(function (a, b) {
        const startIndexDiff = a.range[0] - b.range[0];
        if (startIndexDiff === 0) {
            return a.range[1] - b.range[1];
        } else {
            return startIndexDiff;
        }
    });
}
