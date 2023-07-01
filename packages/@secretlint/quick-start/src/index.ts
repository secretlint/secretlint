import path from "path";
import { cli, run } from "secretlint/cli";

// Override secretlintrc with quick-start pkg if it is not defined.
const defaultSecretlintRc = path.join(__dirname, "../config/.secretlintrc.json");
const flags: typeof cli.flags = {
    ...cli.flags,
    secretlintrc: cli.flags.secretlintrc ?? defaultSecretlintRc,
};
// Entry Point
run(cli.input, flags).then(
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
