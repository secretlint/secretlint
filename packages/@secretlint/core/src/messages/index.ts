import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";
import { filterIgnoredMessages } from "./filter-ignored-process";
import { createMessageProcessor } from "./MessageProcessManager";
import { filterDuplicatedMessages } from "./filter-duplicated-process";
import { sortMessagesByLocation } from "./sort-messages-process";
import { filterByDisabledMessages } from "./filter-message-id";

export type cleanupMessagesOptions = {
    reportedMessages: SecretLintCoreResultMessage[];
    ignoredMessages: SecretLintCoreIgnoreMessage[];
    disabledMessages: {
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
    const reportedMessagesWithoutDisabledMessages = filterByDisabledMessages(
        reportedMessages,
        options.disabledMessages
    );
    const filterProcess = createMessageProcessor([filterDuplicatedMessages]);
    return sortMessagesByLocation(filterProcess.process(reportedMessagesWithoutDisabledMessages));
};
