import type { SecretLintSourceNodePosition } from "@secretlint/types";

const LINE_TERMINATOR = /[\r\n\u2028\u2029]/g;

/**
 * The index of the lines of a text. It converts an index of the text from/to a position (line and column).
 *
 * - line number starts with 1
 * - column number starts with 0
 * - line terminators are `\n`, `\r\n`, `\r`, U+2028 and U+2029
 */
export class SourceLineIndex {
    /**
     * The start index of each line
     */
    private readonly lineStartIndexes: number[] = [0];

    constructor(text: string) {
        LINE_TERMINATOR.lastIndex = 0;
        let result: RegExpExecArray | null;
        while ((result = LINE_TERMINATOR.exec(text)) !== null) {
            let index = result.index;
            // \r\n is one line terminator
            if (text.charCodeAt(index) === 0x0d && text.charCodeAt(index + 1) === 0x0a) {
                index += 1;
            }
            this.lineStartIndexes.push(index + 1);
            LINE_TERMINATOR.lastIndex = index + 1;
        }
    }

    positionToIndex(position: SecretLintSourceNodePosition): number {
        return this.lineStartIndexes[position.line - 1] + position.column;
    }

    indexToPosition(index: number): SecretLintSourceNodePosition {
        // Binary search: the number of lines that start at `index` or before `index`
        const lineStartIndexes = this.lineStartIndexes;
        let low = 0;
        let high = lineStartIndexes.length;
        while (low < high) {
            const middle = (low + high) >>> 1;
            if (lineStartIndexes[middle] <= index) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }
        return {
            line: low,
            column: index - lineStartIndexes[low - 1],
        };
    }
}
