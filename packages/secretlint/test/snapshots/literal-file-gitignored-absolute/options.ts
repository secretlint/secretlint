import path from "node:path";
import { fileURLToPath } from "node:url";
import { cli } from "../../../src/cli.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Same scenario as the sibling `literal-file-gitignored/` fixture but
// the input is an absolute path. groupPatterns takes a slightly
// different branch for absolute literals (no path.join with cwd), so
// pinning both forms guards against the two paths diverging.
export const inputs: string[] = [path.join(__dirname, "secret.log")];
export const options: Partial<typeof cli.flags> = {};
