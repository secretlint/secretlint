import { SecretLintCoreResult } from "./SecretLintCore";

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
