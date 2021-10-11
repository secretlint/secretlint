import { rcFile } from "rc-config-loader";
import {
    SecretLintConfigDescriptor,
    SecretLintCoreDescriptor,
    SecretLintCoreDescriptorRule,
    SecretLintCoreDescriptorUnionRule,
    SecretLintUnionRuleCreator,
    SecretLintRuleModule,
} from "@secretlint/types";
import { secretLintProfiler } from "@secretlint/profiler";
import { SecretLintModuleResolver } from "./SecretLintModuleResolver";
import { validateConfig, validateRawConfig } from "@secretlint/config-validator";
import * as url from "url";

export function importSecretlintCreator(moduleExports?: SecretLintRuleModule): SecretLintUnionRuleCreator {
    if (!moduleExports) {
        throw new Error("Secretlint rule should export { creator }. module is undefined");
    }
    if (!("creator" in moduleExports)) {
        throw new Error("Secretlint rule should export { creator }. module does not export creator object.");
    }
    return moduleExports.creator;
}

export class AggregateError extends Error {
    errors: Error[];

    constructor(errors: Error[], message: string) {
        const detailsMessage = errors.map((error) => error.message).join("\n\n");
        super(message + "\n\n" + detailsMessage);
        this.errors = errors;
    }
}

// FIXME: https://github.com/microsoft/TypeScript/issues/43329
// module: node12 will be replace it
const _importDynamic = new Function("modulePath", "return import(modulePath)");
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
    config: SecretLintCoreDescriptor; // Core Option object
    configFilePath: string;
};

export type SecretLintConfigLoaderRawResult = {
    ok: true;
    configFilePath: string;
    rawConfig: SecretLintConfigDescriptor; // Config Raw object
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
export type SecretLintLoadPackagesFromRawConfigResult = {
    ok: true;
    config: SecretLintCoreDescriptor; // Core Option object
};

/**
 * Load packages in RawConfig and return loaded config object
 * @param options
 */
export const loadPackagesFromRawConfig = async (
    options: SecretLintLoadPackagesFromRawConfigOptions
): Promise<SecretLintLoadPackagesFromRawConfigResult> => {
    // Early validation, validate rawConfig by JSON Schema
    const resultValidateRawConfig = validateRawConfig(options.rawConfig);
    if (!resultValidateRawConfig.ok) {
        throw resultValidateRawConfig.error;
    }
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::start",
    });
    // Search secretlint's module
    const moduleResolver = new SecretLintModuleResolver({
        baseDirectory: options.node_moduleDir,
    });
    const errors: Error[] = [];
    const rules: SecretLintCoreDescriptorUnionRule[] = [];
    for (const configDescriptorRule of options.rawConfig.rules) {
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
            const ruleModule: any = replacedDefinition
                ? replacedDefinition.rule
                : // Windows's path require to convert file://
                  // https://github.com/secretlint/secretlint/issues/205
                  importSecretlintCreator(
                      await _importDynamic(
                          url.pathToFileURL(moduleResolver.resolveRulePackageName(configDescriptorRule.id)).href
                      )
                  );
            const secretLintConfigDescriptorRules: SecretLintCoreDescriptorRule[] | undefined =
                "rules" in configDescriptorRule && Array.isArray(configDescriptorRule.rules)
                    ? (configDescriptorRule.rules.filter(
                          (rule) => rule !== undefined
                      ) as SecretLintCoreDescriptorRule[])
                    : undefined;
            rules.push({
                id: configDescriptorRule.id,
                rule: ruleModule,
                rules: secretLintConfigDescriptorRules,
                options: configDescriptorRule.options,
                severity: "severity" in configDescriptorRule ? configDescriptorRule.severity : undefined,
                disabled: configDescriptorRule.disabled,
                allowMessageIds:
                    "allowMessageIds" in configDescriptorRule ? configDescriptorRule.allowMessageIds : undefined,
            });
            secretLintProfiler.mark({
                type: "@config-loader>resolve-module::end",
                id: configDescriptorRule.id,
            });
        } catch (error) {
            errors.push(error instanceof Error ? error : new Error(String(error)));
        }
    }
    secretLintProfiler.mark({
        type: "@config-loader>resolve-modules::end",
    });
    if (errors.length > 0) {
        throw new AggregateError(errors, "secretlint loading errors");
    }
    const loadedConfig: SecretLintCoreDescriptor = {
        sharedOptions: options.rawConfig.sharedOptions,
        rules,
    };
    // Finally, validate loadedConfig with validator
    // This validator require actual `rule` creator for `disabledMessage` option.
    const resultValidateConfig = validateConfig(loadedConfig);
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
    const rawResult = await loadRawConfig(options);
    secretLintProfiler.mark({
        type: "@config-loader>load-config-file::end",
    });
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::start",
    });
    const result = await loadPackagesFromRawConfig({
        rawConfig: rawResult.rawConfig,
        node_moduleDir: options.node_moduleDir,
        testReplaceDefinitions: options.testReplaceDefinitions,
    });
    secretLintProfiler.mark({
        type: "@config-loader>load-packages::end",
    });
    return {
        ok: true,
        config: result.config,
        configFilePath: rawResult.configFilePath,
    };
};
/**
 *  Load config file and return config object that is not loaded rule instance
 *  It is just JSON present for config file. Raw data
 * @param options
 */
export const loadRawConfig = async (
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
                
Secrelint require .secretlintrc config file.
The config file define the use of rules.`);
    }
    return {
        ok: true,
        rawConfig: results.config,
        configFilePath: results.filePath,
    };
};
