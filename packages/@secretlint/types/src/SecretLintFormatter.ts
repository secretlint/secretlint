import type { SecretLintCoreResult } from "./SecretLintCore.js";

export type SecretLintFormatterOptions = {
    /**
     * Default: true
     */
    color?: boolean;
    /**
     * Version of the scanner producing the results, not the formatter package.
     */
    secretlintVersion?: string;
};
export type SecretLintFormatter = (
    results: SecretLintCoreResult[],
    formatterConfig: SecretLintFormatterOptions
) => string;
