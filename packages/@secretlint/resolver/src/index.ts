import { createRequire } from "node:module";
import * as url from "node:url";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
export type ResolverContext = {
    parentImportMeta: ImportMeta;
    parentModule: "config-loader" | "formatter";
    /**
     * Directories to resolve `packageName` from.
     * Secretlint's rules, presets and formatters are dependencies of the user's project,
     * so they have to be resolved from the project instead of from the location that
     * `@secretlint/resolver` itself is installed in.
     * Default: `[process.cwd()]`
     */
    baseDirectories?: string[];
};
type ResolverSkipResult = undefined;
/**
 * Resolve Hook
 */
export type ResolveHook = (
    specifier: string,
    context: ResolverContext
) =>
    | {
          url: string | undefined;
      }
    | ResolverSkipResult;
/**
 * dynamic import() hook
 */
export type ImportHook = (
    specifier: string,
    context: ResolverContext
) => Promise<
    | {
          exports: Record<string, unknown>;
      }
    | ResolverSkipResult
>;

const resolveHooks: ResolveHook[] = [];
const importHooks: ImportHook[] = [];
/**
 * Register Resolver Hook
 * Hook can return resolved URL
 * if hooks pass through, it should return `undefined` instead of object
 * @param hook
 */
export const registerResolveHook = (hook: ResolveHook) => {
    resolveHooks.push(hook);
};

/**
 * Try to resolve package name
 * if `packageName` is found, return resolved absolute path.
 * if `packageName` is not found, return `undefined`
 * @param packageName
 * @param context
 */
export const tryResolve = (packageName: string, context: ResolverContext): string | undefined => {
    try {
        for (const hook of resolveHooks) {
            const result = hook(packageName, context);
            // Skip if hook return undefined from hook
            if (!result) {
                continue;
            }
            if (result?.url) {
                return result.url;
            }
        }

        // Resolve from the user's project first.
        // Node.js looks up `node_modules` by walking up from the importer, so `require` -
        // which is created from this module's own url - only finds the project's packages
        // when this module happens to be installed inside the project. That is not the case
        // when the package manager stores packages outside of the project, as pnpm does with
        // `enableGlobalVirtualStore: true`.
        // https://github.com/secretlint/secretlint/issues/1624
        const baseDirectories = context.baseDirectories ?? [process.cwd()];
        if (baseDirectories.length > 0) {
            try {
                return require.resolve(packageName, { paths: baseDirectories });
            } catch {
                // Fallback to resolving from this module's own location
            }
        }
        // TODO: import.meta.resolve is not supported in Node.js 18
        // We will change to import.meta.resolve(packageName)
        return require.resolve(packageName);
    } catch {
        return undefined;
    }
};

/**
 * Register Import Hook
 * @param hook
 */
export const registerImportHook = (hook: ImportHook) => {
    importHooks.push(hook);
};

// Windows's path require to convert file://
// https://github.com/secretlint/secretlint/issues/205
const convertToFileUrl = (filePath: string) => {
    if (filePath.startsWith("file://")) {
        return filePath;
    }
    return url.pathToFileURL(filePath).href;
};
/**
 * dynamic import() with hooks
 * @param specifier file path or package name
 * @param context
 */
export const dynamicImport = async (
    specifier: string,
    context: ResolverContext
): Promise<{
    exports: Record<string, unknown> | undefined;
}> => {
    for (const hook of importHooks) {
        const result = await hook(specifier, context);
        if (result) {
            return result;
        }
    }
    // if the `specifier` is not absolute path, it should be package name
    if (!path.isAbsolute(specifier)) {
        return {
            exports: await import(specifier),
        };
    }
    return {
        exports: await import(convertToFileUrl(specifier)),
    };
};

/**
 * Clear all hooks
 */
export const clearHooks = () => {
    resolveHooks.length = 0;
    importHooks.length = 0;
};

/**
 * get package.json content from startDir
 * @param cwd
 * @returns package.json content
 */
export const getPackageJson = (cwd: string) => {
    try {
        const startDir = path.dirname(url.fileURLToPath(cwd));
        const packageJsonPath = findPackageJson(startDir);
        if (packageJsonPath) {
            return require(packageJsonPath);
        }
        return undefined;
    } catch (error) {
        // ignore error
        return undefined;
    }
};

/**
 * search package.json from startDir
 * @param startDir
 * @returns
 */
const findPackageJson = (startDir: string): string => {
    let currentDir = startDir;
    while (true) {
        const packageJsonPath = path.join(currentDir, "package.json");
        if (fs.existsSync(packageJsonPath)) {
            return packageJsonPath;
        }

        const parentDir = path.resolve(currentDir, "..");
        if (parentDir === currentDir) {
            return "";
        }

        currentDir = parentDir;
    }
};
