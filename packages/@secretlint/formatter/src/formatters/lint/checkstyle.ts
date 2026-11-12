/**
 * @fileoverview CheckStyle XML reporter
 * @author Ian Christian Myers
 *
 * Ported from @textlint/linter-formatter
 */
import { escapeXml } from "./escape-xml.js";
import { getMessageType } from "./message-type.js";
import type { LintFormatter } from "./types.js";

const formatter: LintFormatter = (results) => {
    let output = "";

    output += '<?xml version="1.0" encoding="utf-8"?>';
    output += '<checkstyle version="4.3">';

    results.forEach(function (result) {
        const messages = result.messages;

        output += `<file name="${escapeXml(result.filePath)}">`;

        messages.forEach(function (message) {
            const messageType = getMessageType(message, { error: "error", warning: "warning", info: "info" });
            output +=
                `<error line="${escapeXml(message.line)}" ` +
                `column="${escapeXml(message.column)}" ` +
                `severity="${escapeXml(messageType)}" ` +
                `message="${escapeXml(message.message)}${message.ruleId ? ` (${escapeXml(message.ruleId)})` : ""}" ` +
                `source="${message.ruleId ? escapeXml(`eslint.rules.${message.ruleId}`) : ""}" />`;
        });

        output += "</file>";
    });

    output += "</checkstyle>\n";

    return output;
};

export default formatter;
