import { cli } from "../../../src/cli.js";

export const inputs: string[] = ["input-(safe).[data].md"];
export const options: Partial<typeof cli.flags> = {
    glob: false,
};
