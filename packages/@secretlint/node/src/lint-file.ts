import { lintSource } from "@secretlint/core";
import { loadConfig, loadPackagesFromConfigDescriptor } from "@secretlint/config-loader";
import { createRawSource } from "@secretlint/source-creator";
import type {
    SecretLintConfigDescriptor,
    SecretLintCoreConfig,
    SecretLintCoreResult,
    SecretLintRuleLocaleTag,
} from "@secretlint/types";

/**
 * Where to load the config from.
 * It is serializable, so a worker thread can load the same config.
 */
export type ConfigSource =
    | {
          type: "json";
          configFileJSON: SecretLintConfigDescriptor;
      }
    | {
          type: "file";
          cwd?: string;
          configFilePath?: string;
      };

/**
 * Options for `lintSource()` except the config.
 * It is serializable, so a worker thread can lint with the same options.
 */
export type LintFileOptions = {
    locale?: SecretLintRuleLocaleTag;
    maskSecrets?: boolean;
};

export const loadConfigFromSource = async (configSource: ConfigSource) => {
    if (configSource.type === "json") {
        const result = await loadPackagesFromConfigDescriptor({
            configDescriptor: configSource.configFileJSON,
        });
        // config JSON has no file path to report messages for
        return { ...result, configDescriptor: configSource.configFileJSON, configFilePath: undefined };
    }
    return loadConfig({
        cwd: configSource.cwd,
        configFilePath: configSource.configFilePath,
    });
};

export const lintFile = async ({
    filePath,
    config,
    options,
}: {
    filePath: string;
    config: SecretLintCoreConfig;
    options: LintFileOptions;
}): Promise<SecretLintCoreResult> => {
    const rawSource = await createRawSource(filePath);
    return lintSource({
        source: rawSource,
        options: {
            locale: options.locale,
            maskSecrets: options.maskSecrets,
            config: config,
        },
    });
};
