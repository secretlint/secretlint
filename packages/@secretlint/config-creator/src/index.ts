import { canaryRules, recommendedRules } from "@secretlint/core/builtin";
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

const RECOMMENDED_PRESET_ID = "@secretlint/secretlint-rule-preset-recommend";
const CANARY_PRESET_ID = "@secretlint/secretlint-rule-preset-canary";

/**
 * Create Config Object from package.json
 *
 * The presets are built into @secretlint/core, so the config always has a preset first:
 * the canary preset when package.json has it, otherwise the recommended preset.
 * The rule packages found in package.json follow it, except the presets and the rules that the preset already has.
 * A rule registered twice is an error of the lint, so the config must not list a rule of the preset again.
 */
export const createConfig = (options: CreateConfigFileOption) => {
    const packageNames = getSecretLintPackageNames(options.packageJSON);
    const useCanary = packageNames.includes(CANARY_PRESET_ID);
    const presetId = useCanary ? CANARY_PRESET_ID : RECOMMENDED_PRESET_ID;
    const presetRuleIds = new Set((useCanary ? canaryRules : recommendedRules).map((rule) => rule.meta.id));
    const ruleNames = [
        presetId,
        ...packageNames.filter((name) => {
            return name !== RECOMMENDED_PRESET_ID && name !== CANARY_PRESET_ID && !presetRuleIds.has(name);
        }),
    ];
    return createConfigDescriptor({ ruleNames: ruleNames });
};
