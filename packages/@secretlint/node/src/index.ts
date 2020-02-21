import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { createFormatter } from "@secretlint/formatter";
import { SecretLintCoreDescriptor, SecretLintCoreResult } from "@secretlint/types";
import path from "path";
import { secretLintProfiler } from "@secretlint/profiler";

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
    const result = await lintSource(
        {
            filePath: filePath,
            content: content,
            ext: path.extname(filePath),
            contentType: "text"
        },
        config
    );
    secretLintProfiler.mark({
        type: "@node>format::start"
    });
    const formatter = createFormatter({
        color: options.color,
        formatterName: options.formatter
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
    const resultPromises = filePathList.map(filePath => {
        return lintFile(filePath, config);
    });
    const results = await Promise.all(resultPromises);
    secretLintProfiler.mark({
        type: "@node>format::start"
    });
    const formatter = createFormatter({
        color: options.color,
        formatterName: options.formatter
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
            debug("content: %s", content);
            debug("filePath: %s", filePath);
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
            debug("filePathLList: %O", filePathList);
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
