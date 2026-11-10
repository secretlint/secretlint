import { lintSource } from "@secretlint/core";
import type { SecretLintConfigMessage } from "@secretlint/config-loader";
import { loadFormatter } from "@secretlint/formatter";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreResult,
    SecretLintRuleLocaleTag,
} from "@secretlint/types";
import os from "node:os";
import path from "node:path";
import { secretLintProfiler } from "@secretlint/profiler";
import pMap from "p-map";
import debug0 from "debug";
import { ConfigSource, lintFile, LintFileOptions, loadConfigFromSource } from "./lint-file.js";
import { getWorkerCount, lintFilesInWorkers } from "./parallel.js";

const debug = debug0("@secretlint/node");
export type SecretLintEngineOptionsBase = {
    /**
     * If cwd is not defined, cwd(current working dir) is current working dir.
     */
    cwd?: string;
    /**
     * If color is false, disable ANSI-color of the output.
     * Default: true
     */
    color?: boolean;
    /**
     * Specify formatter name for output
     */
    formatter: string;
    /**
     * If terminalLink is true, some formatter will output that includes clickable click
     * Support Terminal: https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
     * Default: false
     */
    terminalLink?: boolean;

    /**
     * locale for rule message
     */
    locale?: SecretLintRuleLocaleTag;

    /**
     * If maskSecrets is true, mask secret values with "***".
     * If you want to hide actual secret values, set true
     * https://github.com/secretlint/secretlint/issues/176
     * Default: true
     */
    maskSecrets?: boolean;

    /**
     * If profile is true, enable the profiler of `@secretlint/profiler`.
     * If profile is false, disable the profiler.
     * You can get the result via `secretLintProfiler.getMeasures()` of `@secretlint/profiler`.
     * Profiling costs performance, so enable it only when you need the profiling result.
     * If profile is not defined, the engine does not change the state of the profiler.
     * Default: undefined (the profiler is disabled by default)
     */
    profile?: boolean;

    /**
     * If parallel is true, lint files in worker threads when there are enough files.
     * If parallel is false, lint files in the main thread.
     * Workers are not used when the profiler is enabled, on Bun, or when resolver hooks are registered.
     * Default: true
     */
    parallel?: boolean;
};
export type SecretLintEngineOptionsConfigFilePath = SecretLintEngineOptionsBase & {
    /**
     * If configFilePath is not defined, search config file from cwd(current working dir)
     */
    configFilePath?: string;
};
export type SecretLintEngineOptionsConfigFileJSON = SecretLintEngineOptionsBase & {
    /**
     * configFileJSON is a json object
     * that is used instead of configFilePath.
     */
    configFileJSON: SecretLintConfigDescriptor;
};

export type SecretLintEngineOptions = SecretLintEngineOptionsConfigFilePath | SecretLintEngineOptionsConfigFileJSON;

const isConfigFileJSON = (v: any): v is SecretLintEngineOptionsConfigFileJSON => {
    return "configFileJSON" in v && v.configFileJSON !== undefined;
};
/**
 * Report config problems as messages for the config file, like lint results.
 */
const createConfigResult = ({
    configFilePath,
    messages,
}: {
    configFilePath: string;
    messages: SecretLintConfigMessage[];
}): SecretLintCoreResult => {
    return {
        filePath: configFilePath,
        sourceContent: undefined,
        sourceContentType: "text",
        messages: messages.map((message) => {
            return {
                type: "message",
                // config messages are documented in the secretlint package README
                ruleId: "secretlint",
                messageId: message.messageId,
                message: message.message,
                docsUrl: message.docsUrl,
                range: [0, 0],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 0 },
                },
                severity: message.severity,
            };
        }),
    };
};
/**
 * Only "error" severity messages fail the lint.
 * "warning" and "info" messages are reported, but do not change the exit status.
 */
const hasErrorMessage = (result: SecretLintCoreResult): boolean => {
    return result.messages.some((message) => message.severity === "error");
};
const executeOnContent = async ({
    content,
    filePath,
    config,
    configResults,
    options,
}: {
    content: string;
    filePath: string;
    config: SecretLintCoreConfig;
    configResults: SecretLintCoreResult[];
    options: SecretLintEngineOptions;
}) => {
    debug("executeOnContent content: %s", `${content.slice(0, 24)}...`);
    debug("executeOnContent filePath: %s", filePath);
    const result = await lintSource({
        source: {
            filePath: filePath,
            content: content,
            ext: path.extname(filePath),
            contentType: "text",
        },
        options: {
            ...options,
            config,
        },
    });
    debug("executeOnContent result: %o", result);
    secretLintProfiler.mark({
        type: "@node>format::start",
    });
    const formatter = await loadFormatter({
        color: options.color ?? true,
        formatterName: options.formatter,
        terminalLink: options.terminalLink ?? false,
    });
    const output = formatter.format([...configResults, result]);
    secretLintProfiler.mark({
        type: "@node>format::end",
    });
    return {
        ok: !hasErrorMessage(result),
        output: output,
    };
};

