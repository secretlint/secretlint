import * as fs from "node:fs";
import * as path from "node:path";
import * as assert from "node:assert";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import {
    SecretLintCoreConfig,
    SecretLintCoreConfigUnionRule,
    SecretLintRuleCreator,
    SecretLintRulePresetCreator,
    SecretLintUnionRuleCreator,
} from "@secretlint/types";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "url";

const canResolve = (filePath: string): boolean => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};
export type SnapshotOptions = {
    /**
     * Snapshot directory
     *
     * Example: <snapshotDirectory>/{test-case-name}/
     */
    snapshotDirectory: string | URL;
    /**
     * Define default config for testing
     */
    defaultConfig: SecretLintCoreConfig;
    /**
     * testDefinitions
     * Replace `id` to `rule`  implicitly
     * If this options is not defined, create testDefinitions from defaultConfig.
     *
     * This options are not required almost case.
     */
    testDefinitions?: {
        id: string;
        rule: SecretLintUnionRuleCreator;
    }[];
    /**
     * Update snapshot if the options is true
     * Exception, process.env.UPDATE_SNAPSHOT=1 force turn on this option.
     */
    updateSnapshot: boolean;
};
/**
 * Each test case options
 *
 * If <test-case>/options.js, use it
 */
export type SecretLintTestCaseOptions = {
    inputFilePath?: string;
};
const createSnapshotReplacer = (options: SnapshotOptions) => {
    return (key: string, value: any) => {
        // Filtering out properties
        if (key === "filePath") {
            if (typeof options.snapshotDirectory === "string") {
                return (
                    value
                        .replace(options.snapshotDirectory, "[SNAPSHOT]")
                        // normalize path separator for Windows
                        .replace(/\\/g, "/")
                );
            } else {
                return (
                    value
                        .replace(fileURLToPath(options.snapshotDirectory), "[SNAPSHOT]")
                        // normalize path separator for Windows
                        .replace(/\\/g, "/")
                );
            }
        }
        return value;
    };
};

const sortObject = <T extends { [index: string]: any }>(object: T) => {
    return Object.keys(object)
        .sort()
        .reduce((result, key: keyof T) => {
            result[key] = object[key];
            return result;
        }, {} as T);
};
const defaultInterop = (module: any) => {
    // if ".default" is defined, use it
    return "default" in module ? module.default : module;
};
const loadSecretlintTestCaseOptions: (testCaseDir: string) => Promise<SecretLintTestCaseOptions> = async (
    testCaseDir: string,
) => {
    if (canResolve(path.join(testCaseDir, "options.js"))) {
        return defaultInterop(await import(pathToFileURL(path.join(testCaseDir, "options.js")).href)).options;
    } else if (canResolve(path.join(testCaseDir, "options.json"))) {
        return JSON.parse(await fs.promises.readFile(path.join(testCaseDir, "options.json"), "utf-8"));
    } else if (canResolve(path.join(testCaseDir, "options.ts"))) {
        return defaultInterop(await import(pathToFileURL(path.join(testCaseDir, "options.ts")).href)).options;
    }
    return {};
};

/**
 * Return the rule without `patterns` and `meta.keywords`.
 * secretlint calls `create()` of the returned rule for all content, and the rule checks the whole content.
 */
const toUnoptimizedRule = <T>(rule: SecretLintRuleCreator<T>): SecretLintRuleCreator<T> => {
    if (rule.patterns === undefined && rule.meta.keywords === undefined) {
        return rule;
    }
    return {
        ...rule,
        meta: { ...rule.meta, keywords: undefined },
        patterns: undefined,
    };
};
const toUnoptimizedRulePreset = <T>(preset: SecretLintRulePresetCreator<T>): SecretLintRulePresetCreator<T> => {
    return {
        ...preset,
        create(context, options) {
            return preset.create(
                {
                    ...context,
                    registerRule(rule, defaultValue) {
                        return context.registerRule(toUnoptimizedRule(rule), defaultValue);
                    },
                },
                options,
            );
        },
    };
};
/**
 * Return the config that does not use `patterns` and `meta.keywords` of the rules.
 */
const toUnoptimizedConfig = (config: SecretLintCoreConfig): SecretLintCoreConfig => {
    return {
        ...config,
        rules: config.rules.map((descriptor) => {
            return {
                ...descriptor,
                rule:
                    descriptor.rule.meta.type === "preset"
                        ? toUnoptimizedRulePreset(descriptor.rule as SecretLintRulePresetCreator)
                        : toUnoptimizedRule(descriptor.rule as SecretLintRuleCreator),
            } as SecretLintCoreConfigUnionRule;
        }),
    };
};

