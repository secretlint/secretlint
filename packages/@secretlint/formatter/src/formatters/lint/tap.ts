/**
 * @fileoverview TAP reporter
 * @author Jonathan Kingston
 *
 * Ported from @textlint/linter-formatter
 */
import { getMessageType } from "./message-type.js";
import type { LintFormatter } from "./types.js";

/**
 * Dump a JavaScript object as YAML. For example, `dump` of js-yaml
 */
export type YamlDump = (value: unknown) => string;

/**
 * Takes in a JavaScript object and outputs a TAP diagnostics string
 * @returns diagnostics string with YAML embedded - TAP version 13 compliant
 */
function outputDiagnostics(diagnostic: unknown, yamlDump: YamlDump): string {
    const prefix = "  ";
    let output = `${prefix}---\n`;
    output += prefix + yamlDump(diagnostic).split("\n").join(`\n${prefix}`);
    output += "...\n";
    return output;
}

/**
 * Create TAP formatter.
 * The formatter embeds the messages as YAML, so it requires a function that dumps YAML.
 */
export const createFormatter = (yamlDump: YamlDump): LintFormatter => {
    return (results) => {
        let output = `TAP version 13\n1..${results.length}\n`;

        results.forEach(function (result, id) {
            const messages = result.messages;
            let testResult = "ok";
            let diagnostics: Record<string, unknown> = {};

            if (messages.length > 0) {
                testResult = "not ok";

                messages.forEach(function (message) {
                    const diagnostic = {
                        message: message.message,
                        severity: getMessageType(message, { error: "error", warning: "warning", info: "info" }),
                        data: {
                            line: message.line || 0,
                            column: message.column || 0,
                            ruleId: message.ruleId || "",
                        },
                    };

                    // If we have multiple messages place them under a messages key
                    // The first error will be logged as message key
                    // This is to adhere to TAP 13 loosely defined specification of having a message key
                    if ("message" in diagnostics) {
                        if (typeof diagnostics.messages === "undefined") {
                            diagnostics.messages = [];
                        }
                        (diagnostics.messages as unknown[]).push(diagnostic);
                    } else {
                        diagnostics = diagnostic;
                    }
                });
            }

            output += `${testResult} ${id + 1} - ${result.filePath}\n`;

            // If we have an error include diagnostics
            if (messages.length > 0) {
                output += outputDiagnostics(diagnostics, yamlDump);
            }
        });

        return output;
    };
};
