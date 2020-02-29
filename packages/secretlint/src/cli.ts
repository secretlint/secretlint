import meow from "meow";
import { runSecretLint } from "./index";
import { runConfigCreator } from "./create-secretlintrc";
import { secretLintProfiler } from "@secretlint/profiler";
import { getFormatterList } from "@secretlint/formatter";

const debug = require("debug")("secretlint");
export const cli = meow(
    `
    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on microglob
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --init             setup config file. Create .secretlintrc.json file from your package.json
      --format           formatter name. Default: "stylish". Available Formatter: ${getFormatterList()
          .map(item => item.name)
          .join(", ")}
      --output-file      output file path that is written of reported result.
      --no-color         disable ANSI-color of output.
      --no-terminalLink  disable terminalLink of output.
      --secretlintrc     path to .secretlintrc config file. Default: .secretlintrc.*
      --secretlintignore path to .secretlintignore file. Default: .secretlintignore
      --profile          show performance profile 
 
    Examples
      $ secretlint ./README.md
      # glob pattern should be wrapped with double quote
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
            /**
             * CLI enable ANSI-color of output by default
             */
            color: {
                type: "boolean",
                default: true
            },
            /**
             * CLI enable terminalLink by default.
             * Some formatter will output that includes clickable clink
             * https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
             */
            terminalLink: {
                type: "boolean",
                default: true
            },
            profile: {
                type: "boolean"
            },
            // DEBUG option
            cwd: {
                type: "string",
                default: process.cwd()
            },
            debug: {
                type: "boolean",
                default: false
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
    secretLintProfiler.mark({
        type: "secretlint>cli::start"
    });
    if (flags.debug) {
        const debug = require("debug");
        debug.enable("*secretlint*");
    }
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
            color: flags.color,
            terminalLink: flags.terminalLink
        }
    }).finally(async () => {
        secretLintProfiler.mark({
            type: "secretlint>cli::end"
        });
        if (flags.profile) {
            const measures = await secretLintProfiler.getMeasures();
            const cwd = flags.cwd;
            if (flags.format === "json") {
                console.log(JSON.stringify(measures, null, 4));
            } else {
                measures.forEach(entry => {
                    const takenMs = entry.duration;
                    const takenRoundMs = Math.round((takenMs + Number.EPSILON) * 100) / 100;
                    console.log(`${entry.name.replace(cwd, "<cwd>")} - ${takenRoundMs}ms`);
                });
            }
        }
    });
};
