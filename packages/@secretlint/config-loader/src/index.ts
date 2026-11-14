import { loadConfigFile, rcFile } from "rc-config-loader";
import {
    SecretLintConfigDescriptor,
    SecretLintConfigDescriptorRulePreset,
    SecretLintCoreConfig,
    SecretLintCoreConfigUnionRule,
    SecretLintRuleModule,
    SecretLintRulePresetCreator,
    SecretLintUnionRuleCreator,
} from "@secretlint/types";
import { secretLintProfiler } from "@secretlint/profiler";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver.js";
import { validateConfigDescriptor, validateConfigWithDescriptor } from "./validator.js";
import { AggregationError } from "./AggregationError.js";
import { dynamicImport } from "@secretlint/resolver";
import { getConfigMessages, SecretLintConfigMessage } from "./config-messages.js";
import { createFullPackageName } from "./package-name-util.js";

export type { SecretLintConfigMessage };

/**
 * The configuration that is used when no configuration is found.
 * It is the recommend preset, the same configuration that `secretlint --init` writes.
 */
export const DEFAULT_CONFIG_DESCRIPTOR: SecretLintConfigDescriptor = Object.freeze({
    rules: Object.freeze([
        Object.freeze({
            id: "@secretlint/secretlint-rule-preset-recommend",
        }),
    ]),
}) as SecretLintConfigDescriptor;

export function importSecretlintCreator(
    moduleExports?: SecretLintRuleModule | Record<string, unknown>,
): SecretLintUnionRuleCreator {
    if (!moduleExports) {
        throw new Error("Secretlint rule should export { creator }. module is undefined");
    }
    if (!("creator" in moduleExports)) {
        throw new Error("Secretlint rule should export { creator }. module does not export creator object.");
    }
    return moduleExports.creator as SecretLintUnionRuleCreator;
}

/**
 * Resolve a built-in rule or preset of @secretlint/core by the id in the config.
 * The id is the full id (`@secretlint/secretlint-rule-aws`) or the short form that the module resolver accepts
 * (`@secretlint/aws`). Return `undefined` if the id is not built-in.
 *
 * A built-in id is resolved from @secretlint/core even if the package of the same name is installed,
 * so the rule always matches the version of the core.
 */
const resolveBuiltinRule = async (id: string): Promise<SecretLintUnionRuleCreator | undefined> => {
    const { getBuiltinRule } = await import("@secretlint/core/builtin");
    return getBuiltinRule(id) ?? getBuiltinRule(createFullPackageName("secretlint-rule-", id));
};

export type SecretLintConfigLoaderOptions = {
    cwd?: string;
    configFilePath?: string;
    // For debugging
    /**
     * node_modules directory path
     * Default: undefined
     */
    node_moduleDir?: string;
    /**
     * This definitions replace id to rule module
     * It is useful for replacing specific ruleId with specific rule module.
     * Main use-case is tester.
     */
    testReplaceDefinitions?: {
        id: string;
        rule: SecretLintUnionRuleCreator;
    }[];
};
export type SecretLintConfigLoaderResult = {
    ok: true;
    /**
     * Full config object
     */
    config: SecretLintCoreConfig;
    /**
     * Partial config file represent
     */
    configDescriptor: SecretLintConfigDescriptor;
    /**
     * The path of the config file
     * `undefined` when the default config is used
     */
    configFilePath: string | undefined;
    /**
     * `true` when no config is found and DEFAULT_CONFIG_DESCRIPTOR is used
     */
    isDefault: boolean;
    /**
     * Problems in the config file that are reported like lint messages
     */
    messages: SecretLintConfigMessage[];
};

