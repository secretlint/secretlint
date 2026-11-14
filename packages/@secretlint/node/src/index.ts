import { getKeywordScanPlan, lintSource } from "@secretlint/core";
import type { KeywordScanResult } from "@secretlint/core/keyword-scan";
import { loadConfig, loadPackagesFromConfigDescriptor, SecretLintConfigMessage } from "@secretlint/config-loader";
import { createFileSourceReader, createRawSource, createRawSourceFromBytes } from "@secretlint/source-creator";
import { loadFormatter } from "@secretlint/formatter";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreResult,
    SecretLintRuleLocaleTag,
} from "@secretlint/types";
import path from "node:path";
import { secretLintProfiler } from "@secretlint/profiler";
import debug0 from "debug";
import { CLAIM_SIZE, FileScanState, type HandedFiles } from "./keyword-scan-files.js";
import { createKeywordScanWorkers, getMaxKeywordScanThreads } from "./parallel-keyword-scan.js";

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
     * You can get the result via `secretLintProfiler.getStats()` of `@secretlint/profiler`.
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
type LintedFile = {
    result: SecretLintCoreResult;
    /**
     * The content of the file for the formatter.
     * It is `undefined` if the formatter does not get the content of the file.
     */
    content: string | undefined;
};
/**
 * Create a function that reads and lints a file.
 *
 * The files are read into one buffer, and the buffer has a file only until the next file is read.
 * So the returned function lints a file at a time: wait for the result before linting the next file.
 * Each `executeOnFiles()` call creates its own function, so concurrent calls do not share the buffer.
 *
 * The result does not have the content of the file, and a formatter gets the content via `getSource()`.
 * Most files have no message, and their bytes are never decoded.
 * So the function returns the content only for the text files that have messages.
 * "mask-result" formatter outputs the content of all files, so it reads all files as strings.
 */
