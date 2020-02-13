import { rcFile } from "rc-config-loader";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreDescriptor,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorUnionRule,
    SecretLintUnionRuleCreator
} from "@secretlint/types";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver";
import { moduleInterop } from "@textlint/module-interop";
import { validate } from "@secretlint/config-validator";

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
          configFilePath: string;
          config: SecretLintCoreDescriptor; // Core Option object
      }
    | {
          // load module error
          ok: false;
          configFilePath: string;
          rawConfig: SecretLintConfigDescriptor;
          errors: Error[];
      }
    | {
          // load config error
          ok: false;
          errors: Error[];
      };
export type SecretLintConfigLoaderRawResult =
    | {
          ok: true;
          configFilePath: string;
          config: SecretLintConfigDescriptor; // Config Raw object
      }
    | {
          ok: false;
          errors: Error[];
      };
/**
 *  Load config file and return config object that is loaded rule instance.
 * @param options
 */
export const loadConfig = (options: SecretLintConfigLoaderOptions): SecretLintConfigLoaderResult => {
    const rawResult = loadRawConfig(options);
    if (!rawResult.ok) {
        return {
            ok: false,
            errors: rawResult.errors
        };
    }
    const result = validate(rawResult.config);
    if (!result.ok) {
        return {
            ok: false,
            errors: [result.error]
        };
    }
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.node_moduleDir
    });
    const errors: Error[] = [];
    const rules: SecretLintCoreDescriptorUnionRule[] = [];
    rawResult.config.rules.forEach(configDescriptorRule => {
        try {
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
                ...(secretLintConfigDescriptorRules
                    ? {
                          rules: secretLintConfigDescriptorRules
                      }
                    : {}),
                ...("options" in configDescriptorRule
                    ? {
                          options: configDescriptorRule.options
                      }
                    : {}),
                ...("disabled" in configDescriptorRule
                    ? {
                          disabled: configDescriptorRule.disabled
                      }
                    : {})
            });
        } catch (error) {
            errors.push(error);
        }
    });
    if (errors.length > 0) {
        return {
            ok: false,
            rawConfig: rawResult.config,
            configFilePath: rawResult.configFilePath,
            errors
        };
    }
    return {
        ok: true,
        configFilePath: rawResult.configFilePath,
        config: {
            rules
        }
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
            config: results.config,
            configFilePath: results.filePath
        };
    } catch (error) {
        return {
            ok: false,
            errors: [error]
        };
    }
};
