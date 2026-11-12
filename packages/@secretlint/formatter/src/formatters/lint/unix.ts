/**
 * @fileoverview unix-style formatter.
 * @author oshi-shinobu
 * @copyright 2015 oshi-shinobu. All rights reserved.
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
            const messageType = getMessageType(message, { error: "Error", warning: "Warning", info: "Info" });
            output += `${result.filePath}:`;
            output += `${message.line || 0}:`;
            output += `${message.column || 0}:`;
            output += ` ${message.message} `;
            output += `[${messageType}${message.ruleId ? `/${message.ruleId}` : ""}]`;
            output += "\n";
        });
    });

    if (total > 0) {
        output += `\n${total} problem${total !== 1 ? "s" : ""}\n`;
    }

    return output;
};

export default formatter;
