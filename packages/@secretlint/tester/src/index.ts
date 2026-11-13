import { fileURLToPath } from "node:url";
import { createSnapshotTestCases } from "@secretlint/core/testing";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { SecretLintCoreConfig, SecretLintUnionRuleCreator } from "@secretlint/types";

export type { SecretLintTestCaseOptions } from "@secretlint/core/testing";
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
 * Snapshot testing of a secretlint rule.
 * The test runner is `@secretlint/core/testing`, and this loads `.secretlintrc.json` of a test case with `@secretlint/config-loader`.
 *
 * // $ node --import tsx --test test/index.test.ts
 * import test from "node:test";
 * test("Snapshot Testing", async (t) => {
 *  await snapshot(options).forEach((name, test) => {
 *    return t.test(name, async (context) => {
 *        const status = await test();
 *        if(status === "skip"){
 *            context.skip();
 *        }
 *    });
 *  });
 * });
 */
export const snapshot = (options: SnapshotOptions) => {
    const snapshotDirectory =
        typeof options.snapshotDirectory === "string"
            ? options.snapshotDirectory
            : fileURLToPath(options.snapshotDirectory);
    const testDefinitions = options.testDefinitions
        ? options.testDefinitions
        : options.defaultConfig.rules.filter((rule) => {
              return rule.id && rule.rule;
          });
    const testCases = createSnapshotTestCases({
        snapshotDirectory,
        defaultConfig: options.defaultConfig,
        updateSnapshot: options.updateSnapshot,
        createRawSource,
        loadConfig: async (configFilePath) => {
            const loadedConfig = await loadConfig({
                configFilePath,
                testReplaceDefinitions: testDefinitions,
            });
            return loadedConfig.config;
        },
    });
    return {
        forEach(handler: (testCaseName: string, testFunction: () => Promise<"skip" | "done">) => void) {
            return Promise.all(testCases.map((testCase) => handler(testCase.name, testCase.run)));
        },
    };
};
