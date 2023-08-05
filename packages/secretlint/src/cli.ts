import meow from "meow";
import { runSecretLint } from "./index.js";
import { runConfigCreator } from "./create-secretlintrc.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { getFormatterList } from "@secretlint/formatter";
import debug0 from "debug";

const debug = debug0("secretlint");
export const cli = meow(
    `
    Usage
      $ secretlint [file|glob*]
 
    Note
      supported glob syntax is based on microglob
      https://github.com/micromatch/micromatch#matching-features
 
    Options
      --init             setup config file. Create .secretlintrc.json file from your package.json
      --format           [String] formatter name. Default: "stylish". Available Formatter: ${getFormatterList()
          .map((item) => item.name)
          .join(", ")}
      --output           [path:String] output file path that is written of reported result.
      --no-color         disable ANSI-color of output.
      --no-terminalLink  disable terminalLink of output.
      --maskSecrets      enable masking of secret values. replace actual secrets with "***".
      --secretlintrc     [path:String] path to .secretlintrc config file. Default: .secretlintrc.*
      --secretlintignore [path:String] path to .secretlintignore file. Default: .secretlintignore

    Options for Developer
      --profile          Enable performance profile. 
      --secretlintrcJSON [String] a JSON string of .secretlintrc. use JSON string instead of rc file.

    Experimental Options
      --locale            [String] locale tag for translating message. Default: en
 
    Examples
      $ secretlint ./README.md
      # glob pattern should be wrapped with double quote
      $ secretlint "**/*"
      $ secretlint "source/**/*.ini"
      # found secrets and mask the secrets
      $ secretlint .zsh_history --format=mask-result --output=.zsh_history
      
    Exit Status
      Secretlint exits with the following values:
    
      - 0: 
        - Linting succeeded, no errors found. 
        - Found lint error but --output is specified.
      - 1: 
        - Linting failed, errors found.
      - 2: 
        - Unexpected error occurred, fatal error.
`,
    {
        flags: {
            init: {
                type: "boolean",
            },
            format: {
                type: "string",
                default: "stylish",
            },
            output: {
                type: "string",
            },
            secretlintrc: {
                type: "string",
            },
            secretlintrcJSON: {
                type: "string",
            },
            secretlintignore: {
                type: "string",
                default: ".secretlintignore",
            },
            /**
             * CLI enable ANSI-color of output by default
             */
            color: {
                type: "boolean",
                default: true,
            },
            /**
             * CLI enable terminalLink by default.
             * Some formatter will output that includes clickable clink
             * https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
             */
            terminalLink: {
                type: "boolean",
                default: true,
            },
            maskSecrets: {
                type: "boolean",
                default: false,
            },
            profile: {
                type: "boolean",
            },
            locale: {
                type: "string",
            },
            // DEBUG option
            cwd: {
                type: "string",
                default: process.cwd(),
            },
            debug: {
                type: "boolean",
                default: false,
            },
        },
        autoHelp: true,
        autoVersion: true,
        importMeta: import.meta,
    }
);

export const run = async (
    input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    secretLintProfiler.mark({
        type: "secretlint>cli::start",
    });
    if (flags.debug) {
        const debug = await import("debug");
        debug.default?.enable?.("*secretlint*");
    }
    const cwd = flags.cwd;
    debug("input: %O", input);
    debug("flags: %O", flags);
    if (flags.init) {
        return runConfigCreator({
            cwd,
        });
    }
    return runSecretLint({
        cliOptions: {
            cwd,
            filePathOrGlobList: input,
            outputFilePath: flags.output,
            ignoreFilePath: flags.secretlintignore,
        },
        engineOptions: flags.secretlintrcJSON
            ? {
                  // Parse config string as JSON
                  configFileJSON: JSON.parse(flags.secretlintrcJSON),
                  cwd: cwd,
                  formatter: flags.format,
                  color: flags.color,
                  terminalLink: flags.terminalLink,
                  locale: flags.locale,
                  maskSecrets: flags.maskSecrets,
              }
            : {
                  configFilePath: flags.secretlintrc,
                  cwd: cwd,
                  formatter: flags.format,
                  color: flags.color,
                  terminalLink: flags.terminalLink,
                  locale: flags.locale,
                  maskSecrets: flags.maskSecrets,
              },
    }).finally(async () => {
        secretLintProfiler.mark({
            type: "secretlint>cli::end",
        });
        if (flags.profile) {
            const measures = await secretLintProfiler.getMeasures();
            const cwd = flags.cwd;
            if (flags.format === "json") {
                console.log(JSON.stringify(measures, null, 4));
            } else {
                measures.forEach((entry) => {
                    const takenMs = entry.duration;
                    const takenRoundMs = Math.round((takenMs + Number.EPSILON) * 100) / 100;
                    console.log(`${entry.name.replace(cwd, "<cwd>")} - ${takenRoundMs}ms`);
                });
            }
        }
    });
};
