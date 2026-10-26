import type { SecretLintConfigDescriptor, SecretLintRuleSeverityLevel } from "@secretlint/types";

/**
 * A problem in the config file that is reported like a lint message.
 */
export type SecretLintConfigMessage = {
    messageId: string;
    message: string;
    severity: SecretLintRuleSeverityLevel;
};

/**
 * Find problems in the config file that should be reported as lint messages
 */
export const getConfigMessages = (configDescriptor: SecretLintConfigDescriptor): SecretLintConfigMessage[] => {
    const messages: SecretLintConfigMessage[] = [];
    if (configDescriptor.rules.length === 0) {
        messages.push({
            messageId: "NO_RULES",
            message: `No rules are configured. secretlint does not detect any secrets. Add rules to "rules" in the config file.`,
            severity: "warning",
        });
    }
    return messages;
};
