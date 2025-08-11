import "./secretlint-resolver-hooks.js"; // hooks for secretlint
import { cli, run } from "secretlint/cli";
import * as fs from "node:fs";
import * as path from "node:path";

// Bun macro to read version at compile time
const VERSION =
    typeof Bun !== "undefined"
        ? Bun.macro(() => {
              const fs = require("fs");
              const path = require("path");
              const lernaPath = path.join(__dirname, "..", "..", "..", "..", "lerna.json");
              try {
                  const lernaContent = fs.readFileSync(lernaPath, "utf-8");
                  const lerna = JSON.parse(lernaContent);
                  return lerna.version;
              } catch (error) {
                  console.error("Failed to read version from lerna.json:", error);
                  return "unknown";
              }
          })
        : "unknown";

// --init override
if (cli.flags.init) {
    // write .secretlintrc.json
    fs.writeFileSync(
        path.join(process.cwd(), ".secretlintrc.json"),
        JSON.stringify(
            {
                rules: [
                    {
                        id: "@secretlint/secretlint-rule-preset-recommend"
                    },
                    {
                        id: "@secretlint/secretlint-rule-pattern"
                    }
                ]
            },
            null,
            4
        )
    );
    console.log("Create .secretlintrc.json");
    process.exit(0);
}
// Handle --version flag specifically for binary
if (cli.flags.version) {
    // Version is embedded at compile time via Bun macro
    console.log(VERSION);
    process.exit(0);
}
// secretlint CLI wrapper
run(cli.input, cli.flags).then(
    ({ exitStatus, stderr, stdout }) => {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.error(stderr);
        }
        process.exit(exitStatus);
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
