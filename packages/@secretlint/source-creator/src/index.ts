import fs from "node:fs/promises";
import path from "node:path";
import { SecretLintRawSource } from "@secretlint/types";

import { isBinary, isText } from "istextorbinary";

const UTF16LE_BOM = [0xff, 0xfe];
const UTF16BE_BOM = [0xfe, 0xff];

const hasBOM = (content: Buffer, bom: number[]): boolean =>
    content.length >= bom.length && bom.every((byte, index) => content[index] === byte);

/**
 * `Buffer#toString()` decodes as UTF-8, so a UTF-16 file comes out as mojibake with a NUL
 * between every character and no rule matches anything in it. A byte order mark says which
 * encoding it is, so decode those rather than reading them as UTF-8.
 */
const decodeContent = (content: Buffer): string => {
    if (hasBOM(content, UTF16LE_BOM)) {
        return content.subarray(UTF16LE_BOM.length).toString("utf16le");
    }
    if (hasBOM(content, UTF16BE_BOM)) {
        return Buffer.from(content.subarray(UTF16BE_BOM.length)).swap16().toString("utf16le");
    }
    return content.toString();
};

const detectContentType = (filePath: string, content: Buffer): SecretLintRawSource["contentType"] => {
    // A UTF-16 BOM is a positive statement that the file is text, and the heuristic below
    // reads the NUL bytes of UTF-16 as binary.
    if (hasBOM(content, UTF16LE_BOM) || hasBOM(content, UTF16BE_BOM)) {
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
