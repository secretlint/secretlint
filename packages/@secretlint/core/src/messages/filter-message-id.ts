import { SecretLintCoreResultMessage } from "@secretlint/types";

export type AllowMessage = {
    ruleId: string;
    messageId: string;
};
export const filterByAllowMessageIds = (
    messages: SecretLintCoreResultMessage[],
    allowMessageIds: AllowMessage[]
): SecretLintCoreResultMessage[] => {
    const disabledSet = new Set(
        allowMessageIds.map((allowMessage) => {
            return `${allowMessage.ruleId}--${allowMessage.messageId}`;
        })
    );
    return messages.filter((message) => {
        return !disabledSet.has(`${message.ruleId}--${message.messageId}`);
    });
};
