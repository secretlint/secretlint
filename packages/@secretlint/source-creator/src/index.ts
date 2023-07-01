import fs from "node:fs";
import util from "node:util";
import path from "node:path";
import { SecretLintRawSource } from "@secretlint/types";

// @ts-expect-error invalid type?
import { isBinary, isText } from "istextorbinary";

const readFile = util.promisify(fs.readFile);
const detectContentType = (filePath: string, content: Buffer): SecretLintRawSource["contentType"] => {
    if (isBinary(filePath, content)) {
        return "binary";
    } else if (isText(filePath, content)) {
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
