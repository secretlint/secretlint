import fs from "fs";
import util from "util";
import path from "path";
import { SecretLintRawSource } from "@secretlint/types";

import { isBinarySync, isTextSync } from "istextorbinary";

const readFile = util.promisify(fs.readFile);
const detectContentType = (filePath: string, content: Buffer): SecretLintRawSource["contentType"] => {
    if (isBinarySync(filePath, content)) {
        return "binary";
    } else if (isTextSync(filePath, content)) {
        return "text";
    } else {
        return "unknown";
    }
};
export const createRawSource = (filePath: string): Promise<SecretLintRawSource> => {
    return readFile(filePath).then((content) => {
        const contentType = detectContentType(filePath, content);
        return {
            filePath,
            content: content.toString(),
            ext: path.extname(filePath),
            contentType,
        };
    });
};
