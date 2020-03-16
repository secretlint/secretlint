import { rcFile } from "rc-config-loader";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreDescriptor,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorUnionRule,
    SecretLintUnionRuleCreator
} from "@secretlint/types";
import { secretLintProfiler } from "@secretlint/profiler";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver";
import { moduleInterop } from "@textlint/module-interop";
import { validateConfig, validateRawConfig } from "@secretlint/config-validator";

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
export type SecretLintConfigLoaderResult =
    | {
          ok: true;
          config: SecretLintCoreDescriptor; // Core Option object
          configFilePath: string;
      }
    | {
          // load config error
          ok: false;
          configFilePath?: string;
          rawConfig?: SecretLintConfigDescriptor; // Config Raw object
          errors: Error[];
      };

export type SecretLintConfigLoaderRawResult =
    | {
          ok: true;
          configFilePath: string;
          rawConfig: SecretLintConfigDescriptor; // Config Raw object
      }
    | {
          ok: false;
          errors: Error[];
      };
export type SecretLintLoadPackagesFromRawConfigOptions = {
    /**
     * Loaded config object
     */
    rawConfig: SecretLintConfigDescriptor;
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
export type SecretLintLoadPackagesFromRawConfigResult =
    | {
          ok: true;
          config: SecretLintCoreDescriptor; // Core Option object
      }
    | {
          // load config error
          ok: false;
          errors: Error[];
      };

/**
 * Load packages in RawConfig and return loaded config object
 * @param options
 */
export const loadPackagesFromRawConfig = (
    options: SecretLintLoadPackagesFromRawConfigOptions
): SecretLintLoadPackagesFromRawConfigResult => {
    // Early validation, validate rawConfig by JSON Schema
    const resultValidateRawConfig = validateRawConfig(options.rawConfig);
    if (!resultValidateRawConfig.ok) {
        return {
            ok: false,
            errors: [resultValidateRawConfig.error]
        };
    }
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::start"
    });
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.node_moduleDir
    });
    const errors: Error[] = [];
    const rules: SecretLintCoreDescriptorUnionRule[] = [];
    options.rawConfig.rules.forEach(configDescriptorRule => {
        try {
            secretLintProfiler.mark({
                type: "@config-loader>resolve-module::start",
                id: configDescriptorRule.id
            });
            const replacedDefinition =
                options.testReplaceDefinitions &&
                options.testReplaceDefinitions.find(({ id }) => {
                    return id === configDescriptorRule.id;
                });
            // TODO: any to be remove
            const ruleModule: any = replacedDefinition
                ? replacedDefinition.rule
                : moduleInterop(require(moduleResolver.resolveRulePackageName(configDescriptorRule.id)));
            const secretLintConfigDescriptorRules: SecretLintCoreDescriptorRule[] | undefined =
                "rules" in configDescriptorRule && Array.isArray(configDescriptorRule.rules)
                    ? (configDescriptorRule.rules.filter(rule => rule !== undefined) as SecretLintCoreDescriptorRule[])
                    : undefined;
            rules.push({
                id: configDescriptorRule.id,
                rule: ruleModule,
                rules: secretLintConfigDescriptorRules,
                options: configDescriptorRule.options,
                severity: "severity" in configDescriptorRule ? configDescriptorRule.severity : undefined,
                disabled: configDescriptorRule.disabled,
                allowMessageIds:
                    "allowMessageIds" in configDescriptorRule ? configDescriptorRule.allowMessageIds : undefined
            });
            secretLintProfiler.mark({
                type: "@config-loader>resolve-module::end",
                id: configDescriptorRule.id
            });
        } catch (error) {
            errors.push(error);
        }
    });
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::end"
    });
    if (errors.length > 0) {
        return {
            ok: false,
            errors
        };
    }
    const loadedConfig: SecretLintCoreDescriptor = {
        sharedOptions: options.rawConfig.sharedOptions,
        rules
    };
    // Finally, validate loadedConfig with validator
    // This validator require actual `rule` creator for `disabledMessage` option.
    const resultValidateConfig = validateConfig(loadedConfig);
    if (!resultValidateConfig.ok) {
        return {
            ok: false,
            errors: [resultValidateConfig.error]
        };
    }
    return {
        ok: true,
        config: loadedConfig
    };
};
/**
 *  Load config file and return config object that is loaded rule instance.
 * @param options
 */
export const loadConfig = (options: SecretLintConfigLoaderOptions): SecretLintConfigLoaderResult => {
    secretLintProfiler.mark({
        type: "@config-loader>load-config-file::start"
    });
    const rawResult = loadRawConfig(options);
    secretLintProfiler.mark({
        type: "@config-loader>load-config-file::end"
    });
    if (!rawResult.ok) {
        return {
            ok: false,
            errors: rawResult.errors
        };
    }
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::start"
    });
    const result = loadPackagesFromRawConfig({
        rawConfig: rawResult.rawConfig,
        node_moduleDir: options.node_moduleDir,
        testReplaceDefinitions: options.testReplaceDefinitions
    });
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::end"
    });
    if (!result.ok) {
        return {
            ok: false,
            configFilePath: rawResult.configFilePath,
            errors: result.errors
        };
    }
    return {
        ok: true,
        config: result.config,
        configFilePath: rawResult.configFilePath
    };
};
/**
 *  Load config file and return config object that is not loaded rule instance
 *  It is just JSON present for config file. Raw data
 * @param options
 */
export const loadRawConfig = (options: SecretLintConfigLoaderOptions): SecretLintConfigLoaderRawResult => {
    try {
        const results = rcFile<SecretLintConfigDescriptor>("secretlint", {
            cwd: options.cwd,
            configFileName: options.configFilePath,
            packageJSON: {
                fieldName: "secretlint"
            }
        });
        // Not Found
        if (!results) {
            return {
                ok: false,
                errors: [new Error("secretlint config is not found")]
            };
        }
        return {
            ok: true,
            rawConfig: results.config,
            configFilePath: results.filePath
        };
    } catch (error) {
        return {
            ok: false,
            errors: [error]
        };
    }
};
