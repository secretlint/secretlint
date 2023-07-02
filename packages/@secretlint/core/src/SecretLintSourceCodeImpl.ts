import { StructuredSource } from "structured-source";
import {
    SecretLintSourceCode,
    SecretLintSourceNodeLocation,
    SecretLintSourceNodePosition,
    SecretLintSourceNodeRange,
} from "@secretlint/types";
import { invariant } from "./helper/invariant.js";

/**
 * This class represent of source code.
 */
export class SecretLintSourceCodeImpl implements SecretLintSourceCode {
    readonly hasBOM: boolean;
    readonly content: string;
    readonly filePath: string | undefined;
    readonly contentType: "binary" | "text" | "unknown";
    readonly ext: string;
    private structuredSource: StructuredSource;

    constructor({
        content = "",
        ext,
        filePath,
        contentType,
    }: {
        content: string;
        ext: string;
        filePath: string;
        contentType: "binary" | "text" | "unknown";
    }) {
        invariant(ext || filePath, "should be set either of fileExt or filePath.");
        this.hasBOM = content.charCodeAt(0) === 0xfeff;
        this.content = this.hasBOM ? content.slice(1) : content;
        this.structuredSource = new StructuredSource(this.content);
        this.filePath = filePath;
        this.contentType = contentType;
        this.ext = ext;
    }

    /**
     * get filePath
     * @returns {string|undefined}
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * @param {SecretLintSourceNodeLocation} loc - location indicator.
     * @return {[ number, number ]} range.
     */
    locationToRange(loc: SecretLintSourceNodeLocation): SecretLintSourceNodeRange {
        return this.structuredSource.locationToRange(loc);
    }

    /**
     * @param {[ number, number ]} range - pair of indice.
     * @return {SecretLintSourceNodeLocation} location.
     */
    rangeToLocation(range: SecretLintSourceNodeRange): SecretLintSourceNodeLocation {
        const location = this.structuredSource.rangeToLocation(range as [number, number]);
        // Note: unwrap class instance to get plain object
        return {
            start: {
                line: location.start.line,
                column: location.start.column,
            },
            end: {
                line: location.end.line,
                column: location.end.column,
            },
        };
    }

    /**
     * @param {Position} pos - position indicator.
     * @return {number} index.
     */
    positionToIndex(pos: SecretLintSourceNodePosition): number {
        return this.structuredSource.positionToIndex(pos);
    }

    /**
     * @param {number} index - index to the source code.
     * @return {Position} position.
     */
    indexToPosition(index: number): SecretLintSourceNodePosition {
        const position = this.structuredSource.indexToPosition(index);
        // Note: unwrap class instance to get plain object
        return {
            line: position.line,
            column: position.column,
        };
    }
}
