// LICENSE : MIT
"use strict";
import { TextlintResult } from "@textlint/types";
import {
    createFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";

import escapeStringRegexp from "escape-string-regexp";

const debug = require("debug")("@secretlint/formatter");

export interface SecretLintFormatterConfig {
    formatterName: string;
    color?: boolean;
}

/**
 * {{Key}} => Value
 * @param message
 * @param data
 */
const formatMessagePlaceholder = (message: string, data?: {}): string => {
    if (typeof data !== "object" || data === null) {
        return message;
    }
    let output = message;
    Object.entries(data).forEach(([key, value]) => {
        output = output.replace(new RegExp(escapeStringRegexp(`{{${key}}}`), "g"), String(value));
    });
    return output;
};
/**
 * Convert secretlint result to textlint result for formatter
 * @param secretLintCoreResult
 */
const convertSecretLintResultToTextlintResult = (secretLintCoreResult: SecretLintCoreResult): TextlintResult => {
    return {
        filePath: secretLintCoreResult.filePath,
        messages: secretLintCoreResult.messages.map(message => {
            const severityLevel =
                message.severity === "info"
                    ? 1
                    : message.severity === "warning"
                    ? 2
                    : message.severity === "error"
                    ? 3
                    : 0;

            return {
                ruleId: message.ruleId,
                index: message.range[0],
                line: message.loc.start.line,
                column: message.loc.start.column,
                severity: severityLevel,
                message: formatMessagePlaceholder(message.message, message.data),
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
    debug(`formatterName: ${formatterName}`);
    const format = textlintCreateFormatter(formatterConfig);
    return {
        format: (results: SecretLintCoreResult[]) => {
            return format(results.map(result => convertSecretLintResultToTextlintResult(result)));
        }
    };
}

export interface SecretLintFormatterDetail {
    name: string;
}

export function getFormatterList(): SecretLintFormatterDetail[] {
    return textlintGetFormatterList();
}
