// LICENSE : MIT
"use strict";
import { TextlintResult } from "@textlint/types";
import {
    createFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";

const debug = require("debug")("@secretlint/formatter");

export interface SecretLintFormatterConfig {
    formatterName: string;
    color?: boolean;
}

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
                    ? 0
                    : message.severity === "warning"
                    ? 1
                    : message.severity === "error"
                    ? 2
                    : 0;

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
                message: message.message,
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
