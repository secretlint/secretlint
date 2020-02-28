import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";
import { filterIgnoredMessages } from "./filter-ignored-process";
import { createMessageProcessor } from "./MessageProcessManager";
import { filterDuplicatedMessages } from "./filter-duplicated-process";
import { sortMessagesByLocation } from "./sort-messages-process";
import { filterByAllowMessages } from "./filter-message-id";

export type cleanupMessagesOptions = {
    reportedMessages: SecretLintCoreResultMessage[];
    ignoredMessages: SecretLintCoreIgnoreMessage[];
    allowMessages: {
        ruleId: string;
        messageId: string;
    }[];
};
/**
 * Cleanup messages
 * - filter ignored range
 * - filter disabled message
 * - filter duplicated messages
 * - sort messages by range
 * @param options
 */
export const cleanupMessages = (options: cleanupMessagesOptions): SecretLintCoreResultMessage[] => {
    const reportedMessages = filterIgnoredMessages(options);
    const reportedMessagesWithoutAllowMessages = filterByAllowMessages(reportedMessages, options.allowMessages);
    const filterProcess = createMessageProcessor([filterDuplicatedMessages]);
    return sortMessagesByLocation(filterProcess.process(reportedMessagesWithoutAllowMessages));
};
