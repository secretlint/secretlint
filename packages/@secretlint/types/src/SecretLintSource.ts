// Util
/**
 * Source has three types
 *
 * - Large Area: contentType
 * - Middle Area: ext
 * - Small Area(details): filePath
 */
export type SecretLintRawSource = {
    content: string;
    /**
     * The content as UTF-8 bytes.
     * If it is defined, secretlint scans the bytes for the keywords of the rules,
     * and reads `content` only when a rule needs it.
     * So `content` can be a getter that decodes the bytes lazily.
     * `contentBytes` must be the UTF-8 encoding of `content`. A byte order mark at the start is allowed.
     */
    contentBytes?: Uint8Array;
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
export type SecretLintSourceNodeRange = readonly [startIndex: number, endIndex: number];
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
