import { fileURLToPath } from "node:url";
import path from "node:path";
import { cli, run } from "secretlint/cli";

export const quickStart = async () => {
    // Override secretlintrc with quick-start pkg if it is not defined.
    const defaultSecretlintRc = path.resolve(fileURLToPath(import.meta.url), "../config/.secretlintrc.json");
    const flags: typeof cli.flags = {
        ...cli.flags,
        secretlintrc: cli.flags.secretlintrc ?? defaultSecretlintRc,
    };
    return run(cli.input, flags);
};
