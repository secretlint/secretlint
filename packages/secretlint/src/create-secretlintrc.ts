import fs from "fs";
import path from "path";
import globby from "globby";
import readPkg from "read-pkg";
import { createConfig } from "@secretlint/config-creator";

export type runConfigCreatorOptions = {
    cwd: string;
};
export const runConfigCreator = async (
    options: runConfigCreatorOptions
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const existingConfigFiles = await globby(`${options.cwd}/.secretlintrc*`);
    if (existingConfigFiles.length > 0) {
        return {
            exitStatus: 1,
            stdout: null,
            stderr: new Error("secretlint config file is already existed."),
        };
    }
    const configFilePath = path.join(options.cwd, ".secretlintrc.json");
    const pkg = await readPkg({
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
