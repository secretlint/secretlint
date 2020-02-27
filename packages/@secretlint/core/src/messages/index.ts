import { SecretLintCoreIgnoreMessage, SecretLintCoreResultMessage } from "@secretlint/types";
import { filterIgnoredMessages } from "./filter-ignored-process";
import { createMessageProcessor } from "./MessageProcessManager";
import { filterDuplicatedMessages } from "./filter-duplicated-process";
import { sortByLineColumn } from "./sort-messages-process";

export type cleanupMessagesOptions = {
    reportedMessages: SecretLintCoreResultMessage[];
    ignoredMessages: SecretLintCoreIgnoreMessage[];
};
export const cleanupMessages = (options: cleanupMessagesOptions): SecretLintCoreResultMessage[] => {
    const messages = filterIgnoredMessages(options);
    const filterProcess = createMessageProcessor([filterDuplicatedMessages]);
    return sortByLineColumn(filterProcess.process(messages));
};
