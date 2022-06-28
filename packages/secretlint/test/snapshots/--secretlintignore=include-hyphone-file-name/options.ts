import { cli } from "../../../src/cli";

export const inputs: string[] = ["**/*.txt"];
export const options: Partial<typeof cli.flags> = {
    secretlintignore: "ignore-file",
};