export type SecretLintConfigLoaderRawResult = {
    ok: true;
    /**
     * The path of the config file
     * `undefined` when the default config is used
     */
    configFilePath: string | undefined;
    /**
     * `true` when no config is found and DEFAULT_CONFIG_DESCRIPTOR is used
     */
    isDefault: boolean;
    // Config Raw object
    configDescriptor: SecretLintConfigDescriptor;
};
export type SecretLintLoadPackagesFromRawConfigOptions = {
    /**
     * Loaded config object
     */
    configDescriptor: SecretLintConfigDescriptor;
    /**
     * node_modules directory path
     * Default: undefined
     */
    node_moduleDir?: string;
    /**
     * This definitions replace id to rule module
     * It is useful for replacing specific ruleId with specific rule module.
     * Main use-case is tester.
     */
    testReplaceDefinitions?: {
        id: string;
        rule: SecretLintUnionRuleCreator;
    }[];
};
export type SecretLintLoadPackagesFromRawConfigResult = {
    ok: true;
    config: SecretLintCoreConfig; // Core Option object
    /**
     * Problems in the config that are reported like lint messages
     */
    messages: SecretLintConfigMessage[];
};

/**
 * Load packages in RawConfig and return loaded config object
 * @param options
 */
export const loadPackagesFromConfigDescriptor = async (
    options: SecretLintLoadPackagesFromRawConfigOptions,
): Promise<SecretLintLoadPackagesFromRawConfigResult> => {
    // Early validation, validate rawConfig by JSON Schema
    const validateConfigDescriptorResult = validateConfigDescriptor(options.configDescriptor);
    if (!validateConfigDescriptorResult.ok) {
        throw validateConfigDescriptorResult.error;
    }
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::start",
    });
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.node_moduleDir,
    });
    // TODO: remove any
    const isSecretLintCoreConfigRulePreset = (v: SecretLintUnionRuleCreator): v is SecretLintRulePresetCreator => {
        return v.meta.type === "preset";
    };
    const errors: Error[] = [];
    const rules: SecretLintCoreConfigUnionRule[] = [];
    for (const configDescriptorRule of options.configDescriptor.rules) {
        try {
            secretLintProfiler.mark({
                type: "@config-loader>resolve-module::start",
                id: configDescriptorRule.id,
            });
            const replacedDefinition =
                options.testReplaceDefinitions &&
                options.testReplaceDefinitions.find(({ id }) => {
                    return id === configDescriptorRule.id;
                });
            // Resolution order: test replacement -> built-in rule of @secretlint/core -> npm package
            const builtinRule = replacedDefinition ? undefined : await resolveBuiltinRule(configDescriptorRule.id);
            // TODO: any to be remove
            const ruleCreator: SecretLintUnionRuleCreator = replacedDefinition
                ? replacedDefinition.rule
                : builtinRule
                  ? builtinRule
                  : importSecretlintCreator(
                        (
                            await dynamicImport(moduleResolver.resolveRulePackageName(configDescriptorRule.id), {
                                parentModule: "config-loader",
                                parentImportMeta: import.meta,
                            })
                        ).exports,
                    );
            if (isSecretLintCoreConfigRulePreset(ruleCreator)) {
                const configDescriptorRulePreset = configDescriptorRule as SecretLintConfigDescriptorRulePreset;
                rules.push({
                    id: configDescriptorRule.id,
                    rule: ruleCreator,
                    // options for rules
                    rules: configDescriptorRulePreset?.rules?.map((rule) => {
                        return {
                            ...rule,
                            type: "rule",
                        };
                    }),
                    options: configDescriptorRule.options,
                    disabled: configDescriptorRule.disabled,
                });
            } else {
                rules.push({
                    id: configDescriptorRule.id,
                    rule: ruleCreator,
                    options: configDescriptorRule.options,
                    severity: "severity" in configDescriptorRule ? configDescriptorRule.severity : undefined,
                    disabled: configDescriptorRule.disabled,
                    allowMessageIds:
                        "allowMessageIds" in configDescriptorRule ? configDescriptorRule.allowMessageIds : undefined,
                });
            }
            secretLintProfiler.mark({
                type: "@config-loader>resolve-module::end",
                id: configDescriptorRule.id,
            });
        } catch (error) {
            const newError =
                error instanceof Error
                    ? new Error(
                          `Failed to load rule module: ${configDescriptorRule.id}

Error: ${error.message}`,
                          {
                              cause: error,
                          },
                      )
                    : new Error(`Failed to load rule module: ${configDescriptorRule.id}

Error: ${String(error)}`);
            errors.push(newError);
        }
    }
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::end",
    });
    if (errors.length > 0) {
        throw new AggregationError(errors, "secretlint loading errors");
    }
    const loadedConfig: SecretLintCoreConfig = {
        sharedOptions: options.configDescriptor.sharedOptions,
        rules,
    };
    // Finally, validate loadedConfig with validator
    // This validator require actual `rule` creator for `disabledMessage` option.
    const resultValidateConfig = validateConfigWithDescriptor({
        config: loadedConfig,
    });
    if (!resultValidateConfig.ok) {
        throw resultValidateConfig.error;
    }
    return {
        ok: true,
        config: loadedConfig,
        messages: getConfigMessages(options.configDescriptor),
    };
};
/**
 *  Load config file and return config object that is loaded rule instance.
 * @param options
 */
