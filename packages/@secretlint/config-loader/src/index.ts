import { rcFile } from "rc-config-loader";
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

export function importSecretlintCreator(
    moduleExports?: SecretLintRuleModule | Record<string, unknown>
): SecretLintUnionRuleCreator {
    if (!moduleExports) {
        throw new Error("Secretlint rule should export { creator }. module is undefined");
    }
    if (!("creator" in moduleExports)) {
        throw new Error("Secretlint rule should export { creator }. module does not export creator object.");
    }
    return moduleExports.creator as SecretLintUnionRuleCreator;
}

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
    configFilePath: string;
};

export type SecretLintConfigLoaderRawResult = {
    ok: true;
    configFilePath: string;
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
};

/**
 * Load packages in RawConfig and return loaded config object
 * @param options
 */
export const loadPackagesFromConfigDescriptor = async (
    options: SecretLintLoadPackagesFromRawConfigOptions
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
            // TODO: any to be remove
            const ruleCreator: SecretLintUnionRuleCreator = replacedDefinition
                ? replacedDefinition.rule
                : importSecretlintCreator(
                      (
                          await dynamicImport(moduleResolver.resolveRulePackageName(configDescriptorRule.id), {
                              parentModule: "config-loader",
                              parentImportMeta: import.meta,
                          })
                      ).exports
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
                          }
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
    const { configDescriptor, configFilePath } = await loadConfigDescriptor(options);
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
    };
};
/**
 *  Load config file and return config object that is not loaded rule instance
 *  It is just JSON present for config file. Raw data
 * @param options
 */
export const loadConfigDescriptor = async (
    options: SecretLintConfigLoaderOptions
): Promise<SecretLintConfigLoaderRawResult> => {
    const results = rcFile<SecretLintConfigDescriptor>("secretlint", {
        cwd: options.cwd,
        configFileName: options.configFilePath,
        packageJSON: {
            fieldName: "secretlint",
        },
    });
    // Not Found
    if (!results) {
        throw new Error(`secretlint config is not found
                
Secretlint require .secretlintrc config file.
The config file define the use of rules.`);
    }
    return {
        ok: true,
        configDescriptor: results.config,
        configFilePath: results.filePath,
    };
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
