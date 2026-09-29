import fs from "node:fs/promises";
import path from "node:path";
import { SecretLintRawSource } from "@secretlint/types";

import { isBinary, isText } from "istextorbinary";

const UTF16LE_BOM = [0xff, 0xfe];
const UTF16BE_BOM = [0xfe, 0xff];
const UTF32LE_BOM = [0xff, 0xfe, 0x00, 0x00];

const startsWith = (content: Buffer, bom: number[]): boolean =>
    content.length >= bom.length && bom.every((byte, index) => content[index] === byte);

/**
 * Returns the UTF-16 encoding the byte order mark declares, or null.
 *
 * A UTF-32LE file starts with the UTF-16LE mark, so it has to be excluded, and an odd
 * number of bytes cannot be UTF-16 at all.
 */
const utf16Encoding = (content: Buffer): "utf16le" | "utf16be" | null => {
    if (startsWith(content, UTF32LE_BOM) || content.length % 2 !== 0) {
        return null;
    }
    if (startsWith(content, UTF16LE_BOM)) {
        return "utf16le";
    }
    if (startsWith(content, UTF16BE_BOM)) {
        return "utf16be";
    }
    return null;
};

/**
 * `Buffer#toString()` decodes as UTF-8, so a UTF-16 file comes out as mojibake with a NUL
 * between every character and no rule matches anything in it. A byte order mark says which
 * encoding it is, so decode those rather than reading them as UTF-8.
 *
 * The mark itself is kept, because SecretLintSourceCodeImpl reads it to set `hasBOM`.
 */
const decodeContent = (content: Buffer): string => {
    switch (utf16Encoding(content)) {
        case "utf16le":
            return content.toString("utf16le");
        case "utf16be":
            return Buffer.from(content).swap16().toString("utf16le");
        default:
            return content.toString();
    }
};

const detectContentType = (filePath: string, content: Buffer): SecretLintRawSource["contentType"] => {
    // A UTF-16 BOM is a positive statement that the file is text, and the heuristic below
    // reads the NUL bytes of UTF-16 as binary.
    if (utf16Encoding(content) !== null) {
        return "text";
    }
    if (isBinary(filePath, content)) {
        return "binary";
    } else if (isText(filePath, content)) {
        return "text";
    } else {
        return "unknown";
    }
};
export const createRawSource = async (filePath: string): Promise<SecretLintRawSource> => {
    const content = await fs.readFile(filePath);
    const contentType = detectContentType(filePath, content);
    return {
        filePath,
        content: decodeContent(content),
        ext: path.extname(filePath),
        contentType,
    };
};
