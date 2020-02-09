import fs from "fs";
import utils from "util";
import { lintSource } from "@secretlint/core";
import { loadConfig } from "@secretlint/config-loader";
import { createFormatter } from "@secretlint/formatter";
import { SecretLintCoreDescriptor } from "@secretlint/types";

const readFile = utils.promisify(fs.readFile);
export type SecretLintEngineOptions = {
    cwd?: string;
    color?: boolean;
    formatter: string;
};

export const lintFile = async (filePath: string, options: SecretLintCoreDescriptor) => {
    return readFile(filePath, "utf-8").then(content => {
        return lintSource(
            {
                filePath: filePath,
                content: content
            },
            options
        );
    });
};

export const createLinter = async (options: SecretLintEngineOptions) => {
    const config = loadConfig({
        cwd: options.cwd
    });
    if (!config.ok) {
        throw new Error(config.errors.map(error => error.stack).join("\n\n"));
    }
    return async (filePathList: string[]) => {
        const resultPromises = filePathList.map(filePath => {
            return lintFile(filePath, config.config);
        });
        const results = await Promise.all(resultPromises);
        const formatter = createFormatter({
            color: options.color,
            formatterName: options.formatter
        });
        return formatter.format(results);
    };
};
