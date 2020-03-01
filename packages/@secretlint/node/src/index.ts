import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { createFormatter } from "@secretlint/formatter";
import { SecretLintCoreDescriptor, SecretLintCoreResult } from "@secretlint/types";
import os from "os";
import path from "path";
import { secretLintProfiler } from "@secretlint/profiler";
import pMap from "p-map";

const debug = require("debug")("@secretlint/node");
export type SecretLintEngineOptions = {
    /**
     * If configFilePath is not defined, search config file from cwd(current working dir)
     */
    configFilePath?: string;
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
};

const lintFile = async (filePath: string, options: SecretLintCoreDescriptor) => {
    const rawSource = await createRawSource(filePath);
    return lintSource(rawSource, options);
};

const hasErrorMessage = (result: SecretLintCoreResult): boolean => {
    return result.messages.length > 0;
};
const executeOnContent = async ({
    content,
    filePath,
    config,
    options
}: {
    content: string;
    filePath: string;
    config: SecretLintCoreDescriptor;
    options: SecretLintEngineOptions;
}) => {
    debug("executeOnContent content: %s", `${content.slice(0, 24)}...`);
    debug("executeOnContent filePath: %s", filePath);
    const result = await lintSource(
        {
            filePath: filePath,
            content: content,
            ext: path.extname(filePath),
            contentType: "text"
        },
        config
    );
    debug("executeOnContent result: %o", result);
    secretLintProfiler.mark({
        type: "@node>format::start"
    });
    const formatter = createFormatter({
        color: options.color ?? true,
        formatterName: options.formatter,
        terminalLink: options.terminalLink ?? false
    });
    const output = formatter.format([result]);
    secretLintProfiler.mark({
        type: "@node>format::end"
    });
    return {
        ok: !hasErrorMessage(result),
        output: output
    };
};

const executeOnFiles = async ({
    filePathList,
    config,
    options
}: {
    filePathList: string[];
    config: SecretLintCoreDescriptor;
    options: SecretLintEngineOptions;
}) => {
    const mapper = async (filePath: string) => {
        debug("executeOnFiles file: %s", filePath);
        const result = await lintFile(filePath, config);
        debug("executeOnFiles result: %o", result);
        return result;
    };
    const results = await pMap(filePathList, mapper, {
        // Avoid: EMFILE: too many open files, uv_cwd
        // https://github.com/secretlint/secretlint/issues/72
        concurrency: os.cpus().length
    });
    debug("executeOnFiles result counts: %s", results.length);
    secretLintProfiler.mark({
        type: "@node>format::start"
    });
    const formatter = createFormatter({
        color: options.color ?? true,
        formatterName: options.formatter,
        terminalLink: options.terminalLink ?? false
    });
    const output = formatter.format(results);
    secretLintProfiler.mark({
        type: "@node>format::end"
    });
    const hasErrorAtLeastOne = results.some(result => {
        return hasErrorMessage(result);
    });
    return {
        ok: !hasErrorAtLeastOne,
        output: output
    };
};

/**
 * Create SecretLint Engine and return the instance.
 * The engine load config file(.secretlintrc) automatically
 * @param options
 */
export const createEngine = async (options: SecretLintEngineOptions) => {
    secretLintProfiler.mark({
        type: "@node>load-config::start"
    });
    const loadedResult = loadConfig({
        cwd: options.cwd,
        configFilePath: options.configFilePath
    });
    secretLintProfiler.mark({
        type: "@node>load-config::end"
    });
    if (!loadedResult.ok) {
        throw new Error(loadedResult.errors.map(error => error.stack).join("\n\n"));
    }
    debug("ConfigFilePath: %s", loadedResult.configFilePath);
    debug("Config: %O", loadedResult.config);
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
                type: "@node>execute::start"
            });
            return executeOnContent({
                content,
                filePath,
                config: loadedResult.config,
                options: options
            }).finally(() => {
                secretLintProfiler.mark({
                    type: "@node>execute::end"
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
                type: "@node>execute::start"
            });
            return executeOnFiles({
                filePathList,
                config: loadedResult.config,
                options: options
            }).finally(() => {
                secretLintProfiler.mark({
                    type: "@node>execute::end"
                });
            });
        }
    };
};
