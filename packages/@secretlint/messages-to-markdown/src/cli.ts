import meow from "meow";
import { messagesToMarkdown } from "./index.js";
import path from "node:path";

export const cli = meow(
    `
    Usage
      $ secretlint-rule-messages-to-markdown [index.js|index.ts]
 
    Options
 
    Examples
      $ secretlint-rule-messages-to-markdown src/index.ts
`,
    {
        flags: {
            headerLevel: {
                type: "number",
                default: 3,
            },
        },
        autoHelp: true,
        autoVersion: true,
    }
);

export const run = (input = cli.input, flags = cli.flags) => {
    try {
        const index = require(path.join(process.cwd(), input[0]));
        if (!("messages" in index)) {
            throw new Error("This rule does not export const messages = { ... }");
        }
        return messagesToMarkdown(index.messages, {
            headerLevel: Number(flags.headerLevel),
        });
    } catch (error) {
        console.error(new Error("Can not load rule file"));
        console.error(error);
        throw error;
    }
};
