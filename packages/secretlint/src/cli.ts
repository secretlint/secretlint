import meow from "meow";
import { runSecretLint } from "./index";

const debug = require("debug")("secretlint");
export const cli = meow(
    `
    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on microglob
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --format formatter name. Default: stylish
      --output-file output file path that is written of reported result.
      --no-color disable color of output.
      --secretlintrc Path to .secretlintrc config file.
      --secretlintignore Path to .secretlintignore file. Default: .secretlintignore
 
    Examples
      $ secretlint "**/*"
      $ secretlint "source/**/*.ini"
`,
    {
        flags: {
            format: {
                type: "string",
                default: "stylish"
            },
            "output-file": {
                type: "string"
            },
            secretlintrc: {
                type: "string"
            },
            secretlintignore: {
                type: "string",
                default: ".secretlintignore"
            },
            color: {
                type: "boolean",
                default: true
            },
            // DEBUG option
            cwd: {
                type: "string",
                default: process.cwd()
            }
        },
        autoHelp: true,
        autoVersion: true
    }
);

export const run = (
    input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    const cwd = flags.cwd;
    debug("input: %O", input);
    debug("flags: %O", flags);
    return runSecretLint({
        cliOptions: {
            cwd,
            filePathOrGlobList: input,
            outputFilePath: flags["output-file"],
            ignoreFilePath: flags.secretlintignore
        },
        engineOptions: {
            cwd: cwd,
            configFilePath: flags.secretlintrc,
            formatter: flags.format,
            color: flags.color
        }
    });
};
