import { createEngine, SecretLintEngineOptions } from "@secretlint/node";
import globby from "globby";

export type SecretLintOptions = {
    filePathOrGlobList: string[];
};
export const runSecretLint = async ({
    cliOptions,
    engineOptions
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}) => {
    const filePathList = await globby(cliOptions.filePathOrGlobList);
    if (filePathList.length === 0) {
        throw new Error("Not found target files");
    }
    const engine = await createEngine(engineOptions);
    return engine.executeOnFiles({
        filePathList
    });
};
