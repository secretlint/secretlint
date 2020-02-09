// LICENSE : MIT
"use strict";
import { TextlintResult } from "@textlint/types";
import {
    createFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";

const debug = require("@secretlint/formatter");

export interface SecretLintFormatterConfig {
    formatterName: string;
    color?: boolean;
}

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
                message: message.message,
                // NO NEED - DUMMY DATA
                fix: undefined,
                type: "lint",
                data: message.data
            };
        })
    };
};

export function createFormatter(formatterConfig: SecretLintFormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    const format = textlintCreateFormatter(formatterConfig);
    return (results: SecretLintCoreResult[]) => {
        return format(results.map(result => convertSecretLintResultToTextlintResult(result)));
    };
}

export interface SecretLintFormatterDetail {
    name: string;
}

export function getFormatterList(): SecretLintFormatterDetail[] {
    return textlintGetFormatterList();
}
