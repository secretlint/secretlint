import { cli } from "../../../src/cli";

export const options: Partial<typeof cli.flags> = {
    format: "json",
};
