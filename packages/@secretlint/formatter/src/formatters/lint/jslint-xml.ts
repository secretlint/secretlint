/**
 * @fileoverview JSLint XML reporter
 * @author Ian Christian Myers
 *
 * Ported from @textlint/linter-formatter
 */
import { escapeHtml } from "./escape-xml.js";
import type { LintFormatter } from "./types.js";

const formatter: LintFormatter = (results) => {
    let output = "";

    output += '<?xml version="1.0" encoding="utf-8"?>';
    output += "<jslint>";

    results.forEach(function (result) {
        const messages = result.messages;

        output += `<file name="${result.filePath}">`;

        messages.forEach(function (message) {
            output +=
                `<issue line="${message.line}" ` +
                `char="${message.column}" ` +
                `evidence="" ` +
                `reason="${escapeHtml(message.message || "")}${message.ruleId ? ` (${message.ruleId})` : ""}" />`;
        });

        output += "</file>";
    });

    output += "</jslint>\n";

    return output;
};

export default formatter;
