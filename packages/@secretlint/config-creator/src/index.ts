import { SecretLintConfigDescriptor } from "@secretlint/types";

/**
 * get package names from package.json
 */
const getSecretLintPackageNames = (packageJSON: any): string[] => {
    const dependencies = packageJSON.dependencies || {};
    const devDependencies = packageJSON.devDependencies || {};
    const mergedDependencies = {
        ...dependencies,
        ...devDependencies,
    };
    const pkgNames = Object.keys(mergedDependencies);
    return pkgNames.filter((pkgName) => {
        // secretlint-rule- or @scope/secretlint-rule
        return pkgName.startsWith("secretlint-rule-") || pkgName.includes("/secretlint-rule-");
    });
};

/**
 * create config descriptor from rule names
 */
export const createConfigDescriptor = ({ ruleNames }: { ruleNames: string[] }): SecretLintConfigDescriptor => {
    return {
        rules: ruleNames.map((name) => {
            return {
                id: name,
            };
        }),
    };
};

export type CreateConfigFileOption = {
    packageJSON: any;
};

/**
 * The recommended preset is built into @secretlint/core, so it is available without installing a package.
 */
const RECOMMENDED_PRESET_ID = "@secretlint/secretlint-rule-preset-recommend";

/**
 * Create Config Object from package.json
 * The config always has the recommended preset first, followed by the rule packages found in package.json.
 */
export const createConfig = (options: CreateConfigFileOption) => {
    const packageNames = getSecretLintPackageNames(options.packageJSON);
    const ruleNames = [RECOMMENDED_PRESET_ID, ...packageNames.filter((name) => name !== RECOMMENDED_PRESET_ID)];
    return createConfigDescriptor({ ruleNames: ruleNames });
};