/**
 * // Mocha
 * // $ mocha --loader ts-node/esm test/index.test.ts
 * describe("Snapshot Testing", () => {
 *  snapshot(options).forEach((name, test) => {
 *    it(name, async function() {
 *        const status = await test();
 *        if(status === "skip"){
 *            this.skip();
 *        }
 *    });
 *  }
 * });
 * // note:test
 * // $ node --loader ts-node/esm --test test/index.test.ts
 * import test from "node:test";
 * describe("Snapshot Testing", (t) => {
 *  await snapshot(options).forEach((name, test) => {
 *    return t.it(name, async function(context) {
 *        const status = await test();
 *        if(status === "skip"){
 *            context.skip();
 *        }
 *    });
 *  }
 * });
 */
export const snapshot = (options: SnapshotOptions) => {
    const snapshotDirectory = options.snapshotDirectory;
    const updateSnapshot = !!process.env.UPDATE_SNAPSHOT || options.updateSnapshot;
    const snapshotReplacer = createSnapshotReplacer(options);
    const testDefinitions: {
        id: string;
        rule: SecretLintUnionRuleCreator;
    }[] = options.testDefinitions
        ? options.testDefinitions
        : options.defaultConfig.rules.filter((rule) => {
              return rule.id && rule.rule;
          });
    return {
        forEach(handler: (testCaseName: string, testFunction: () => Promise<"skip" | "done">) => void) {
            const promises = fs
                .readdirSync(snapshotDirectory, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map(({ name }) => name)
                .filter((caseName) => {
                    // Ignore .dot directory
                    return !caseName.startsWith(".");
                })
                .map((caseName: string) => {
                    const normalizedTestName = caseName.replace(/[-_]/g, " ");
                    return handler(normalizedTestName, async () => {
                        const normalizedTestCaseDir =
                            typeof snapshotDirectory === "string"
                                ? snapshotDirectory
                                : fileURLToPath(snapshotDirectory);
                        const testCaseDir = path.join(normalizedTestCaseDir, caseName);
                        const secretlintrcFilePath = path.join(testCaseDir, ".secretlintrc.json");
                        const secretlintTestCaseOptions = await loadSecretlintTestCaseOptions(testCaseDir);
                        const inputPrefixFileName = fs.readdirSync(testCaseDir).find((filePath) => {
                            return filePath.startsWith("input");
                        });
                        const actualFileName = secretlintTestCaseOptions.inputFilePath
                            ? secretlintTestCaseOptions.inputFilePath
                            : inputPrefixFileName;
                        if (!actualFileName) {
                            throw new Error(`Not found input file in ${testCaseDir}`);
                        }
                        const actualFilePath = path.join(testCaseDir, actualFileName);
                        const loadedConfig = await (fs.existsSync(secretlintrcFilePath)
                            ? loadConfig({
                                  configFilePath: secretlintrcFilePath,
                                  testReplaceDefinitions: testDefinitions,
                              })
                            : undefined);
                        const config = loadedConfig && loadedConfig.ok ? loadedConfig.config : options.defaultConfig;
                        const rawSource = await createRawSource(actualFilePath);
                        const actualResult = await lintSource({
                            source: rawSource,
                            options: {
                                config,
                            },
                        });
                        // `patterns` and `meta.keywords` are optimizations. They should not change the result.
                        // - Lint the content as a string. A browser does not pass the bytes of the content.
                        // - Lint without `patterns` and `meta.keywords`: the rule checks the whole content.
                        // A difference means that keywords or the scope of a pattern are wrong.
                        // For example, a secret that does not include any keyword, or a "line" scope pattern
                        // that needs to see other lines.
                        const { contentBytes: _contentBytes, ...textSource } = rawSource;
                        const textResult = await lintSource({ source: textSource, options: { config } });
                        const unoptimizedResult = await lintSource({
                            source: textSource,
                            options: { config: toUnoptimizedConfig(config) },
                        });
                        const normalizeResult = (result: unknown) => JSON.parse(JSON.stringify(result));
                        assert.deepStrictEqual(
                            normalizeResult(textResult),
                            normalizeResult(actualResult),
                            "The result of the content string should be the same as the result of the content bytes",
                        );
                        assert.deepStrictEqual(
                            normalizeResult(actualResult),
                            normalizeResult(unoptimizedResult),
                            "The result with `patterns` and `meta.keywords` should be the same as the result of the whole content without them. Check keywords and scope of the rule.",
                        );
                        const expectedFilePath = path.join(testCaseDir, "output.json");
                        // Usage: update snapshots
                        // UPDATE_SNAPSHOT=1 npm test
                        if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                            // Sort Object by keys before Store JSON
                            fs.writeFileSync(
                                expectedFilePath,
                                JSON.stringify(sortObject(actualResult), snapshotReplacer, 4),
                            );
                            return "skip";
                        }
                        // compare input and output
                        const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                        assert.deepStrictEqual(JSON.parse(JSON.stringify(actualResult, snapshotReplacer)), expected);
                        return "done";
                    });
                });
            return Promise.all(promises);
        },
    };
};
