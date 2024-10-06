// LICENSE : MIT
import * as path from "node:path";
import { createFullPackageName } from "./package-name-util.js";
import debug0 from "debug";

const debug = debug0("@secretlint/config-loader");
import { tryResolve } from "@secretlint/resolver";

/**
 * Try to resolve module or file path.
 * @param modulePath
 */
const tryResolveModulePath = (modulePath: string): string | undefined => {
    return tryResolve(modulePath, {
        parentImportMeta: import.meta,
        parentModule: "config-loader",
    });
};

/**
 * This class aim to resolve secretlint's package name and get the module path.
 *
 * Define
 *
 * - `package` is npm package
 * - `module` is package's main module
 *
 * ## Support
 *
 * - secretlint-rule-*
 * - secretlint-preset-*
 * - secretlint-plugin-*
 * - secretlint-config-*
 */
export class SecretLintModuleResolver {
    private baseDirectory: string;

    constructor(config: { baseDirectory?: string }) {
        /**
         * @type {string} baseDirectory for resolving
         */
        this.baseDirectory = config && config.baseDirectory ? config.baseDirectory : "";
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolveRulePackageName(packageName: string): string {
        const baseDir = this.baseDirectory;
        const fullPackageName = createFullPackageName("secretlint-rule-", packageName);
        // <rule-name> or secretlint-rule-<rule-name>
        const pkgPath =
            tryResolveModulePath(path.join(baseDir, fullPackageName)) ||
            tryResolveModulePath(path.join(baseDir, packageName));
        if (!pkgPath) {
            debug(`rule fullPackageName: ${fullPackageName}`);
            throw new ReferenceError(`Failed to load secretlint's rule module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}
`);
        }
        return pkgPath;
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolveFilterRulePackageName(packageName: string): string {
        const baseDir = this.baseDirectory;
        const fullPackageName = createFullPackageName("secretlint-filter-rule-", packageName);
        // <rule-name> or secretlint-filter-rule-<rule-name> or @scope/<rule-name>
        const pkgPath =
            tryResolveModulePath(path.join(baseDir, fullPackageName)) ||
            tryResolveModulePath(path.join(baseDir, packageName));
        if (!pkgPath) {
            debug(`filter rule fullPackageName: ${fullPackageName}`);
            throw new ReferenceError(`Failed to load secretlint's filter rule module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}
`);
        }
        return pkgPath;
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolvePluginPackageName(packageName: string): string {
        const baseDir = this.baseDirectory;
        const fullPackageName = createFullPackageName("secretlint-plugin-", packageName);
        // <plugin-name> or secretlint-plugin-<rule-name>
        const pkgPath =
            tryResolveModulePath(path.join(baseDir, fullPackageName)) ||
            tryResolveModulePath(path.join(baseDir, packageName));
        if (!pkgPath) {
            debug(`plugin fullPackageName: ${fullPackageName}`);
            throw new ReferenceError(`Failed to load secretlint's plugin module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}

`);
        }
        return pkgPath;
    }

    /**
     * Take package name, and return path to module.
     * @param {string} packageName
     * The user must specify preset- prefix to these `packageName`.
     * @returns {string} return path to module
     */
    resolvePresetPackageName(packageName: string): string {
        const baseDir = this.baseDirectory;
        const PREFIX = "secretlint-rule-preset-";
        /* Implementation Note

        preset name is defined in config file:
        In the case, `packageName` is "preset-gizmo"
        secretlintModuleResolver resolve "preset-gizmo" to "secretlint-rule-preset-gizmo"
        {
            "rules": {
                "preset-gizmo": {
                    "ruleA": false
                }
            }
        }
         */
        // preset-<name> or secretlint-rule-preset-<name>
        // @scope/preset-<name> or @scope/secretlint-rule-preset-<name>
        const packageNameWithoutPreset = packageName
            .replace(/^preset-/, "")
            .replace(/^@([^/]+)\/preset-(.*)$/, `@$1/$2`);
        const fullPackageName = createFullPackageName(PREFIX, packageNameWithoutPreset);
        const fullFullPackageName = `${PREFIX}${packageNameWithoutPreset}`;
        const pkgPath =
            // secretlint-rule-preset-<preset-name> or @scope/secretlint-rule-preset-<preset-name>
            tryResolveModulePath(path.join(baseDir, fullFullPackageName)) ||
            // <preset-name>
            tryResolveModulePath(path.join(baseDir, packageNameWithoutPreset)) ||
            // <rule-name>
            tryResolveModulePath(path.join(baseDir, fullPackageName)) ||
            // <package-name>
            tryResolveModulePath(path.join(baseDir, packageName));
        if (!pkgPath) {
            debug(`preset fullPackageName: ${fullPackageName}`);
            debug(`preset fullFullPackageName: ${fullFullPackageName}`);
            throw new ReferenceError(`Failed to load secretlint's preset module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}
`);
        }
        return pkgPath;
    }

    /**
     * Take Config package name, and return path to module.
     * @param {string} packageName
     * @returns {string} return path to module
     */
    resolveConfigPackageName(packageName: string): string {
        const baseDir = this.baseDirectory;
        const fullPackageName = createFullPackageName("secretlint-config-", packageName);
        // <plugin-name> or secretlint-config-<rule-name>
        const pkgPath =
            tryResolveModulePath(path.join(baseDir, fullPackageName)) ||
            tryResolveModulePath(path.join(baseDir, packageName));
        if (!pkgPath) {
            throw new ReferenceError(`Failed to load secretlint's config module: "${packageName}" is not found.

cwd: ${process.cwd()}
baseDir: ${baseDir}
`);
        }
        return pkgPath;
    }
}
