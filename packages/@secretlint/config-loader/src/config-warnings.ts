import type { SecretLintConfigDescriptor } from "@secretlint/types";

/**
 * A problem in the config file that does not stop linting.
 */
export type SecretLintConfigWarning = {
    messageId: string;
    message: string;
};

/**
 * Find problems in the config file that should be reported as warnings
 */
export const getConfigWarnings = (configDescriptor: SecretLintConfigDescriptor): SecretLintConfigWarning[] => {
    const warnings: SecretLintConfigWarning[] = [];
    if (configDescriptor.rules.length === 0) {
        warnings.push({
            messageId: "NO_RULES",
            message: `No rules are configured. secretlint does not detect any secrets. Add rules to "rules" in the config file.`,
        });
    }
    return warnings;
};
