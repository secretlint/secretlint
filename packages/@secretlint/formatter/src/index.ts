// LICENSE : MIT
import { TextlintResult } from "@textlint/types";
import {
    getFormatterList as textlintGetFormatterList,
    loadFormatter as textlintCreateFormatter,
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";
import terminalLink from "terminal-link";
import { FormatterConfig } from "./types.js";
import fs from "node:fs";
import path from "node:path";
import debug0 from "debug";
import { dynamicImport, tryResolve } from "@secretlint/resolver";
import jsonFormatter from "./formatters/json.js";
import maskResultFormatter from "./formatters/mask-result.js";
import tableFormatter from "./formatters/table.js";

const BuiltInFormatters = ["json", "mask-result", "table"];
const debug = debug0("@secretlint/formatter");
const tryResolveModule = (moduleName: string) => {
    return tryResolve(moduleName, {
        parentImportMeta: import.meta,
        parentModule: "formatter",
    });
};
type Formatter = (results: SecretLintCoreResult[], formatterConfig: FormatterConfig) => string;

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
                /**
                 * @deprecated backward compatibility - use range or loc
                 */
                index: message.range[0],
                /**
                 * @deprecated backward compatibility - use range or loc
                 */
                line: message.loc.start.line,
                /**
                 * @deprecated backward compatibility - use range or loc
                 */
                column: message.loc.start.column,
                range: message.range,
                loc: message.loc,
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

export async function loadFormatter(formatterConfig: SecretLintFormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    const isHumanReadableFormat = ["stylish", "pretty-error"].includes(formatterName);
    /**
     * Terminal Link is enabled when use human-readable format and option is enabled
     */
    const enableTerminalLink = isHumanReadableFormat ?? formatterConfig.terminalLink ?? false;
    debug(`formatterName: ${formatterName}`);

    try {
        const formatter = await secretlintCreateFormatter(formatterConfig);
        return {
            format: (results: SecretLintCoreResult[]) => {
                return formatter.format(results);
            },
        };
    } catch {
        const formatter = await textlintCreateFormatter(formatterConfig);
        return {
            format: (results: SecretLintCoreResult[]) => {
                return formatter.format(
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

export async function secretlintCreateFormatter(formatterConfig: FormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    if (BuiltInFormatters.includes(formatterName)) {
        switch (formatterName) {
            case "json":
                return {
                    format: function secretlintFormatterFormat(results: SecretLintCoreResult[]) {
                        return jsonFormatter(results, formatterConfig);
                    },
                };
            case "mask-result":
                return {
                    format: function secretlintFormatterFormat(results: SecretLintCoreResult[]) {
                        return maskResultFormatter(results, formatterConfig);
                    },
                };
            case "table":
                return {
                    format: function secretlintFormatterFormat(results: SecretLintCoreResult[]) {
                        return tableFormatter(results, formatterConfig);
                    },
                };
        }
    }
    let formatter: Formatter;
    let formatterPath;
    if (fs.existsSync(formatterName)) {
        formatterPath = formatterName;
    } else if (fs.existsSync(path.resolve(process.cwd(), formatterName))) {
        formatterPath = path.resolve(process.cwd(), formatterName);
    } else {
        const pkgPath = tryResolveModule(formatterName) || tryResolveModule(`secretlint-formatter-${formatterName}`);
        if (pkgPath) {
            formatterPath = pkgPath;
        }
    }
    if (!formatterPath) {
        throw new Error(`Could not find formatter ${formatterName}`);
    }
    try {
        // dynamic import require file url
        formatter = (
            (
                await dynamicImport(formatterPath, {
                    parentImportMeta: import.meta,
                    parentModule: "formatter",
                })
            ).exports as {
                default: Formatter;
            }
        ).default;
    } catch (ex) {
        throw new Error(`Could not find formatter ${formatterName}
${ex}`);
    }
    return {
        format: function secretlintFormatterFormat(results: SecretLintCoreResult[]) {
            return formatter(results, formatterConfig);
        },
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
    return [
        {
            name: "json",
        },
        {
            name: "mask-result",
        },
        {
            name: "table",
        },
    ];
}
