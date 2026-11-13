/**
 * @fileoverview github-style formatter.
 * @author thompson-tomo
 * @copyright 2015 James Thompson 2025. All rights reserved.
 *
 * Ported from @textlint/linter-formatter
 */
import { getMessageType } from "./message-type.js";
import type { LintFormatter } from "./types.js";

/**
 * Percent-encode a character, e.g. "\n" -> "%0A".
 */
function percentEncode(char: string): string {
    return `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`;
}

/**
 * Escape a value used as the data part of a GitHub Actions workflow command.
 * Without this, a newline in the value could start a new (forged) workflow command.
 * Escapes `%`, `\r`, `\n`.
 * @see https://github.com/actions/toolkit/blob/main/packages/core/src/command.ts
 */
function escapeData(value: string): string {
    return value.replace(/[%\r\n]/g, percentEncode);
}

/**
 * Escape a value used as a property (e.g. `file=`, `title=`) of a GitHub Actions workflow command.
 * Escapes `%`, `\r`, `\n`, `:`, `,`.
 * @see https://github.com/actions/toolkit/blob/main/packages/core/src/command.ts
 */
function escapeProperty(value: string): string {
    return value.replace(/[%\r\n:,]/g, percentEncode);
}

const formatter: LintFormatter = (results) => {
    let output = "";

    results.forEach(function (result) {
        const messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        output += `::group::${escapeData(result.filePath)}\n`;

        // ::warning file={name},line={line},endLine={endLine},title={title}::{message} is the format used by github to generate annotations
        messages.forEach(function (message) {
            output += `::${getMessageType(message, { error: "error", warning: "warning", info: "notice" })} `;
            output += `file=${escapeProperty(result.filePath)},`;
            output += `line=${message.loc.start.line || 1},`;
            output += `endLine=${message.loc.end.line || message.loc.start.line || 1},`;
            output += `col=${message.loc.start.column || 1},`;
            output += `endColumn=${message.loc.end.column || message.loc.start.column || 1},`;
            output += `title=${escapeProperty(`TextLint${message.ruleId ? ` [${message.ruleId}]` : ""}`)}::`;
            output += `${escapeData(message.message.trim())}`;
            output += ` | ${message.loc.start.line || 1}:`;
            output += `${message.loc.start.column || 1}`;
            output += "\n";
        });
        output += "::endgroup::\n";
    });

    return output;
};

export default formatter;
