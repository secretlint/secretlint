import { SecretLintCoreResultMessage } from "@secretlint/types";

export type AllowMessage = {
    ruleId: string;
    messageId: string;
};
export const filterByAllowMessages = (
    messages: SecretLintCoreResultMessage[],
    allowMessages: AllowMessage[]
): SecretLintCoreResultMessage[] => {
    const disabledSet = new Set(
        allowMessages.map(allowMessage => {
            return `${allowMessage.ruleId}--${allowMessage.messageId}`;
        })
    );
    return messages.filter(message => {
        return !disabledSet.has(`${message.ruleId}--${message.messageId}`);
    });
};
