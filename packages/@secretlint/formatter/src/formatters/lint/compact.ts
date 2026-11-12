/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 *
 * Ported from @textlint/linter-formatter
 */
import { getMessageType } from "./message-type.js";
import type { LintFormatter } from "./types.js";

const formatter: LintFormatter = (results) => {
    let output = "",
        total = 0;

    results.forEach(function (result) {
        const messages = result.messages;
        total += messages.length;

        messages.forEach(function (message) {
            output += `${result.filePath}: `;
            output += `line ${message.line || 0}`;
            output += `, col ${message.column || 0}`;
            output += `, ${getMessageType(message, { error: "Error", warning: "Warning", info: "Info" })}`;
            output += ` - ${message.message}`;
            output += message.ruleId ? ` (${message.ruleId})` : "";
            output += "\n";
        });
    });

    if (total > 0) {
        output += `\n${total} problem${total !== 1 ? "s" : ""}\n`;
    }

    return output;
};

export default formatter;
