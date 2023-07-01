import { cli, run } from "secretlint/cli";

export const quickStart = async () => {
    // Override secretlintrc with quick-start pkg if it is not defined.
    const defaultSecretlintRc = new URL("../config/.secretlintrc.json", import.meta.url).pathname;
    const flags: typeof cli.flags = {
        ...cli.flags,
        secretlintrc: cli.flags.secretlintrc ?? defaultSecretlintRc,
    };
    return run(cli.input, flags);
};
