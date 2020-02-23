import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import { SecretLintCoreDescriptor, SecretLintUnionRuleCreator } from "@secretlint/types";

const canResolve = (filePath: string): boolean => {
    try {
        require.resolve(filePath);
        return true;
    } catch {
        return false;
    }
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
    defaultConfig: SecretLintCoreDescriptor;
    /**
     * testDefinitions
     * Replace `id` to `rule`  implicitly
     * If this options is not defined, create testDefinitions from defaultConfig.
     *
     * This options is not required almost case.
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
        : options.defaultConfig.rules.filter(rule => {
              return rule.id && rule.rule;
          });
    return {
        forEach(handler: (testCaseName: string, testFunction: () => Promise<"skip" | "done">) => void) {
            fs.readdirSync(fixturesDir).map((caseName: string) => {
                const normalizedTestName = caseName.replace(/[-_]/g, " ");
                handler(normalizedTestName, async () => {
                    const fixtureDir = path.join(fixturesDir, caseName);
                    const secretlintrcFilePath = path.join(fixtureDir, ".secretlintrc.json");
                    const secretlintTestCaseOptionsFilePath = path.join(fixtureDir, "options");
                    const secretlintTestCaseOptions: SecretLintTestCaseOptions = canResolve(
                        secretlintTestCaseOptionsFilePath
                    )
                        ? require(secretlintTestCaseOptionsFilePath).options
                        : {};
                    const inputPrefixFileName = fs.readdirSync(fixtureDir).find(filePath => {
                        return filePath.startsWith("input");
                    });
                    const actualFileName = secretlintTestCaseOptions.inputFilePath
                        ? secretlintTestCaseOptions.inputFilePath
                        : inputPrefixFileName;
                    if (!actualFileName) {
                        throw new Error(`Not found input file in ${fixtureDir}`);
                    }
                    const actualFilePath = path.join(fixtureDir, actualFileName);
                    const loadedConfig = await (secretlintrcFilePath
                        ? loadConfig({
                              configFilePath: secretlintrcFilePath,
                              testReplaceDefinitions: testDefinitions
                          })
                        : undefined);
                    const config = loadedConfig && loadedConfig.ok ? loadedConfig.config : options.defaultConfig;
                    const rawSource = await createRawSource(actualFilePath);
                    const actualResult = await lintSource(rawSource, config);
                    const expectedFilePath = path.join(fixtureDir, "output.json");
                    // Usage: update snapshots
                    // UPDATE_SNAPSHOT=1 npm test
                    if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                        fs.writeFileSync(expectedFilePath, JSON.stringify(actualResult, snapshotReplacer, 4));
                        return "skip";
                    }
                    // compare input and output
                    const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                    assert.deepEqual(
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
        }
    };
};
