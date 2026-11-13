/**
 * Ported from @textlint/linter-formatter
 *
 * Original code is https://github.com/azer/prettify-error
 * Author : azer
 */
import { readFileSync } from "node:fs";
import { stripVTControlCharacters, styleText } from "node:util";
import { stringWidth } from "../../helper/string-width.js";
import type { LintFormatter, LintMessage } from "./types.js";

const summaryColor = "yellow";
const GREY = "\u001B[90m";
const RED = "\u001B[31m";
const RESET = "\u001B[0m";

function pluralize(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
}

type CodeLine = { line: number; code?: string; col?: number; failed?: boolean };

/**
 * Get the line of the message, the previous line and the next line
 */
function failingCode(code: string, message: LintMessage): CodeLine[] {
    const result = [];
    const lines = code.split("\n");
    let i = message.line - 3;
    while (++i < message.line + 1) {
        if (i + 1 !== message.line) {
            result.push({
                line: message.line - (message.line - i - 1),
                code: lines[i],
            });
            continue;
        }

        result.push({
            line: message.line,
            col: message.column,
            code: lines[i],
            failed: true,
        });
    }

    return result;
}

/**
 * Create a line that has the mark at the column of the message
 */
function showColumn(codes: CodeLine[], ch: string): string {
    let result = "";
    const codeObject = codes[1] as { code: string; col: number };
    const sliced = codeObject.code.slice(0, codeObject.col);
    const width = stringWidth(sliced);
    if (width <= 0) {
        return "";
    }
    let i = width - 1;

    while (i--) {
        result += " ";
    }

    return result + ch;
}

function prettyError(code: string, filePath: string, message: LintMessage): string | undefined {
    if (!code) {
        return;
    }
    const parsed = failingCode(code, message);
    const previousLineNo = String(parsed[0].line);
    const failingLineNo = String(parsed[1].line);
    const nextLineNo = String(parsed[2].line);
    const linumlen = Math.max(previousLineNo.length, failingLineNo.length, nextLineNo.length);
    const paddingForLineNo = "".padStart(linumlen);
    const previousLine = parsed[0].code ? parsed[0].code : "";
    const nextLine = parsed[2].code ? parsed[2].code : "";
    return (
        `${GREY}${message.ruleId}: ${RED}${message.message}${RESET}\n` +
        `${GREY}${filePath}:${message.line}:${message.column}${RESET}\n` +
        `    ${RED}${paddingForLineNo}  ${showColumn(parsed, "v")}${RESET}\n` +
        `    ${GREY}${previousLineNo.padStart(linumlen)}. ${previousLine}${RESET}\n` +
        `    ${RESET}${failingLineNo.padStart(linumlen)}. ${parsed[1].code}${RESET}\n` +
        `    ${GREY}${nextLineNo.padStart(linumlen)}. ${nextLine}${RESET}\n` +
        `    ${RED}${paddingForLineNo}  ${showColumn(parsed, "^")}${RESET}\n`
    );
}

const formatter: LintFormatter = (results, options) => {
    // default: true
    const useColor = options.color !== undefined ? options.color : true;
    let output = "";
    let total = 0;
    let errors = 0;
    let warnings = 0;
    let infos = 0;
    results.forEach(function (result) {
        const code = readFileSync(result.filePath, "utf-8");
        const messages = result.messages;
        if (messages.length === 0) {
            return;
        }
        total += messages.length;
        messages.forEach(function (message) {
            if (message.severity === 2) {
                errors++;
            } else if (message.severity === 3) {
                infos++;
            } else {
                warnings++;
            }
            const r = prettyError(code, result.filePath, message);
            if (r) {
                output += `${r}\n`;
            }
        });
    });

    if (total > 0) {
        const problemParts = [];
        if (errors > 0) {
            problemParts.push(`${errors} ${pluralize("error", errors)}`);
        }
        if (warnings > 0) {
            problemParts.push(`${warnings} ${pluralize("warning", warnings)}`);
        }
        if (infos > 0) {
            problemParts.push(`${infos} ${pluralize("info", infos)}`);
        }

        output += styleText(
            [summaryColor, "bold"],
            ["✖ ", total, pluralize(" problem", total), " (", problemParts.join(", "), ")\n"].join(""),
        );
    }

    if (!useColor) {
        return stripVTControlCharacters(output);
    }
    return output;
};

export default formatter;
