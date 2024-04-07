// preload for embedded binary
// TODO: use local file path instead of npm registry
// https://github.com/denoland/deno/issues/18474
import "npm:@secretlint/secretlint-rule-preset-recommend";
import "npm:@secretlint/secretlint-formatter-sarif";
import { cli, run } from "npm:secretlint/cli";
run(cli.input, cli.flags).then(
    ({ exitStatus, stderr, stdout }) => {
        if (stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.error(stderr);
        }
        Deno.exit(exitStatus);
    },
    (error) => {
        console.error(error);
        Deno.exit(1);
    }
);
