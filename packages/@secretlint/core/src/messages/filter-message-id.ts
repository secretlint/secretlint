import { SecretLintCoreResultMessage } from "@secretlint/types";

export type DisabledMessage = {
    ruleId: string;
    messageId: string;
};
export const filterByDisabledMessages = (
    messages: SecretLintCoreResultMessage[],
    disabledMessages: DisabledMessage[]
): SecretLintCoreResultMessage[] => {
    const disabledSet = new Set(
        disabledMessages.map(disabledMessage => {
            return `${disabledMessage.ruleId}--${disabledMessage.messageId}`;
        })
    );
    return messages.filter(message => {
        return !disabledSet.has(`${message.ruleId}--${message.messageId}`);
    });
};