export const loadConfig = async (options: SecretLintConfigLoaderOptions): Promise<SecretLintConfigLoaderResult> => {
    secretLintProfiler.mark({
        type: "@config-loader>load-config-file::start",
    });
    const { configDescriptor, configFilePath, isDefault } = await loadConfigDescriptor(options);
    secretLintProfiler.mark({
        type: "@config-loader>load-config-file::end",
    });
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::start",
    });
    const configLoadResult = await loadPackagesFromConfigDescriptor({
        configDescriptor,
        node_moduleDir: options.node_moduleDir,
        testReplaceDefinitions: options.testReplaceDefinitions,
    });
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::end",
    });
    return {
        ok: true,
        config: configLoadResult.config,
        configDescriptor,
        configFilePath,
        isDefault,
        messages: configLoadResult.messages,
    };
};
/**
 *  Load config file and return config object that is not loaded rule instance
 *  It is just JSON present for config file. Raw data
 * @param options
 */
export const loadConfigDescriptor = async (
    options: SecretLintConfigLoaderOptions,
): Promise<SecretLintConfigLoaderRawResult> => {
    // A given config file path names exactly one file: no search in the parent directories, no extension added
    if (options.configFilePath !== undefined) {
        try {
            const result = loadConfigFile<SecretLintConfigDescriptor>(options.configFilePath, {
                cwd: options.cwd,
            });
            return {
                ok: true,
                configDescriptor: result.config,
                configFilePath: result.filePath,
                isDefault: false,
            };
        } catch (error) {
            if (isNotFoundError(error)) {
                throw new Error(`secretlint config file is not found: ${error.path ?? options.configFilePath}`, {
                    cause: error,
                });
            }
            throw error;
        }
    }
    const results = rcFile<SecretLintConfigDescriptor>("secretlint", {
        cwd: options.cwd,
        packageJSON: {
            fieldName: "secretlint",
        },
    });
    // No config is found from cwd up to the root: use the recommend preset
    if (!results) {
        return {
            ok: true,
            configDescriptor: structuredClone(DEFAULT_CONFIG_DESCRIPTOR),
            configFilePath: undefined,
            isDefault: true,
        };
    }
    return {
        ok: true,
        configDescriptor: results.config,
        configFilePath: results.filePath,
        isDefault: false,
    };
};

const isNotFoundError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT";
};

export type validateConfigResult =
    | {
          ok: true;
      }
    | {
          ok: false;
          error: AggregationError | Error;
      };
export const validateConfig = async (options: SecretLintConfigLoaderOptions): Promise<validateConfigResult> => {
    try {
        await loadConfig(options);
        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};