const lintFilesInMainThread = ({
    filePathList,
    config,
    lintOptions,
}: {
    filePathList: string[];
    config: SecretLintCoreConfig;
    lintOptions: LintFileOptions;
}) => {
    const mapper = async (filePath: string) => {
        debug("executeOnFiles file: %s", filePath);
        const result = await lintFile({ filePath: filePath, config: config, options: lintOptions });
        debug("executeOnFiles result: %o", result);
        return result;
    };
    return pMap(filePathList, mapper, {
        // Avoid: EMFILE: too many open files, uv_cwd
        // https://github.com/secretlint/secretlint/issues/72
        concurrency: os.cpus().length,
    });
};

const executeOnFiles = async ({
    filePathList,
    config,
    configSource,
    configResults,
    options,
}: {
    filePathList: string[];
    config: SecretLintCoreConfig;
    configSource: ConfigSource;
    configResults: SecretLintCoreResult[];
    options: SecretLintEngineOptions;
}) => {
    const lintOptions: LintFileOptions = {
        locale: options.locale,
        maskSecrets: options.maskSecrets,
    };
    const lintInMainThread = (filePathList: string[]) => {
        return lintFilesInMainThread({ filePathList, config, lintOptions });
    };
    const workerCount = options.parallel === false ? 0 : getWorkerCount(filePathList.length);
    const results =
        workerCount > 0
            ? await lintFilesInWorkers({
                  filePathList,
                  workerCount,
                  workerData: { configSource, lintOptions },
                  lintInMainThread,
              })
            : await lintInMainThread(filePathList);
    debug("executeOnFiles result counts: %s", results.length);
    secretLintProfiler.mark({
        type: "@node>format::start",
    });
    const formatter = await loadFormatter({
        color: options.color ?? true,
        formatterName: options.formatter,
        terminalLink: options.terminalLink ?? false,
    });
    const output = formatter.format([...configResults, ...results]);
    secretLintProfiler.mark({
        type: "@node>format::end",
    });
    const hasErrorAtLeastOne = results.some((result) => {
        return hasErrorMessage(result);
    });
    return {
        ok: !hasErrorAtLeastOne,
        output: output,
    };
};

/**
 * Create SecretLint Engine and return the instance.
 * The engine load config file(.secretlintrc) automatically
 * @param engineOptions
 */
export const createEngine = async (engineOptions: SecretLintEngineOptions) => {
    const options: SecretLintEngineOptions = {
        ...engineOptions,
        // mask secret values by default
        maskSecrets: engineOptions.maskSecrets ?? true,
    };
    // The profiler is a shared instance, so change the state only when `profile` is specified explicitly
    if (options.profile !== undefined) {
        secretLintProfiler.setEnabled(options.profile);
    }
    secretLintProfiler.mark({
        type: "@node>load-config::start",
    });
    const initialConfigSource: ConfigSource = isConfigFileJSON(options)
        ? { type: "json", configFileJSON: options.configFileJSON }
        : { type: "file", cwd: options.cwd, configFilePath: options.configFilePath };
    debug("Load config: %o", initialConfigSource);
    const loadedResult = await loadConfigFromSource(initialConfigSource);
    debug("Loaded ConfigFilePath: %s", loadedResult.configFilePath);
    secretLintProfiler.mark({
        type: "@node>load-config::end",
    });
    if (!loadedResult.ok) {
        throw new Error("Fail to load secretlint config");
    }
    debug("Config: %O", loadedResult.config);
    // Workers load the config file that the main thread found
    const configSource: ConfigSource =
        initialConfigSource.type === "file" && loadedResult.configFilePath !== undefined
            ? { type: "file", cwd: options.cwd, configFilePath: loadedResult.configFilePath }
            : initialConfigSource;
    // mask-result outputs the content of the linted file, so config results can not be mixed into it
    const configResults =
        loadedResult.configFilePath !== undefined &&
        loadedResult.messages.length > 0 &&
        options.formatter !== "mask-result"
            ? [
                  createConfigResult({
                      configFilePath: loadedResult.configFilePath,
                      messages: loadedResult.messages,
                  }),
              ]
            : [];
    return {
        /**
         * Lint a content and return the formatted results
         * @param content
         * @param filePath
         */
        executeOnContent: ({ content, filePath }: { content: string; filePath: string }) => {
            debug("executeOnContent content: %s", content);
            debug("executeOnContent filePath: %s", filePath);
            secretLintProfiler.mark({
                type: "@node>execute::start",
            });
            return executeOnContent({
                content,
                filePath,
                config: loadedResult.config,
                configResults,
                options: options,
            }).finally(() => {
                secretLintProfiler.mark({
                    type: "@node>execute::end",
                });
            });
        },
        /**
         * Lint files and return the formatted results
         * @param filePathList
         */
        executeOnFiles: ({ filePathList }: { filePathList: string[] }) => {
            debug("executeOnFiles file counts: %s", filePathList.length);
            secretLintProfiler.mark({
                type: "@node>execute::start",
            });
            return executeOnFiles({
                filePathList,
                config: loadedResult.config,
                configSource,
                configResults,
                options: options,
            }).finally(() => {
                secretLintProfiler.mark({
                    type: "@node>execute::end",
                });
            });
        },
    };
};
