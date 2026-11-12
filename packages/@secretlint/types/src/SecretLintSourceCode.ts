import type {
    SecretLintSourceNodeLocation,
    SecretLintSourceNodePosition,
    SecretLintSourceNodeRange,
} from "./SecretLintSource.js";

/**
 * This class represent of source code.
 */
export interface SecretLintSourceCode {
    readonly hasBOM: boolean;
    readonly content: string;
    readonly filePath: string | undefined;
    readonly physicalFilePath: string | undefined;
    readonly contentType: "binary" | "text" | "unknown";
    readonly ext: string;
    /**
     * The bytes of the source, or `undefined` when the caller does not give them.
     * For binary content, they are the original bytes of the file, which `content` has lost in the decoding.
     * For text, they are the UTF-8 encoding of the content, including the byte order mark if the file has one.
     *
     * The bytes are available until the lint of the source ends.
     * Do not change them, and copy them if the rule keeps them after the lint,
     * because the caller may reuse the buffer for the next file.
     */
    readonly contentBytes: Uint8Array | undefined;

    /**
     * get file path
     * This return `undefined` if the source code is created without file path.
     * For example, use core API to create a source code directly.
     *
     * You can use this path to detect file type.
     * However, if you want to read the file content, use `getPhysicalFilePath` instead.
     * @returns {string|undefined}
     */
    getFilePath(): string | undefined;

    /**
     * get physical file path
     * This return `undefined` if the source code is not related to file.
     * For example, the source code is given from the stdin.
     *
     * You can use this path to read the file content.
     */
    getPhysicalFilePath(): string | undefined;

    // StructuredSource wrapper
    /**
     * @param  loc - location indicator.
     * @return {[ number, number ]} range.
     */
    locationToRange(loc: SecretLintSourceNodeLocation): SecretLintSourceNodeRange;

    /**
     * @param {[ number, number ]} range - pair of indice.
     * @return location.
     */
    rangeToLocation(range: SecretLintSourceNodeRange): SecretLintSourceNodeLocation;

    /**
     * @param {Position} pos - position indicator.
     * @return {number} index.
     */
    positionToIndex(pos: SecretLintSourceNodePosition): number;

    /**
     * @param {number} index - index to the source code.
     * @return {Position} position.
     */
    indexToPosition(index: number): SecretLintSourceNodePosition;
}
