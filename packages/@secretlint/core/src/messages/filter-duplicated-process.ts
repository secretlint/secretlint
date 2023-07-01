// LICENSE : MIT
import { SecretLintAllMessages } from "./MessageProcessManager.js";

/**
 * equal message
 */
const isEqualMessage = (aMessage: SecretLintAllMessages, bMessage: SecretLintAllMessages) => {
    return (
        aMessage.range[0] === bMessage.range[0] &&
        aMessage.range[1] === bMessage.range[1] &&
        "severity" in aMessage &&
        "severity" in bMessage &&
        aMessage.severity === bMessage.severity &&
        aMessage.message === bMessage.message
    );
};

/**
 * filter duplicated messages
 */
export function filterDuplicatedMessages(messages: SecretLintAllMessages[] = []) {
    return messages.filter((message, index) => {
        const restMessages = messages.slice(index + 1);
        return !restMessages.some((restMessage) => {
            return isEqualMessage(message, restMessage);
        });
    });
}
