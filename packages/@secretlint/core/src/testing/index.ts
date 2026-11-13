import * as fs from "node:fs";
import * as path from "node:path";
import * as assert from "node:assert";
import { pathToFileURL } from "node:url";
import type {
    SecretLintConfigDescriptor,
    SecretLintConfigDescriptorRulePreset,
    SecretLintCoreConfig,
    SecretLintCoreConfigUnionRule,
    SecretLintRawSource,
    SecretLintRuleCreator,
    SecretLintRulePresetCreator,
} from "@secretlint/types";
import { lintSource } from "../index.js";
import { getBuiltinRule } from "../builtin/index.js";

/**
 * Snapshot testing of secretlint rules: `@secretlint/core/testing`.
 * `@secretlint/tester` wraps this, and the tests of the built-in rules in `@secretlint/core` use this directly,
 * because `@secretlint/tester` depends on `@secretlint/core`.
 *
 * Each directory in the snapshot directory is a test case:
 * - `input*`: the file to lint
 * - `.secretlintrc.json` (optional): the config. Otherwise, `defaultConfig` is used
 * - `options.{js,json,ts}` (optional): `{ inputFilePath }`
 * - `output.json`: the expected result. `UPDATE_SNAPSHOT=1` or `updateSnapshot: true` writes it
 */
export type SnapshotOptions = {
    /**
     * The directory that has the test case directories
     */
    snapshotDirectory: string;
    /**
     * The config for a test case that does not have `.secretlintrc.json`
     */
    defaultConfig: SecretLintCoreConfig;
    /**
     * Write `output.json` instead of comparing it. `UPDATE_SNAPSHOT=1` also turns on this option.
     */
    updateSnapshot?: boolean;
    /**
     * Create the source of the input file. `createRawSource` of `@secretlint/source-creator`.
     */
    createRawSource: (filePath: string) => Promise<SecretLintRawSource>;
    /**
     * Load `.secretlintrc.json` of a test case.
     * Default: resolve the rule ids from the built-in rules of `@secretlint/core`.
     */
    loadConfig?: (configFilePath: string) => Promise<SecretLintCoreConfig>;
};
export type SecretLintTestCaseOptions = {
    inputFilePath?: string;
};

