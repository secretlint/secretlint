import fs from "fs";
import { createEngine, SecretLintEngineOptions } from "@secretlint/node";
import { searchFiles } from "./search";

export type SecretLintOptions = {
    cwd: string;
    filePathOrGlobList: string[];
    outputFilePath?: string;
    ignoreFilePath?: string;
};
export const runSecretLint = async ({
    cliOptions,
    engineOptions
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}) => {
    const filePathList = await searchFiles(cliOptions.filePathOrGlobList, {
        cwd: cliOptions.cwd,
        ignoreFilePath: cliOptions.ignoreFilePath
    });
    if (filePathList.length === 0) {
        throw new Error("Not found target files");
    }
    const engine = await createEngine(engineOptions);
    return engine
        .executeOnFiles({
            filePathList
        })
        .then(output => {
            // TODO: if has error, this should be stderr
            const outputFilePath = cliOptions.outputFilePath;
            if (outputFilePath !== undefined) {
                fs.writeFileSync(outputFilePath, output, "utf-8");
                return ""; // Return empty to console
            }
            return output;
        });
};
