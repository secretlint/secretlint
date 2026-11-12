import type { SecretLintCoreResult } from "./SecretLintCore.js";

/**
 * Get the content of the linted source by `filePath` of the result.
 *
 * The result does not have the content of the source.
 * A formatter that needs the content gets it from this function.
 * It returns `undefined` if the content is not available.
 * For example, the content is binary, or the caller does not keep the content of the file.
 * `@secretlint/node` keeps the content of the files that have messages.
 * It keeps the content of all files only for "mask-result" formatter.
 */
export type SecretLintFormatterGetSource = (filePath: string) => string | undefined;
export type SecretLintFormatterOptions = {
    /**
     * Default: true
     */
    color?: boolean;
    /**
     * Get the content of the linted source.
     * It is `undefined` if the caller does not provide the content.
     */
    getSource?: SecretLintFormatterGetSource;
};
export type SecretLintFormatter = (
    results: SecretLintCoreResult[],
    formatterConfig: SecretLintFormatterOptions,
) => string;
