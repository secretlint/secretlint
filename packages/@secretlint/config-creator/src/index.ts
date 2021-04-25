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
 * Create Config Object from package.json
 */
export const createConfig = (options: CreateConfigFileOption) => {
    const ruleNames = getSecretLintPackageNames(options.packageJSON);
    return createConfigDescriptor({ ruleNames: ruleNames });
};
