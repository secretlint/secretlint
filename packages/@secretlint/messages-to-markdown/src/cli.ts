import { parseArgs } from "node:util";
import { createRequire } from "module";
import { messagesToMarkdown } from "./index.js";
import path from "node:path";

const helpMessage = `
Usage
  $ secretlint-rule-messages-to-markdown [index.js|index.ts]

Options

Examples
  $ secretlint-rule-messages-to-markdown src/index.ts
`;
const OPTION_TYPE_STRING = "string" as const;
const OPTION_TYPE_BOOLEAN = "boolean" as const;
const options = {
    headerLevel: {
        type: OPTION_TYPE_STRING,
        default: "3",
    },
    help: { type: OPTION_TYPE_BOOLEAN, default: false },
    version: { type: OPTION_TYPE_BOOLEAN, default: false },
};
const { values, positionals } = parseArgs({ options, allowPositionals: true });
export const cli = {
    input: positionals,
    flags: values,
};

export const run = (input = cli.input, flags = cli.flags) => {
    try {
        if (flags.help) {
            console.log(helpMessage);
            process.exit(0);
        }
        if (flags.version) {
            const require = createRequire(import.meta.url);
            const { version } = require("../package.json");
            console.log(version);
            process.exit(0);
        }
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