const createFileLinter = ({ config, options }: { config: SecretLintCoreConfig; options: SecretLintEngineOptions }) => {
    const readFileSource = createFileSourceReader();
    const lintOptions = { ...options, config };
    return async (filePath: string): Promise<LintedFile> => {
        if (options.formatter === "mask-result") {
            // The source has its own buffer, and it has the bytes for the rules that check binary content
            const readStartTime = secretLintProfiler.isEnabled ? secretLintProfiler.now() : 0;
            const source = await createRawSource(filePath);
            if (secretLintProfiler.isEnabled) {
                secretLintProfiler.record("@node>read-file", undefined, readStartTime);
            }
            const result = await lintSource({ source, options: lintOptions });
            return { result, content: source.contentType === "text" ? source.content : undefined };
        }
        // Read and start the lint in the same turn: `lintSource()` scans the bytes at the start of the call
        const readStartTime = secretLintProfiler.isEnabled ? secretLintProfiler.now() : 0;
        const source = readFileSource(filePath);
        if (secretLintProfiler.isEnabled) {
            secretLintProfiler.record("@node>read-file", undefined, readStartTime);
        }
        const result = await lintSource({ source, options: lintOptions });
        // The buffer still has the file here, because the next file is not read yet
        const hasContent = source.contentType === "text" && result.messages.length > 0;
        return { result, content: hasContent ? source.content : undefined };
    };
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
        getSource: (sourceFilePath) => (sourceFilePath === filePath ? content : undefined),
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

/**
 * Lint the files, and return the results in the order of the files with the contents for the formatter.
 *
 * The main thread lints files one at a time as before. If the lint takes long, worker threads join:
 * they read files and scan them for the keywords of the rules, and hand a file to the main thread
 * only if a rule may run for it. The rules run only on the main thread.
 */
const lintFiles = async ({
    filePathList,
    config,
    options,
}: {
    filePathList: string[];
    config: SecretLintCoreConfig;
    options: SecretLintEngineOptions;
}): Promise<{ results: SecretLintCoreResult[]; contents: Map<string, string> }> => {
    // The contents for the formatter: `filePath` of the result to the content
    const contents = new Map<string, string>();
    const lintFile = createFileLinter({ config, options });
    const lintOptions = { ...options, config };
    const results: (SecretLintCoreResult | undefined)[] = new Array(filePathList.length).fill(undefined);
    const lintByMainThread = async (fileIndex: number) => {
        const filePath = filePathList[fileIndex] as string;
        debug("executeOnFiles file: %s", filePath);
        const { result, content } = await lintFile(filePath);
        debug("executeOnFiles result: %o", result);
        results[fileIndex] = result;
        if (content !== undefined) {
            contents.set(result.filePath, content);
        }
    };
    // "mask-result" needs the content of all files as strings.
    // The keyword scan is for text, so it needs a plan of keywords
    const maxThreads = options.formatter === "mask-result" ? 1 : getMaxKeywordScanThreads();
    const plan =
        maxThreads > 1 ? getKeywordScanPlan({ config, locale: options.locale, contentType: "text" }) : undefined;
    if (plan === undefined) {
        for (let fileIndex = 0; fileIndex < filePathList.length; fileIndex++) {
            await lintByMainThread(fileIndex);
        }
        return { results: results as SecretLintCoreResult[], contents };
    }
    const workers = createKeywordScanWorkers({ plan, filePathList, maxThreads });
    const state = workers.state;
    // The result of the keyword scan for a text file that has no keyword
    const noKeyword: KeywordScanResult = {
        planId: plan.id,
        hits: { found: new Uint8Array(plan.keywords.length), positions: new Int32Array(0), count: 0 },
        runsRules: false,
    };
    // Lint the files that the workers read. The bytes are from the worker, so the file is not read again
    const lintBatch = async (batch: HandedFiles) => {
        for (const file of batch.files) {
            const filePath = filePathList[file.fileIndex] as string;
            const source = createRawSourceFromBytes(
                filePath,
                new Uint8Array(batch.bytes, file.offset, file.byteLength),
                file.contentType,
            );
            // The keyword scan of the worker is for the text content type
            const keywordScanResult = file.contentType === "text" ? (file.keywordScanResult ?? noKeyword) : undefined;
            const result = await lintSource({ source, options: lintOptions, keywordScanResult });
            results[file.fileIndex] = result;
            if (source.contentType === "text" && result.messages.length > 0) {
                contents.set(result.filePath, source.content);
            }
        }
        state.addPendingBytes(-batch.bytes.byteLength);
    };
    const lintHandedFiles = async () => {
        for (const batch of workers.takeBatches()) {
            await lintBatch(batch);
        }
    };
    let mainCount = 0;
    const mainStartTime = performance.now();
    while (true) {
        workers.startWorkersIfWorth();
        if (workers.isRunning()) {
            // Let the messages of the workers arrive, and lint the handed files first: they hold memory
            await new Promise<void>((resolve) => setImmediate(resolve));
            await lintHandedFiles();
        }
        const start = state.claim();
        if (start >= filePathList.length) {
            break;
        }
        const end = Math.min(start + CLAIM_SIZE, filePathList.length);
        for (let fileIndex = start; fileIndex < end; fileIndex++) {
            await lintByMainThread(fileIndex);
            mainCount++;
        }
    }
    const mainDuration = performance.now() - mainStartTime;
    while (workers.isRunning()) {
        await workers.waitForMessage();
        await lintHandedFiles();
    }
    await lintHandedFiles();
    for (let fileIndex = 0; fileIndex < filePathList.length; fileIndex++) {
        if (results[fileIndex] !== undefined) {
            continue;
        }
        if (state.states[fileIndex] === FileScanState.NoMessages) {
            // No rule runs for the file. It is the same result as `lintSource()` returns for it
            results[fileIndex] = {
                filePath: filePathList[fileIndex] as string,
                sourceContentType: "text",
                messages: [],
            };
            continue;
        }
        // A worker could not read the file, or failed before it handed the file. Lint it as before
        await lintByMainThread(fileIndex);
        mainCount++;
    }
    if (secretLintProfiler.isEnabled && workers.threads.length > 0) {
        secretLintProfiler.addTotal("@node>keyword-scan-thread", "main", { count: mainCount, duration: mainDuration });
        for (const thread of workers.threads) {
            secretLintProfiler.addTotal("@node>keyword-scan-thread", thread.name, {
                count: thread.scannedCount,
                duration: thread.duration,
            });
        }
    }
    return { results: results as SecretLintCoreResult[], contents };
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
    secretLintProfiler.count("@node>files", undefined, filePathList.length);
    const { results, contents } = await lintFiles({ filePathList, config, options });
    debug("executeOnFiles result counts: %s", results.length);
    secretLintProfiler.mark({
        type: "@node>format::start",
    });
    const formatter = await loadFormatter({
        color: options.color ?? true,
        formatterName: options.formatter,
        terminalLink: options.terminalLink ?? false,
        getSource: (filePath) => contents.get(filePath),
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
