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
    readonly filePath: string | undefined;
    readonly physicalFilePath: string | undefined;
    readonly contentType: "binary" | "text" | "unknown";
    readonly ext: string;
    readonly contentBytes: Uint8Array | undefined;
    private _getRawContent: (() => string) | undefined;
    private _rawContent: string | undefined;
    private _content: string | undefined;
    private _structuredSource: StructuredSource | undefined;

    constructor({
        content = "",
        ext,
        filePath,
        physicalFilePath,
        contentType,
        contentBytes,
    }: {
        /**
         * Content string or a function that returns the content.
         * The function is called lazily when the content is accessed at first.
         */
        content: string | (() => string);
        ext: string;
        filePath: string;
        physicalFilePath: string | undefined;
        contentType: "binary" | "text" | "unknown";
        /**
         * The bytes of the source. See `SecretLintSourceCode#contentBytes`.
         */
        contentBytes?: Uint8Array;
    }) {
        invariant(ext || filePath, "should be set either of fileExt or filePath.");
        if (typeof content === "function") {
            this._getRawContent = content;
        } else {
            this._rawContent = content;
        }
        this.filePath = filePath;
        this.physicalFilePath = physicalFilePath;
        this.contentType = contentType;
        this.ext = ext;
        this.contentBytes = contentBytes;
    }

    private get rawContent(): string {
        if (this._rawContent === undefined) {
            this._rawContent = this._getRawContent?.() ?? "";
            this._getRawContent = undefined;
        }
        return this._rawContent;
    }

    get hasBOM(): boolean {
        return this.rawContent.charCodeAt(0) === 0xfeff;
    }

    get content(): string {
        if (this._content === undefined) {
            this._content = this.hasBOM ? this.rawContent.slice(1) : this.rawContent;
        }
        return this._content;
    }

    /**
     * StructuredSource builds the line index of the content.
     * It is created lazily because most files do not have any report and do not need location info.
     */
    private get structuredSource(): StructuredSource {
        if (this._structuredSource === undefined) {
            this._structuredSource = new StructuredSource(this.content);
        }
        return this._structuredSource;
    }

    /**
     * get file path
     * This return `undefined` if the source code is created without file path.
     * For example, use core API to create a source code directly.
     *
     * You can use this path to detect file type.
     * However, if you want to read the file content, use `getPhysicalFilePath` instead.
     * @returns {string|undefined}
     */
    getFilePath(): string | undefined {
        return this.filePath;
    }

    /**
     * get physical file path
     * This return `undefined` if the source code is not related to file.
     * For example, the source code is given from the stdin.
     *
     * You can use this path to read the file content.
     */
    getPhysicalFilePath(): string | undefined {
        return this.physicalFilePath;
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
