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
    readonly contentType: "binary" | "text" | "unknown";
    readonly ext: string;

    /**
     * get filePath
     * @returns {string|undefined}
     */
    getFilePath(): string | undefined;

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