const canResolve = (filePath: string): boolean => {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};
const defaultInterop = (module: any) => {
    return "default" in module ? module.default : module;
};
const loadTestCaseOptions = async (testCaseDir: string): Promise<SecretLintTestCaseOptions> => {
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
 * Load `.secretlintrc.json` in the same way as `loadConfig()` of `@secretlint/config-loader`,
 * but resolve the rules only from the built-in rules.
 */
export const loadBuiltinConfig = async (configFilePath: string): Promise<SecretLintCoreConfig> => {
    const descriptor: SecretLintConfigDescriptor = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    const rules = descriptor.rules.map((descriptorRule): SecretLintCoreConfigUnionRule => {
        const rule = getBuiltinRule(descriptorRule.id);
        if (!rule) {
            throw new Error(`${descriptorRule.id} is not a built-in rule. ${configFilePath}`);
        }
        if (rule.meta.type === "preset") {
            const presetDescriptor = descriptorRule as SecretLintConfigDescriptorRulePreset;
            return {
                id: descriptorRule.id,
                rule: rule as SecretLintRulePresetCreator,
                rules: presetDescriptor.rules?.map((presetRule) => ({ ...presetRule, type: "rule" })),
                options: descriptorRule.options,
                disabled: descriptorRule.disabled,
            } as SecretLintCoreConfigUnionRule;
        }
        return {
            id: descriptorRule.id,
            rule: rule as SecretLintRuleCreator,
            options: descriptorRule.options,
            severity: "severity" in descriptorRule ? descriptorRule.severity : undefined,
            disabled: descriptorRule.disabled,
            allowMessageIds: "allowMessageIds" in descriptorRule ? descriptorRule.allowMessageIds : undefined,
        } as SecretLintCoreConfigUnionRule;
    });
    return {
        sharedOptions: descriptor.sharedOptions,
        rules,
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
 * Return the rule that does not use keywords and scopes.
 * secretlint runs the returned rule for all content, and the rule checks the whole content.
 */
const toUnoptimizedRule = <T>(rule: SecretLintRuleCreator<T>): SecretLintRuleCreator<T> => {
    const meta = { ...rule.meta, keywords: undefined };
    if (rule.patterns === undefined) {
        return rule.meta.keywords === undefined ? rule : { ...rule, meta };
    }
    return {
        ...rule,
        meta,
        patterns: rule.patterns.map((pattern) => {
            // `when` is not an optimization: it decides whether the pattern is a part of the rule
            return {
                pattern: pattern.pattern,
                scope: "file",
                when: pattern.when,
                report: pattern.report,
            };
        }),
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

export type SnapshotTestCase = {
    name: string;
    /**
     * Return "skip" if the snapshot is written
     */
    run: () => Promise<"skip" | "done">;
};

/**
 * Return the test cases in the snapshot directory
 */
export const createSnapshotTestCases = (options: SnapshotOptions): SnapshotTestCase[] => {
    const { snapshotDirectory, defaultConfig, createRawSource } = options;
    const loadConfig = options.loadConfig ?? loadBuiltinConfig;
    const updateSnapshot = !!process.env.UPDATE_SNAPSHOT || !!options.updateSnapshot;
    const snapshotReplacer = (key: string, value: any) => {
        if (key === "filePath") {
            // normalize path separator for Windows
            return value.replace(snapshotDirectory, "[SNAPSHOT]").replace(/\\/g, "/");
        }
        return value;
    };
    return fs
        .readdirSync(snapshotDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
        .map(({ name: caseName }) => {
            return {
                name: caseName.replace(/[-_]/g, " "),
                run: async () => {
                    const testCaseDir = path.join(snapshotDirectory, caseName);
                    const secretlintrcFilePath = path.join(testCaseDir, ".secretlintrc.json");
                    const testCaseOptions = await loadTestCaseOptions(testCaseDir);
                    const inputFileName =
                        testCaseOptions.inputFilePath ??
                        fs.readdirSync(testCaseDir).find((fileName) => fileName.startsWith("input"));
                    if (!inputFileName) {
                        throw new Error(`Not found input file in ${testCaseDir}`);
                    }
                    const config = fs.existsSync(secretlintrcFilePath)
                        ? await loadConfig(secretlintrcFilePath)
                        : defaultConfig;
                    const rawSource = await createRawSource(path.join(testCaseDir, inputFileName));
                    const bytesResult = await lintSource({ source: rawSource, options: { config } });
                    // `patterns` and `meta.keywords` are optimizations. They should not change the result.
                    // - Lint the content as a string. A browser does not pass the bytes of the content.
                    // - Lint without `patterns` and `meta.keywords`: the rule checks the whole content.
                    const { contentBytes: _contentBytes, ...textSource } = rawSource;
                    const textResult = await lintSource({ source: textSource, options: { config } });
                    const unoptimizedResult = await lintSource({
                        source: textSource,
                        options: { config: toUnoptimizedConfig(config) },
                    });
                    const normalizeResult = (result: unknown) => JSON.parse(JSON.stringify(result));
                    // For text (and unknown), the bytes are only for speed, so the results should be the same without them.
                    // For binary, a rule needs the bytes: the decoded string has lost them.
                    const isText = rawSource.contentType !== "binary";
                    if (isText) {
                        assert.deepStrictEqual(
                            normalizeResult(bytesResult),
                            normalizeResult(textResult),
                            "The result of the content bytes should be the same as the result of the content string",
                        );
                        assert.deepStrictEqual(
                            normalizeResult(textResult),
                            normalizeResult(unoptimizedResult),
                            "The result with `patterns` and `meta.keywords` should be the same as the result of the whole content without them. Check keywords and scope of the rule.",
                        );
                    }
                    // The result does not have the content of the source.
                    // The snapshot has it as `sourceContent` to show what the ranges of the messages point to.
                    const snapshotResult = {
                        ...(isText ? textResult : bytesResult),
                        sourceContent: textSource.contentType === "text" ? textSource.content : undefined,
                    };
                    const expectedFilePath = path.join(testCaseDir, "output.json");
                    if (!fs.existsSync(expectedFilePath) || updateSnapshot) {
                        fs.writeFileSync(
                            expectedFilePath,
                            JSON.stringify(sortObject(snapshotResult), snapshotReplacer, 4),
                        );
                        return "skip";
                    }
                    const expected = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                    assert.deepStrictEqual(JSON.parse(JSON.stringify(snapshotResult, snapshotReplacer)), expected);
                    return "done";
                },
            };
        });
};
