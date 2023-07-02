import { cli } from "../../../src/cli.js";
import os from "os";
import path from "path";
const tmpdir = os.tmpdir();

export const options: Partial<typeof cli.flags> = {
    output: path.join(tmpdir, "secretlint-out.txt"),
};
