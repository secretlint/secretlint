import type { SecretLintCoreResult } from "./SecretLintCore.js";

export type SecretLintFormatterOptions = {
    /**
     * Default: true
     */
    color?: boolean;
};
export type SecretLintFormatter = (
    results: SecretLintCoreResult[],
    formatterConfig: SecretLintFormatterOptions
) => string;
