import fs from "node:fs";
import path from "node:path";
import { walk } from "@secretlint/walker";
import { createConfig } from "@secretlint/config-creator";

export type runConfigCreatorOptions = {
    cwd: string;
};
export const runConfigCreator = async (
    options: runConfigCreatorOptions
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const existingConfigFiles = await walk({
        cwd: options.cwd,
        patterns: [".secretlintrc*"],
        ignoreFiles: [],
        extraIgnorePatterns: [],
        noGlob: false,
    });
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
