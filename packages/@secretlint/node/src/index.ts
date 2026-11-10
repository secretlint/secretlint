import { lintSource } from "@secretlint/core";
import { loadConfig, loadPackagesFromConfigDescriptor, SecretLintConfigMessage } from "@secretlint/config-loader";
import { createFileSourceReader, createRawSource } from "@secretlint/source-creator";
import { loadFormatter } from "@secretlint/formatter";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreResult,
    SecretLintRawSource,
    SecretLintRuleLocaleTag,
} from "@secretlint/types";
import path from "node:path";
import { secretLintProfiler } from "@secretlint/profiler";
import debug0 from "debug";

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
// The engine lints a file at a time, so files are read into one buffer
const readFileSource = createFileSourceReader();
/**
 * Read a file for linting.
 * The result of a source with `contentBytes` has `sourceContent` only if it has messages.
 * "mask-result" formatter outputs the content of all files, so it gets a source without `contentBytes`.
 */
const readSource = async (filePath: string, options: SecretLintEngineOptions): Promise<SecretLintRawSource> => {
    if (options.formatter !== "mask-result") {
        return readFileSource(filePath);
    }
    const { content, ext, contentType } = await createRawSource(filePath);
    return { filePath, content, ext, contentType };
};
const lintFile = async ({
    filePath,
    config,
    options,
}: {
    filePath: string;
    config: SecretLintCoreConfig;
    options: SecretLintEngineOptions;
}) => {
    const rawSource = await readSource(filePath, options);
    return lintSource({
        source: rawSource,
        options: {
            ...options,
            config: config,
        },
    });
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

const executeOnFiles = async ({
    filePathList,
    config,
    configResults,
    options,
}: {
    filePathList: string[];
    config: SecretLintCoreConfig;
    configResults: SecretLintCoreResult[];
    options: SecretLintEngineOptions;
}) => {
    // Lint a file at a time.
    // lintFile() reads the file synchronously into a shared buffer, so linting files concurrently has no gain,
    // and the buffer has the file only until the next file is read.
    const results: SecretLintCoreResult[] = [];
    for (const filePath of filePathList) {
        debug("executeOnFiles file: %s", filePath);
        const result = await lintFile({ filePath: filePath, config: config, options: options });
        debug("executeOnFiles result: %o", result);
        results.push(result);
    }
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
    const loadedResult = await (async () => {
        if (isConfigFileJSON(options)) {
            debug("Load ConfigFileJSON: %s", options.configFileJSON);
            const result = await loadPackagesFromConfigDescriptor({
                configDescriptor: options.configFileJSON,
            });
            // config JSON has no file path to report messages for
            return { ...result, configFilePath: undefined };
        }
        const loadConfigResult = await loadConfig({
            cwd: options.cwd,
            configFilePath: options.configFilePath,
        });
        debug("Loaded ConfigFilePath: %s", loadConfigResult.configFilePath);
        return loadConfigResult;
    })();
    secretLintProfiler.mark({
        type: "@node>load-config::end",
    });
    if (!loadedResult.ok) {
        throw new Error("Fail to load secretlint config");
    }
    debug("Config: %O", loadedResult.config);
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
