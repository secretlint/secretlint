/**
 * @fileoverview jUnit Reporter
 * @author Jamund Ferguson
 *
 * Ported from @textlint/linter-formatter
 */
import { escapeHtml } from "./escape-xml.js";
import { getMessageType } from "./message-type.js";
import type { LintFormatter } from "./types.js";

const formatter: LintFormatter = (results) => {
    let output = "";

    output += '<?xml version="1.0" encoding="utf-8"?>\n';
    output += "<testsuites>\n";

    results.forEach(function (result) {
        const messages = result.messages;

        if (messages.length) {
            output += `<testsuite package="org.eslint" time="0" tests="${messages.length}" errors="${messages.length}" name="${result.filePath}">\n`;
        }

        messages.forEach(function (message) {
            const type = "failure";
            output += `<testcase time="0" name="org.eslint.${message.ruleId || "unknown"}">`;
            output += `<${type} message="${escapeHtml(message.message || "")}">`;
            output += "<![CDATA[";
            output += `line ${message.line || 0}, col `;
            output += `${message.column || 0}, ${getMessageType(message, { error: "Error", warning: "Warning", info: "Info" })}`;
            output += ` - ${escapeHtml(message.message || "")}`;
            output += message.ruleId ? ` (${message.ruleId})` : "";
            output += "]]>";
            output += `</${type}>`;
            output += "</testcase>\n";
        });

        if (messages.length) {
            output += "</testsuite>\n";
        }
    });

    output += "</testsuites>\n";

    return output;
};

export default formatter;
