import fs from "node:fs";
import { createEngine, SecretLintEngineOptions } from "@secretlint/node";
import { searchFiles } from "./search.js";

/**
 * Lint files
 */
export type SecretLintFileOptions = {
    cwd: string;
    filePathOrGlobList: string[];
    outputFilePath?: string;
    ignoreFilePath?: string;
};
/**
 * Lint text from stdin
 */
export type SecretLintStdinOptions = {
    cwd: string;
    stdinContent: string;
    stdinFileName: string;
    outputFilePath?: string;
    ignoreFilePath?: string;
};
export type SecretLintOptions = SecretLintFileOptions | SecretLintStdinOptions;
const lintFileOrText = async ({
    cliOptions,
    engineOptions,
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}): Promise<{ ok: boolean; output: string }> => {
    const engine = await createEngine(engineOptions);
    if ("filePathOrGlobList" in cliOptions) {
        const { ok, items } = await searchFiles(cliOptions.filePathOrGlobList, {
            cwd: cliOptions.cwd,
            ignoreFilePath: cliOptions.ignoreFilePath,
        });
        if (!ok) {
            throw new Error("Not found target files");
        }
        return engine.executeOnFiles({
            filePathList: items,
        });
    } else if ("stdinFileName" in cliOptions) {
        return engine.executeOnContent({
            content: cliOptions.stdinContent,
            filePath: cliOptions.stdinFileName,
        });
    }
    throw new Error("Unexpected cliOptions", {
        cause: {
            cliOptions: cliOptions satisfies never,
        },
    });
};
export const runSecretLint = async ({
    cliOptions,
    engineOptions,
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const { ok, output } = await lintFileOrText({
        cliOptions,
        engineOptions,
    });
    // TODO: if has error, this should be stderr
    const outputFilePath = cliOptions.outputFilePath;
    if (outputFilePath !== undefined) {
        fs.writeFileSync(outputFilePath, output, "utf-8");
        // Return empty to console with exit code 0
        // because output is success
        return {
            exitStatus: 0,
            stdout: null,
            stderr: null,
        };
    }
    return {
        exitStatus: ok ? 0 : 1,
        stdout: output,
        stderr: null,
    };
};
