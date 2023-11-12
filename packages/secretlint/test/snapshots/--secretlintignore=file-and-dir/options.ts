import { fileURLToPath } from "node:url";
import { cli } from "../../../src/cli.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const inputs: string[] = ["fixtures/**/*"];
export const options: Partial<typeof cli.flags> = {
    secretlintignore: "ignore-file",
    cwd: __dirname,
};
