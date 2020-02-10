import { rcFile } from "rc-config-loader";
import { SecretLintConfigDescriptor, SecretLintCoreDescriptor, SecretLintCoreDescriptorRule } from "@secretlint/types";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver";
import { moduleInterop } from "@textlint/module-interop";

export type SecretLintConfigLoaderOptions = {
    cwd?: string;
    configFilePath?: string;
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
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.cwd
    });
    const errors: Error[] = [];
    const rules: SecretLintCoreDescriptorRule[] = [];
    rawResult.config.rules.forEach(configDescriptorRule => {
        try {
            const moduleFilePath = moduleResolver.resolveRulePackageName(configDescriptorRule.id);
            rules.push({
                id: configDescriptorRule.id,
                rule: moduleInterop(require(moduleFilePath)),
                ...(configDescriptorRule.options !== undefined
                    ? {
                          options: configDescriptorRule.options
                      }
                    : {}),
                ...(configDescriptorRule.disabled !== undefined
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
