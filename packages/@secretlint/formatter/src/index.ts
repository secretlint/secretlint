// LICENSE : MIT
"use strict";
import { TextlintResult } from "@textlint/types";
import {
    createFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList,
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";
import terminalLink from "terminal-link";
import { FormatterConfig } from "./types";
import { moduleInterop } from "@textlint/module-interop";

const fs = require("fs");
const path = require("path");
const tryResolve = require("try-resolve");

const isFile = require("is-file");
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
        messages: secretLintCoreResult.messages.map((message) => {
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
                          },
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
                type: "lint",
            };
        }),
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

    try {
        const format = secretlintCreateFormatter(formatterConfig);
        return {
            format: (results: SecretLintCoreResult[]) => {
                return format(results);
            },
        };
    } catch {
        const format = textlintCreateFormatter(formatterConfig);
        return {
            format: (results: SecretLintCoreResult[]) => {
                return format(
                    results.map((result) =>
                        convertSecretLintResultToTextlintResult(result, {
                            enableTerminalLink,
                        })
                    )
                );
            },
        };
    }
}

export function secretlintCreateFormatter(formatterConfig: FormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    let formatter: (results: SecretLintCoreResult[], formatterConfig: FormatterConfig) => string;
    let formatterPath;
    if (fs.existsSync(formatterName)) {
        formatterPath = formatterName;
    } else if (fs.existsSync(path.resolve(process.cwd(), formatterName))) {
        formatterPath = path.resolve(process.cwd(), formatterName);
    } else {
        if (isFile(`${path.join(__dirname, "formatters/", formatterName)}.js`)) {
            formatterPath = `${path.join(__dirname, "formatters/", formatterName)}.js`;
        } else if (isFile(`${path.join(__dirname, "formatters/", formatterName)}.ts`)) {
            formatterPath = `${path.join(__dirname, "formatters/", formatterName)}.ts`;
        } else {
            const pkgPath = tryResolve(`secretlint-formatter-${formatterName}`) || tryResolve(formatterName);
            if (pkgPath) {
                formatterPath = pkgPath;
            }
        }
    }
    try {
        formatter = moduleInterop(require(formatterPath));
    } catch (ex) {
        throw new Error(`Could not find formatter ${formatterName}
${ex}`);
    }
    return function (results: SecretLintCoreResult[]) {
        return formatter(results, formatterConfig);
    };
}

export interface SecretLintFormatterDetail {
    name: string;
}

export function getFormatterList(): SecretLintFormatterDetail[] {
    const textlintFormatters = textlintGetFormatterList();
    const secretlintFormatters = secretlintGetFormatterList();
    const secretlintFormatterNames = secretlintFormatters.map((formatter) => formatter.name);
    const externalFormatters = textlintFormatters.filter(
        (formatter) => !secretlintFormatterNames.includes(formatter.name)
    );
    return [...externalFormatters, ...secretlintFormatters];
}

export function secretlintGetFormatterList(): SecretLintFormatterDetail[] {
    return fs
        .readdirSync(path.join(__dirname, "formatters"))
        .filter((file: string) => {
            return path.extname(file) === ".ts";
        })
        .map((file: string) => {
            return { name: path.basename(file, ".ts") };
        });
}
