import { rcFile } from "rc-config-loader";
import { SecretLintConfigDescriptor, SecretLintCoreDescriptor, SecretLintCoreDescriptorRule } from "@secretlint/types";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver";
import { moduleInterop } from "@textlint/module-interop";

export type SecretLintConfigLoaderOptions = {
    cwd?: string;
};
export type SecretLintConfigLoaderResult =
    | {
          ok: true;
          configFilePath: string;
          config: SecretLintCoreDescriptor; // Core Option object
      }
    | {
          ok: false;
          configFilePath: null;
          config: null;
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
    const rawResult = loadConfigRaw(options);
    if (!rawResult.ok) {
        return {
            ok: false,
            configFilePath: null,
            config: null,
            errors: rawResult.errors
        };
    }
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.cwd
    });
    const rules: SecretLintCoreDescriptorRule[] = rawResult.config.rules.map(configDescriptorRule => {
        const moduleFilePath = moduleResolver.resolveRulePackageName(configDescriptorRule.id);
        return {
            id: configDescriptorRule.id,
            rule: moduleInterop(require(moduleFilePath)),
            options: configDescriptorRule.options,
            disabled: configDescriptorRule.disabled
        };
    });
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
export const loadConfigRaw = (options: SecretLintConfigLoaderOptions): SecretLintConfigLoaderRawResult => {
    try {
        const results = rcFile<SecretLintConfigDescriptor>("secretlint", {
            cwd: options.cwd,
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
