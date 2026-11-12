import type { SecretLintSourceNodeLocation, SecretLintSourceNodeRange } from "@secretlint/types";

/**
 * The severity of a message as a number.
 * It is the same as the severity of textlint, because these formatters are ported from textlint.
 *
 * - 1: warning
 * - 2: error
 * - 3: info
 *
 * secretlint passes `0` for "info", and the formatters treat an unknown number as warning.
 */
export type LintMessageSeverity = number;
/**
 * A message for the formatters in this directory.
 * It is created from SecretLintCoreResultMessage.
 */
export type LintMessage = {
    ruleId: string;
    message: string;
    /**
     * start with 1
     */
    line: number;
    /**
     * start with 0
     */
    column: number;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
    severity: LintMessageSeverity;
};
export type LintResult = {
    filePath: string;
    messages: LintMessage[];
};
export type LintFormatterOptions = {
    /**
     * Default: true
     */
    color?: boolean;
};
export type LintFormatter = (results: LintResult[], options: LintFormatterOptions) => string;
