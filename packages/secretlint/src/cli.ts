import meow from "meow";
import { runSecretLint } from "./index";
import { runConfigCreator } from "./create-secretlintrc";

const debug = require("debug")("secretlint");
export const cli = meow(
    `
    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on microglob
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --init setup config file. Create .secretlintrc.json file from your package.json
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
            init: {
                type: "boolean"
            },
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
    if (flags.init) {
        return runConfigCreator({
            cwd
        });
    }
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
