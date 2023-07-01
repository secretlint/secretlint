import { cli } from "../../../src/cli.js";

export const inputs: string[] = ["input-non-ascii-file-*.md"];
export const options: Partial<typeof cli.flags> = {};
