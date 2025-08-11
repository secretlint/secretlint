import "./secretlint-resolver-hooks.js"; // hooks for secretlint
import { cli, run } from "secretlint/cli";
import { getVersion } from "secretlint/version";
import * as fs from "node:fs";
import * as path from "node:path";
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
    const version = getVersion();
    console.log(version || "unknown");
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
