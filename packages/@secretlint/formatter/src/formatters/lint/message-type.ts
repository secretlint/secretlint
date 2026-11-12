import type { LintMessage } from "./types.js";

/**
 * Return the name of the severity of the message
 */
export const getMessageType = <T extends string>(message: LintMessage, names: { error: T; warning: T; info: T }): T => {
    if (message.severity === 2) {
        return names.error;
    } else if (message.severity === 3) {
        return names.info;
    }
    return names.warning;
};
