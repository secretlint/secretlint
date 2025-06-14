import { parseArgs } from "node:util";
import { runSecretLint, SecretLintOptions } from "./index.js";
import { runConfigCreator } from "./create-secretlintrc.js";
import { secretLintProfiler } from "@secretlint/profiler";
import { getFormatterList } from "@secretlint/formatter";
import { getPackageJson } from "@secretlint/resolver";
import debug0 from "debug";
import { text } from "node:stream/consumers";

const debug = debug0("secretlint");

const helpMessage = `
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
  --no-maskSecrets   disable masking of secret values; secrets are masked by default.
  --secretlintrc     [path:String] path to .secretlintrc config file. Default: .secretlintrc.*
  --secretlintignore [path:String] path to .secretlintignore file. Default: .secretlintignore
  --stdinFileName    [String] filename to process STDIN content. Some rules depend on filename to check content.

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
  # output masked result to file
  $ secretlint .zsh_history --format=mask-result --output=.zsh_history
  # lint STDIN content instead of file
  $ echo "SECRET CONTENT" | secretlint --stdinFileName=secret.txt
  
Exit Status
  Secretlint exits with the following values:

  - 0: 
    - Linting succeeded, no errors found. 
    - Found lint error but --output is specified.
  - 1: 
    - Linting failed, errors found.
  - 2: 
    - Unexpected error occurred, fatal error.
`;
const OPTION_TYPE_STRING = "string" as const;
const OPTION_TYPE_BOOLEAN = "boolean" as const;
const options = {
    init: {
        type: OPTION_TYPE_BOOLEAN,
    },
    format: {
        type: OPTION_TYPE_STRING,
        default: "stylish",
    },
    output: {
        type: OPTION_TYPE_STRING,
    },
    /**
     * enable maskSecrets by default since secretlint v10+.
     * If you want to disable masking of secret values, use --no-maskSecrets option.
     */
    maskSecrets: {
        type: OPTION_TYPE_BOOLEAN,
        default: true,
    },
    secretlintrc: {
        type: OPTION_TYPE_STRING,
    },
    secretlintignore: {
        type: OPTION_TYPE_STRING,
        default: ".secretlintignore",
    },
    stdinFileName: {
        type: OPTION_TYPE_STRING,
    },
    profile: {
        type: OPTION_TYPE_BOOLEAN,
    },
    secretlintrcJSON: {
        type: OPTION_TYPE_STRING,
    },
    locale: {
        type: OPTION_TYPE_STRING,
    },
    /**
     * CLI enable ANSI-color of output by default
     */
    color: {
        type: OPTION_TYPE_BOOLEAN,
        default: true,
    },
    /**
     * CLI enable terminalLink by default.
     * Some formatter will output that includes clickable clink
     * https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
     */
    terminalLink: {
        type: OPTION_TYPE_BOOLEAN,
        default: true,
    },
    // DEBUG option
    cwd: {
        type: OPTION_TYPE_STRING,
        default: process.cwd(),
    },
    debug: {
        type: OPTION_TYPE_BOOLEAN,
        default: false,
    },
    help: { type: OPTION_TYPE_BOOLEAN, default: false },
    version: { type: OPTION_TYPE_BOOLEAN, default: false },
    "no-config": {
        type: OPTION_TYPE_BOOLEAN,
        default: false,
    },
    "no-package": {
        type: OPTION_TYPE_BOOLEAN,
        default: false,
    },
    $schema: {
        type: OPTION_TYPE_BOOLEAN,
        default: false,
    },
    extension: {
        type: OPTION_TYPE_STRING,
    },
    reporter: {
        type: OPTION_TYPE_STRING,
    },
    slow: {
        type: OPTION_TYPE_STRING,
    },
    timeout: {
        type: OPTION_TYPE_STRING,
    },
    ui: {
        type: OPTION_TYPE_STRING,
    },
    "watch-ignore": {
        type: OPTION_TYPE_STRING,
    },
    diff: {
        type: OPTION_TYPE_BOOLEAN,
        default: false,
    },
};
const { values, positionals } = parseArgs({ options, allowPositionals: true, allowNegative: true });
export const cli = {
    input: positionals,
    flags: values,
};

const getStdin = async () => {
    return await text(process.stdin);
};
const readCliOptions = async ({ input = cli.input, flags = cli.flags }): Promise<SecretLintOptions> => {
    // if specify stdinFileName, read from stdin
    if (flags.stdinFileName) {
        const stdinContent = await getStdin();
        return {
            stdinContent,
            stdinFileName: flags.stdinFileName,
            outputFilePath: flags.output,
            ignoreFilePath: flags.secretlintignore,
            cwd: flags.cwd,
        };
    } else {
        return {
            filePathOrGlobList: input,
            outputFilePath: flags.output,
            ignoreFilePath: flags.secretlintignore,
            cwd: flags.cwd,
        };
    }
};
export const run = async (
    input = cli.input,
    flags = cli.flags
): Promise<{ exitStatus: number; stdout: string | null; stderr: Error | null }> => {
    if (flags.help) {
        return {
            exitStatus: 0,
            stdout: helpMessage,
            stderr: null,
        };
    }
    if (flags.version) {
        const packageJson = getPackageJson(import.meta.url);
        return {
            exitStatus: 0,
            stdout: packageJson?.version ?? "",
            stderr: null,
        };
    }
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
    const cliOptions = await readCliOptions({
        input,
        flags,
    });
    debug("cliOptions %O", cliOptions);

    return runSecretLint({
        cliOptions,
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
