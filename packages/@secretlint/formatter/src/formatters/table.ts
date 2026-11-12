import { SecretLintCoreResult, SecretLintCoreResultMessage, SecretLintFormatter } from "@secretlint/types";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
import { stripVTControlCharacters, styleText } from "node:util";
import { drawTable as drawBorderedTable, TableCell } from "../helper/draw-table.js";
import { sanitizeTerminalOutput } from "../sanitize-terminal-output.js";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Return the count and the word. Add "s" to the word if the count is not one.
 */
const pluralize = (word: string, count: number): string => {
    return `${count} ${count === 1 ? word : `${word}s`}`;
};

/**
 * Draws text table.
 * @param {Array<Object>} messages Error messages relating to a specific file.
 * @returns {string} A text table.
 */
function drawTable(messages: SecretLintCoreResultMessage[]): string {
    const rows: TableCell[][] = [];

    if (messages.length === 0) {
        return "";
    }

    const bold = (text: string) => styleText("bold", text);
    rows.push(
        ["Line", "Column", "Type", "Message", "Rule ID"].map((text) => {
            return { text, style: bold };
        }),
    );

    messages.forEach(function (message) {
        const messageType: TableCell =
            message.severity === "error"
                ? { text: "error", style: (text) => styleText("red", text) }
                : { text: "warning", style: (text) => styleText("yellow", text) };

        rows.push([
            { text: String(message.loc.start.line) },
            { text: String(message.loc.start.column) },
            messageType,
            { text: sanitizeTerminalOutput(message.message) },
            { text: sanitizeTerminalOutput(message.ruleId) },
        ]);
    });

    return drawBorderedTable(rows, {
        columns: [{ width: 8 }, { width: 8 }, { width: 8 }, { width: 50, paddingRight: 5 }, { width: 20 }],
        drawHorizontalLine: function (index: number) {
            return index === 1;
        },
    });
}

/**
 * Draws a report (multiple tables).
 * @param {Array} results Report results for every file.
 * @returns {string} A column of text tables.
 */
function drawReport(results: SecretLintCoreResult[]): string {
    let files;

    files = results.map(function (result) {
        if (!result.messages.length) {
            return "";
        }

        return "\n" + sanitizeTerminalOutput(result.filePath) + "\n\n" + drawTable(result.messages);
    });

    files = files.filter(function (content: string) {
        return content.trim();
    });

    return files.join("");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

const formatter: SecretLintFormatter = (results, options) => {
    const useColor = options.color ?? true;
    let output = "";
    let errorCount = 0;
    let warningCount = 0;

    results.forEach((fileReport) => {
        fileReport.messages.forEach((message) => {
            if (message.severity === "warning") {
                warningCount += 1;
            } else if (message.severity === "error") {
                errorCount += 1;
            }
        });
    });

    if (errorCount || warningCount) {
        output = drawReport(results);
    }

    output +=
        "\n" +
        drawBorderedTable(
            [
                [{ text: pluralize("Error", errorCount), style: (text) => styleText("red", text) }],
                [{ text: pluralize("Warning", warningCount), style: (text) => styleText("yellow", text) }],
            ],
            {
                columns: [{ width: 110 }],
                drawHorizontalLine: function () {
                    return true;
                },
            },
        );

    if (!useColor) {
        return stripVTControlCharacters(output);
    }
    return output;
};

export default formatter;
