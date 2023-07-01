import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";
import { filterIgnoredMessages } from "./filter-ignored-process.js";
import { createMessageProcessor } from "./MessageProcessManager.js";
import { filterDuplicatedMessages } from "./filter-duplicated-process.js";
import { sortMessagesByLocation } from "./sort-messages-process.js";
import { filterByAllowMessageIds } from "./filter-message-id.js";
import { filterMaskSecretsData } from "./filter-mask-secrets.js";

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
 * Post cleanup messages
 * - filter ignored range
 * - filter disabled message
 * - [masSecrets] mask secrets message
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
