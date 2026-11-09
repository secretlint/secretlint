import fs from "node:fs";
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
    // Use readFileSync instead of fs/promises's readFile.
    // fs/promises's readFile needs several round trips to the thread pool (open, fstat, read, close) per file,
    // and it is much slower than readFileSync when reading many small files.
    // https://github.com/nodejs/node/issues/37583
    const buffer = fs.readFileSync(filePath);
    const contentType = detectContentType(filePath, buffer);
    if (contentType === "text") {
        return {
            filePath,
            content: buffer.toString(),
            ext: path.extname(filePath),
            contentType,
        };
    }
    // Decoding non-text content as UTF-8 is slow, and most rules do not read the content of binary files.
    // Decode it lazily when a rule accesses `content`.
    let decodedContent: string | undefined;
    return {
        filePath,
        get content(): string {
            if (decodedContent === undefined) {
                decodedContent = buffer.toString();
            }
            return decodedContent;
        },
        ext: path.extname(filePath),
        contentType,
    };
};
