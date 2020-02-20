// Util
/**
 * Source has three types
 *
 * - Up: type
 * - Middle: ext
 * - details: filePath
 */
export type SecretLintRawSource = {
    content: string;
    filePath: string;
    /**
     * Prefer ext than filePath
     */
    ext?: string;
    /**
     *
     * Default: "unknown"
     */
    contentType: "binary" | "text" | "unknown";
};
export type SecretLintSourceNodePosition = {
    line: number;
    column: number;
};
/**
 * Line number starts with 1.
 * Column number starts with 0.
 */
export type SecretLintSourceNodeLocation = {
    start: SecretLintSourceNodePosition;
    end: SecretLintSourceNodePosition;
};
export type SecretLintSourceNodeRange = number[];
export type SecretLintSourceValueNode = {
    type: "Value";
    value: string;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
export type SecretLintSourceIdentifierNode = {
    type: "Identifier";
    name: string;
    value?: SecretLintSourceValueNode;
    range: SecretLintSourceNodeRange;
    loc: SecretLintSourceNodeLocation;
};
