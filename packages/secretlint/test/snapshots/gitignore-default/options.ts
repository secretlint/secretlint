import { cli } from "../../../src/cli.js";

export const inputs: string[] = ["fixtures/**/*"];
export const options: Partial<typeof cli.flags> = {};
