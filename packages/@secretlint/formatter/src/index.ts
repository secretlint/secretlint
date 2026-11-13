// LICENSE : MIT
import { SecretLintCoreResult, SecretLintFormatterGetSource } from "@secretlint/types";
import { terminalLink } from "./helper/terminal-link.js";
import { FormatterConfig } from "./types.js";
import fs from "node:fs";
import path from "node:path";
import debug0 from "debug";
import { dynamicImport, tryResolve } from "@secretlint/resolver";
import { sanitizeTerminalOutput } from "./sanitize-terminal-output.js";
import type { LintFormatter, LintResult } from "./formatters/lint/types.js";

/**
 * The formatters that format the results of secretlint.
 * Each formatter is imported when it is used.
 */
const BuiltInFormatters: Record<string, () => Promise<Formatter>> = {
    json: async () => (await import("./formatters/json.js")).default,
    "mask-result": async () => (await import("./formatters/mask-result.js")).default,
    table: async () => (await import("./formatters/table.js")).default,
};
/**
 * The formatters that format the lint messages in a general format of linters.
 * These are ported from @textlint/linter-formatter.
 * Each formatter is imported when it is used.
 */
const BuiltInLintFormatters: Record<string, () => Promise<LintFormatter>> = {
    checkstyle: async () => (await import("./formatters/lint/checkstyle.js")).default,
    compact: async () => (await import("./formatters/lint/compact.js")).default,
    github: async () => (await import("./formatters/lint/github.js")).default,
    "jslint-xml": async () => (await import("./formatters/lint/jslint-xml.js")).default,
    junit: async () => (await import("./formatters/lint/junit.js")).default,
    "pretty-error": async () => (await import("./formatters/lint/pretty-error.js")).default,
    stylish: async () => (await import("./formatters/lint/stylish.js")).default,
    tap: async () => {
        // tap formatter outputs the messages as YAML
        const [{ createFormatter }, yaml] = await Promise.all([import("./formatters/lint/tap.js"), import("js-yaml")]);
        return createFormatter((value) => yaml.dump(value));
    },
    unix: async () => (await import("./formatters/lint/unix.js")).default,
};
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
    /**
     * Get the content of the linted source by `filePath` of the result.
     * The results do not have the content, so a formatter that needs the content gets it from this function.
     * For example, "mask-result" formatter needs it.
     */
    getSource?: SecretLintFormatterGetSource;
}

/**
 * Convert secretlint result to the result for the lint formatters
 */
const convertSecretLintResultToLintResult = (
    secretLintCoreResult: SecretLintCoreResult,
    { enableTerminalLink, sanitizeFilePath }: { enableTerminalLink: boolean; sanitizeFilePath: boolean },
): LintResult => {
    return {
        filePath: sanitizeFilePath
            ? sanitizeTerminalOutput(secretLintCoreResult.filePath)
            : secretLintCoreResult.filePath,
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
                    ? terminalLink(sanitizeTerminalOutput(message.messageId), sanitizeTerminalOutput(message.docsUrl))
                    : sanitizeTerminalOutput(message.messageId);
            return {
                // Preset rule format
                // {preset-id} > {rule-id}
                // Single rule format
                // {rule-id}
                ruleId: sanitizeTerminalOutput(
                    message.ruleParentId ? `${message.ruleParentId} > ${message.ruleId}` : message.ruleId,
                ),
                line: message.loc.start.line,
                column: message.loc.start.column,
                range: message.range,
                loc: message.loc,
                severity: severityLevel,
                message: `[${messageId}] ${sanitizeTerminalOutput(message.message)}`,
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
    const enableTerminalLink = isHumanReadableFormat && (formatterConfig.terminalLink ?? false);
    /**
     * pretty-error reads the file by `filePath`, so it needs the original path.
     * Instead, the path in its output is replaced with the sanitized path.
     */
    const sanitizeFilePath = formatterName !== "pretty-error";
    debug(`formatterName: ${formatterName}`);

    const loadLintFormatter = Object.hasOwn(BuiltInLintFormatters, formatterName)
        ? BuiltInLintFormatters[formatterName]
        : undefined;
    if (!loadLintFormatter) {
        const formatter = await secretlintCreateFormatter(formatterConfig);
        return {
            format: (results: SecretLintCoreResult[]) => {
                return formatter.format(results);
            },
        };
    }
    const lintFormatter = await loadLintFormatter();
    return {
        format: (results: SecretLintCoreResult[]) => {
            const output = lintFormatter(
                results.map((result) =>
                    convertSecretLintResultToLintResult(result, {
                        enableTerminalLink,
                        sanitizeFilePath,
                    }),
                ),
                formatterConfig,
            );
            if (sanitizeFilePath) {
                return output;
            }
            return results.reduce((text, result) => {
                const sanitizedFilePath = sanitizeTerminalOutput(result.filePath);
                return sanitizedFilePath === result.filePath
                    ? text
                    : text.split(result.filePath).join(sanitizedFilePath);
            }, output);
        },
    };
}

export async function secretlintCreateFormatter(formatterConfig: FormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    if (Object.hasOwn(BuiltInFormatters, formatterName)) {
        const builtInFormatter = await BuiltInFormatters[formatterName]();
        return {
            format: function secretlintFormatterFormat(results: SecretLintCoreResult[]) {
                return builtInFormatter(results, formatterConfig);
            },
        };
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

/**
 * Get the list of the built-in formatters
 */
export function getFormatterList(): SecretLintFormatterDetail[] {
    return [...Object.keys(BuiltInLintFormatters), ...Object.keys(BuiltInFormatters)].map((name) => {
        return { name };
    });
}

/**
 * Get the list of the formatters that format the results of secretlint
 */
export function secretlintGetFormatterList(): SecretLintFormatterDetail[] {
    return Object.keys(BuiltInFormatters).map((name) => {
        return { name };
    });
}
