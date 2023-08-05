// LICENSE : MIT
import { TextlintResult } from "@textlint/types";
import {
    loadFormatter as textlintCreateFormatter,
    getFormatterList as textlintGetFormatterList,
} from "@textlint/linter-formatter";
import { SecretLintCoreResult } from "@secretlint/types";
import terminalLink from "terminal-link";
import { FormatterConfig } from "./types.js";
import { moduleInterop } from "@textlint/module-interop";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error: no @types
import isFile from "is-file";
// @ts-expect-error: no @types
import tryResolve from "try-resolve";
import debug0 from "debug";
import url from "node:url";

const debug = debug0("@secretlint/formatter");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
                 * @deprecated backword compatibility - use range or loc
                 */
                index: message.range[0],
                /**
                 * @deprecated backword compatibility - use range or loc
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
    let formatter: (results: SecretLintCoreResult[], formatterConfig: FormatterConfig) => string;
    let formatterPath;
    if (fs.existsSync(formatterName)) {
        formatterPath = formatterName;
    } else if (fs.existsSync(path.resolve(process.cwd(), formatterName))) {
        formatterPath = path.resolve(process.cwd(), formatterName);
    } else {
        if (isFile(`${path.join(__dirname, "formatters", formatterName)}.js`)) {
            formatterPath = `${path.join(__dirname, "formatters", formatterName)}.js`;
        } else if (isFile(`${path.join(__dirname, "formatters", formatterName)}.ts`)) {
            formatterPath = `${path.join(__dirname, "formatters", formatterName)}.ts`;
        } else {
            const pkgPath = tryResolve(formatterName) || tryResolve(`secretlint-formatter-${formatterName}`);
            if (pkgPath) {
                formatterPath = pkgPath;
            }
        }
    }
    try {
        // dynamic import require file url
        const fileUrl = url.pathToFileURL(formatterPath).href;
        formatter = moduleInterop(await import(fileUrl)).default;
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
    return fs
        .readdirSync(path.join(__dirname, "formatters"))
        .filter((file: string) => {
            return [".js", ".ts"].some(
                (formatterExtension) => path.extname(file) === formatterExtension && !file.endsWith(".d.ts")
            );
        })
        .map((file: string) => {
            const nameWithoutExtension = [".js", ".ts"].reduce(
                (name, extension) => path.basename(name, extension),
                file
            );
            return { name: nameWithoutExtension };
        });
}
