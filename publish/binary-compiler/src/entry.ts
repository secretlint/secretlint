// preload for embedded binary
import "@secretlint/secretlint-rule-preset-recommend";
import "@secretlint/secretlint-rule-pattern";
import "@secretlint/secretlint-formatter-sarif";
import { cli, run } from "secretlint/cli";
// secretlint CLI wrapper
// TODO: --version does not work because package.json is not bundled
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
