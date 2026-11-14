import fs from "node:fs";
import { createEngine, SecretLintConfigSource, SecretLintEngineOptions } from "@secretlint/node";
import { searchFiles } from "./search.js";
import { secretLintProfiler } from "@secretlint/profiler";

/**
 * Lint files
 */
export type SecretLintFileOptions = {
    cwd: string;
    filePathOrGlobList: string[];
    outputFilePath?: string;
    ignoreFilePath?: string;
    noGlob?: boolean;
    respectGitignore?: boolean;
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
}): Promise<{ ok: boolean; output: string; configSource: SecretLintConfigSource }> => {
    const engine = await createEngine(engineOptions);
    const configSource = engine.configSource;
    if ("filePathOrGlobList" in cliOptions) {
        secretLintProfiler.mark({ type: "secretlint>search-files::start" });
        const { ok, items } = await searchFiles(cliOptions.filePathOrGlobList, {
            cwd: cliOptions.cwd,
            ignoreFilePath: cliOptions.ignoreFilePath,
            noGlob: cliOptions.noGlob,
            respectGitignore: cliOptions.respectGitignore,
        });
        secretLintProfiler.mark({ type: "secretlint>search-files::end" });
        if (!ok) {
            throw new Error("Not found target files");
        }
        const result = await engine.executeOnFiles({
            filePathList: items,
        });
        return { ...result, configSource };
    } else if ("stdinFileName" in cliOptions) {
        const result = await engine.executeOnContent({
            content: cliOptions.stdinContent,
            filePath: cliOptions.stdinFileName,
        });
        return { ...result, configSource };
    }
    throw new Error("Unexpected cliOptions", {
        cause: {
            cliOptions: cliOptions satisfies never,
        },
    });
};
/**
 * The result of a run of the CLI
 * `notices` are messages for the user that are not lint results, such as the use of the default config.
 * The CLI writes them to stderr, so stdout has only the results.
 */
export type SecretLintRunResult = {
    exitStatus: number;
    stdout: string | null;
    stderr: Error | null;
    notices?: string[];
};
/**
 * The notice when no config is found and the recommend preset is used
 */
export const DEFAULT_CONFIG_NOTICE =
    "secretlint: No configuration file was found. The recommended rules (@secretlint/secretlint-rule-preset-recommend) are used. Run `secretlint --init` to create .secretlintrc.json.";
export const runSecretLint = async ({
    cliOptions,
    engineOptions,
}: {
    cliOptions: SecretLintOptions;
    engineOptions: SecretLintEngineOptions;
}): Promise<SecretLintRunResult> => {
    const { ok, output, configSource } = await lintFileOrText({
        cliOptions,
        engineOptions,
    });
    // `notices` is set only when there is a notice
    const notices = configSource === "default" ? { notices: [DEFAULT_CONFIG_NOTICE] } : {};
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
            ...notices,
        };
    }
    return {
        exitStatus: ok ? 0 : 1,
        stdout: output,
        stderr: null,
        ...notices,
    };
};
