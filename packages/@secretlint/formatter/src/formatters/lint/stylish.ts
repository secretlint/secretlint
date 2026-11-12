/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 *
 * Ported from @textlint/linter-formatter
 */
import { stripVTControlCharacters, styleText } from "node:util";
import { stringWidth } from "../../helper/string-width.js";
import type { LintFormatter } from "./types.js";

/**
 * Given a word and a count, append an s if count is not one.
 */
function pluralize(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
}

/**
 * The width of the longest line of the text
 */
const maxLineWidth = (text: string): number => {
    return Math.max(...stripVTControlCharacters(text).split("\n").map(stringWidth));
};

/**
 * Align the columns of the rows with spaces.
 * @param rows
 * @param align "r" aligns the column to the right. Otherwise, to the left
 */
const alignColumns = (rows: string[][], align: string[]): string => {
    const columnWidths: number[] = [];
    for (const row of rows) {
        row.forEach((cell, index) => {
            columnWidths[index] = Math.max(columnWidths[index] ?? 0, maxLineWidth(cell));
        });
    }
    return rows
        .map((row) => {
            return row
                .map((cell, index) => {
                    const space = " ".repeat(Math.max(columnWidths[index] - maxLineWidth(cell), 0));
                    return align[index] === "r" ? space + cell : cell + space;
                })
                .join("  ")
                .replace(/\s+$/, "");
        })
        .join("\n");
};

const formatter: LintFormatter = (results, options) => {
    // default: true
    const useColor = options.color !== undefined ? options.color : true;

    let output = "\n";
    let total = 0;
    let errors = 0;
    let warnings = 0;
    let infos = 0;
    let summaryColor: "yellow" | "red" = "yellow";

    results.forEach(function (result) {
        const messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        total += messages.length;
        output += `${styleText("underline", result.filePath)}\n`;

        output += `${alignColumns(
            messages.map(function (message) {
                let messageType;
                if (message.severity === 2) {
                    messageType = styleText("red", "error");
                    summaryColor = "red";
                    errors++;
                } else if (message.severity === 3) {
                    messageType = styleText("green", "info");
                    infos++;
                } else {
                    messageType = styleText("yellow", "warning");
                    warnings++;
                }

                return [
                    "",
                    String(message.line || 0),
                    String(message.column || 0),
                    messageType,
                    message.message.replace(/\.$/, ""),
                    styleText("gray", message.ruleId || ""),
                ];
            }),
            ["", "r", "l"],
        )
            .split("\n")
            .map(function (el: string) {
                return el.replace(/(\d+)\s+(\d+)/, function (_, p1, p2) {
                    return styleText("gray", `${p1}:${p2}`);
                });
            })
            .join("\n")}\n\n`;
    });

    if (total > 0) {
        const summaryParts = [
            `${errors} ${pluralize("error", errors)}`,
            `${warnings} ${pluralize("warning", warnings)}`,
            `${infos} ${pluralize("info", infos)}`,
        ];
        output += styleText(
            [summaryColor, "bold"],
            ["✖ ", total, pluralize(" problem", total), " (", summaryParts.join(", "), ")\n"].join(""),
        );
    }

    const finalOutput = total > 0 ? output : "";
    if (!useColor) {
        return stripVTControlCharacters(finalOutput);
    }
    return finalOutput;
};

export default formatter;
