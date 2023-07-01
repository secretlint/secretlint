// LICENSE : MIT
import { SecretLintCoreResultMessage, SecretLintCoreIgnoreMessage } from "@secretlint/types";

export type SecretLintAllMessages = SecretLintCoreResultMessage | SecretLintCoreIgnoreMessage;
export type SecretLintMessageProcessor = (messages: Array<SecretLintAllMessages>) => Array<SecretLintAllMessages>;

export const createMessageProcessor = (processors: SecretLintMessageProcessor[]) => {
    return {
        /**
         * process `messages` with registered processes
         */
        process<R extends SecretLintAllMessages>(messages: Array<SecretLintAllMessages>): R[] {
            const originalMessages = messages;
            if (processors.length === 0) {
                throw new Error("processors should be > 0");
            }
            return processors.reduce((messages, filter) => {
                return filter(messages);
            }, originalMessages) as R[];
        },
    };
};
