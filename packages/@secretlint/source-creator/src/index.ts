import fs from "node:fs/promises";
import path from "node:path";
import { SecretLintRawSource } from "@secretlint/types";

import { isBinary, isText } from "istextorbinary";

const detectContentType = (filePath: string, content: Buffer): SecretLintRawSource["contentType"] => {
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
        content: content.toString(),
        ext: path.extname(filePath),
        contentType,
    };
};
