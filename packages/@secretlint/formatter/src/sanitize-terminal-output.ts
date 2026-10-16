import { stripVTControlCharacters } from "node:util";

/**
 * Remove terminal control sequences and control characters from untrusted text.
 *
 * File paths and lint messages can contain arbitrary characters (e.g. a file named with ESC sequences).
 * Printing them as-is lets the input rewrite the terminal output: hide lines, change the title, or forge links.
 *
 * - Removes ANSI escape sequences (CSI, OSC, ...) via `node:util` `stripVTControlCharacters`
 * - Removes remaining C0 control characters except `\t` and `\n`, DEL, and C1 control characters
 */
export const sanitizeTerminalOutput = (text: string): string => {
    return stripVTControlCharacters(text).replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, "");
};
