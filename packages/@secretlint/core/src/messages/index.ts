import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";
import { filterIgnoredMessages } from "./filter-ignored-process";
import { createMessageProcessor } from "./MessageProcessManager";
import { filterDuplicatedMessages } from "./filter-duplicated-process";
import { sortMessagesByLocation } from "./sort-messages-process";
import { filterByAllowMessageIds } from "./filter-message-id";
import { filterMaskSecretsData } from "./filter-mask-secrets";

export type cleanupMessagesOptions = {
    reportedMessages: SecretLintCoreResultMessage[];
    ignoredMessages: SecretLintCoreIgnoreMessage[];
    allowMessageIds: {
        ruleId: string;
        messageId: string;
    }[];
    maskSecrets: boolean;
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
    const reportedMessagesWithoutAllowMessageIds = filterByAllowMessageIds(reportedMessages, options.allowMessageIds);
    const filters = options.maskSecrets
        ? [filterDuplicatedMessages, filterMaskSecretsData]
        : [filterDuplicatedMessages];
    const filterProcess = createMessageProcessor(filters);
    return sortMessagesByLocation(filterProcess.process(reportedMessagesWithoutAllowMessageIds));
};
