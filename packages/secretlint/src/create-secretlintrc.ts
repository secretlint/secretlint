import fs from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { createConfig } from "@secretlint/config-creator";

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
    fs.writeFileSync(configFilePath, JSON.stringify(configDescriptor, null, 2) + "\n", "utf-8");
    return {
        exitStatus: 0,
        stdout: `Create ${configFilePath}`,
        stderr: null,
    };
};
