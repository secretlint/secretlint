import * as fs from "node:fs";
import * as path from "node:path";
import * as assert from "node:assert";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { SecretLintCoreConfig, SecretLintUnionRuleCreator } from "@secretlint/types";
import { pathToFileURL } from "node:url";

const canResolve = (filePath: string): boolean => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};
export type SnapshotOptions = {
    /**
     * Snapshot directory
     *
     * Example: <snapshotDirectory>/{test-case-name}/
     */
    snapshotDirectory: string;
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
const createSnapshotRepalcer = (options: SnapshotOptions) => {
    return (key: string, value: any) => {
        // Filtering out properties
        if (key === "filePath") {
            return value.replace(options.snapshotDirectory, "[SNAPSHOT]");
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
/**
 * // Mocha
 * describe("Snapshot Testing", () => {
 *  snapshot(options).forEach((name, test) => {
 *    it(name, async function() {
 *        const status = await test();
 *        if(status === "skip"){
 *            this.skip();
 *        }
 *    });
 *  }
 * })
 */
export const snapshot = (options: SnapshotOptions) => {
    const fixturesDir = options.snapshotDirectory;
    const updateSnapshot = !!process.env.UPDATE_SNAPSHOT || options.updateSnapshot;
    const snapshotReplacer = createSnapshotRepalcer(options);
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
            fs.readdirSync(fixturesDir, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map(({ name }) => name)
                .filter((caseName) => {
                    // Ignore .dot directory
                    return !caseName.startsWith(".");
                })
                .map((caseName: string) => {
                    const normalizedTestName = caseName.replace(/[-_]/g, " ");
                    handler(normalizedTestName, async () => {
                        const fixtureDir = path.join(fixturesDir, caseName);
                        const secretlintrcFilePath = path.join(fixtureDir, ".secretlintrc.json");
                        const secretlintTestCaseOptionsFilePath = path.join(fixtureDir, "options");
                        const secretlintTestCaseOptions: SecretLintTestCaseOptions = canResolve(
                            secretlintTestCaseOptionsFilePath
                        )
                            ? (await import(pathToFileURL(secretlintTestCaseOptionsFilePath).href)).options
                            : {};
                        const inputPrefixFileName = fs.readdirSync(fixtureDir).find((filePath) => {
                            return filePath.startsWith("input");
                        });
                        const actualFileName = secretlintTestCaseOptions.inputFilePath
                            ? secretlintTestCaseOptions.inputFilePath
                            : inputPrefixFileName;
                        if (!actualFileName) {
                            throw new Error(`Not found input file in ${fixtureDir}`);
                        }
                        const actualFilePath = path.join(fixtureDir, actualFileName);
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
                        const expectedFilePath = path.join(fixtureDir, "output.json");
                        // Usage: update snapshots
                        // UPDATE_SNAPSHOT=1 npm test
                        if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                            // Sort Object by keys before Store JSON
                            fs.writeFileSync(
                                expectedFilePath,
                                JSON.stringify(sortObject(actualResult), snapshotReplacer, 4)
                            );
                            return "skip";
                        }
                        // compare input and output
                        const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                        assert.deepStrictEqual(
                            JSON.parse(JSON.stringify(actualResult, snapshotReplacer)),
                            expected,
                            `
${fixtureDir}
${JSON.stringify(actualResult, snapshotReplacer)}
`
                        );
                        return "done";
                    });
                });
        },
    };
};
