import fs from "fs";
import meow from "meow";
import { runSecretLint } from "./index";
export const run = () => {
    const cli = meow(
        `
    Usage
      $ secretlint [file|glob*]
 
    Options
      --format formatter name
      --output-file  output file path that is written of reported result
      --color enable color of output
      --secretlintrc Path to .secretlintrc config file
 
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
                color: {
                    type: "boolean",
                    default: true
                }
            },
            autoHelp: true,
            autoVersion: true
        }
    );
    return runSecretLint({
        cliOptions: {
            filePathOrGlobList: cli.input
        },
        engineOptions: {
            cwd: process.cwd(),
            configFilePath: cli.flags.secretlintrc,
            formatter: cli.flags.format,
            color: cli.flags.color
        }
    }).then(output => {
        const outputFilePath = cli.flags["output-file"];
        if (outputFilePath !== undefined) {
            fs.writeFileSync(outputFilePath, output, "utf-8");
        }
        return output;
    });
};
