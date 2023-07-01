import * as fs from "node:fs";
import * as path from "node:path";
import * as assert from "node:assert";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { SecretLintCoreConfig, SecretLintUnionRuleCreator } from "@secretlint/types";
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
const createSnapshotRepalcer = (options: SnapshotOptions) => {
    return (key: string, value: any) => {
        // Filtering out properties
        if (key === "filePath") {
            if (typeof options.snapshotDirectory === "string") {
                return value.replace(options.snapshotDirectory, "[SNAPSHOT]");
            } else {
                return value.replace(fileURLToPath(options.snapshotDirectory), "[SNAPSHOT]");
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
    testCaseDir: string
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
 *  return snapshot(options).forEach((name, test) => {
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
                        const expectedFilePath = path.join(testCaseDir, "output.json");
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
                        assert.deepStrictEqual(JSON.parse(JSON.stringify(actualResult, snapshotReplacer)), expected);
                        return "done";
                    });
                });
            return Promise.all(promises);
        },
    };
};
