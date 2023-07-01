import { SecretLintCoreResult, SecretLintCoreResultMessage, SecretLintFormatter } from "@secretlint/types";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
import chalk from "chalk";
import { table } from "table";
import stripAnsi from "strip-ansi";
import pluralize from "pluralize";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Draws text table.
 * @param {Array<Object>} messages Error messages relating to a specific file.
 * @returns {string} A text table.
 */
function drawTable(messages: SecretLintCoreResultMessage[]): string {
    let rows: any = [];

    if (messages.length === 0) {
        return "";
    }

    rows.push([
        chalk.bold("Line"),
        chalk.bold("Column"),
        chalk.bold("Type"),
        chalk.bold("Message"),
        chalk.bold("Rule ID"),
    ]);

    messages.forEach(function (message) {
        let messageType;

        if (message.severity === "error") {
            messageType = chalk.red("error");
        } else {
            messageType = chalk.yellow("warning");
        }

        rows.push([message.loc.start.line, message.loc.start.column, messageType, message.message, message.ruleId]);
    });

    const output = table(rows, {
        columns: {
            0: {
                width: 8,
                wrapWord: true,
            },
            1: {
                width: 8,
                wrapWord: true,
            },
            2: {
                width: 8,
                wrapWord: true,
            },
            3: {
                paddingRight: 5,
                width: 50,
                wrapWord: true,
            },
            4: {
                width: 20,
                wrapWord: true,
            },
        },
        drawHorizontalLine: function (index: number) {
            return index === 1;
        },
    });
    return output;
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

        return "\n" + result.filePath + "\n\n" + drawTable(result.messages);
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
        table(
            [
                [chalk.red(pluralize("Error", errorCount, true))],
                [chalk.yellow(pluralize("Warning", warningCount, true))],
            ],
            {
                columns: {
                    0: {
                        width: 110,
                        wrapWord: true,
                    },
                },
                drawHorizontalLine: function () {
                    return true;
                },
            }
        );

    if (!useColor) {
        return stripAnsi(output);
    }
    return output;
};

export default formatter;
