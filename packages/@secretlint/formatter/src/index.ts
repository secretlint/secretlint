// LICENSE : MIT
"use strict";
import { TextlintResult } from "@textlint/types";
import {
    createFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";
import terminalLink from "terminal-link";

const debug = require("debug")("@secretlint/formatter");

export interface SecretLintFormatterConfig {
    /**
     * Using Formatter name
     */
    formatterName: string;
    /**
     * Output color
     * Default: true
     */
    color?: boolean;
    /**
     * If terminalLink is true, some formatter will output that includes clickable click
     * Support Terminal: https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
     * Default: false
     */
    terminalLink?: boolean;
}

/**
 * Convert secretlint result to textlint result for formatter
 * @param secretLintCoreResult
 */
const convertSecretLintResultToTextlintResult = (
    secretLintCoreResult: SecretLintCoreResult,
    { enableTerminalLink }: { enableTerminalLink: boolean }
): TextlintResult => {
    return {
        filePath: secretLintCoreResult.filePath,
        messages: secretLintCoreResult.messages.map(message => {
            const severityLevel =
                message.severity === "info"
                    ? 0
                    : message.severity === "warning"
                    ? 1
                    : message.severity === "error"
                    ? 2
                    : 0;

            // If the message has docsUrl, try to link to docsUrl
            const messageId =
                enableTerminalLink && message.docsUrl
                    ? terminalLink(message.messageId, message.docsUrl, {
                          fallback: (text, _url) => {
                              return text;
                          }
                      })
                    : message.messageId;
            return {
                // Preset rule format
                // {preset-id} > {rule-id}
                // Single rule format
                // {rule-id}
                ruleId: message.ruleParentId ? `${message.ruleParentId} > ${message.ruleId}` : message.ruleId,
                index: message.range[0],
                line: message.loc.start.line,
                column: message.loc.start.column,
                severity: severityLevel,
                message: `[${messageId}] ${message.message}`,
                data: message.data,
                // NO NEED - DUMMY DATA
                fix: undefined,
                type: "lint"
            };
        })
    };
};

export function createFormatter(formatterConfig: SecretLintFormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    const isHumanReadableFormat = ["stylish", "pretty-error"].includes(formatterName);
    /**
     * Terminal Link is enabled when use human-readable format and option is enabled
     */
    const enableTerminalLink = isHumanReadableFormat ?? formatterConfig.terminalLink ?? false;
    debug(`formatterName: ${formatterName}`);
    const format = textlintCreateFormatter(formatterConfig);
    return {
        format: (results: SecretLintCoreResult[]) => {
            return format(
                results.map(result =>
                    convertSecretLintResultToTextlintResult(result, {
                        enableTerminalLink
                    })
                )
            );
        }
    };
}

export interface SecretLintFormatterDetail {
    name: string;
}

export function getFormatterList(): SecretLintFormatterDetail[] {
    return textlintGetFormatterList();
}
