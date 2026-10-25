import fs from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createConfig } from "@secretlint/config-creator";

const SCHEMA_PATH_IN_NODE_MODULES = "node_modules/secretlint/configuration_schema.json";
/**
 * Editors resolve `$schema` relative to the config file, not via Node's module resolution.
 * Find the nearest installed schema from cwd so that a workspace root install also works.
 */
const findSchemaRelativePath = (cwd: string): string => {
    let dir = path.resolve(cwd);
    while (true) {
        if (fs.existsSync(path.join(dir, SCHEMA_PATH_IN_NODE_MODULES))) {
            const relativePath = path
                .relative(path.resolve(cwd), path.join(dir, SCHEMA_PATH_IN_NODE_MODULES))
                .split(path.sep)
                .join("/");
            return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
        }
        const parentDir = path.dirname(dir);
        if (parentDir === dir) {
            // not installed yet: point to the default location
            return `./${SCHEMA_PATH_IN_NODE_MODULES}`;
        }
        dir = parentDir;
    }
};

export type runConfigCreatorOptions = {
    cwd: string;
};
export const runConfigCreator = async (
    options: runConfigCreatorOptions,
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    // Match top-level entries only; the previous `globby('.secretlintrc*', { cwd })`
    // was non-recursive, so `secretlint --init` shouldn't fail just because a nested
    // package below cwd already has its own config.
    const entries = await readdir(options.cwd);
    const existingConfigFiles = entries.filter((name) => name.startsWith(".secretlintrc"));
    if (existingConfigFiles.length > 0) {
        return {
            exitStatus: 1,
            stdout: null,
            stderr: new Error("secretlint config file is already existed."),
        };
    }
    const configFilePath = path.join(options.cwd, ".secretlintrc.json");
    const { readPackage } = await import("read-pkg");
    const pkg = await readPackage({
        cwd: options.cwd,
    });
    const configDescriptor = createConfig({ packageJSON: pkg });
    const config = {
        $schema: findSchemaRelativePath(options.cwd),
        ...configDescriptor,
    };
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    return {
        exitStatus: 0,
        stdout: `Create ${configFilePath}`,
        stderr: null,
    };
};
