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
/**
 * Define `contentBytes` of the source as a non-enumerable property.
 * So `JSON.stringify(source)` and `{ ...source }` do not include the bytes, as before `contentBytes` is added.
 */
const defineContentBytes = (
    source: SecretLintRawSource,
    getContentBytes: () => Uint8Array | undefined,
): SecretLintRawSource => {
    return Object.defineProperty(source, "contentBytes", {
        get: getContentBytes,
        enumerable: false,
        configurable: true,
    });
};
export const createRawSource = async (filePath: string): Promise<SecretLintRawSource> => {
    // Use readFileSync instead of fs/promises's readFile.
    // fs/promises's readFile needs several round trips to the thread pool (open, fstat, read, close) per file,
    // and it is much slower than readFileSync when reading many small files.
    // https://github.com/nodejs/node/issues/37583
    const buffer = fs.readFileSync(filePath);
    const contentType = detectContentType(filePath, buffer);
    // Decoding the content as UTF-8 costs more than scanning the bytes for the keywords of the rules,
    // and most files have no keyword. So pass the bytes, and decode them lazily when `content` is accessed.
    let decodedContent: string | undefined;
    return defineContentBytes(
        {
            filePath,
            get content(): string {
                if (decodedContent === undefined) {
                    decodedContent = buffer.toString();
                }
                return decodedContent;
            },
            ext: path.extname(filePath),
            contentType,
        },
        () => buffer,
    );
};

/**
 * Read a file and return the source for linting. See {@link createFileSourceReader}.
 */
export type FileSourceReader = (filePath: string) => SecretLintRawSource;
const INITIAL_BUFFER_SIZE = 64 * 1024;
/**
 * A file larger than this size is read into its own buffer, and the shared buffer does not grow for it.
 */
const MAX_SHARED_BUFFER_SIZE = 16 * 1024 * 1024;
/**
 * Create a reader that reads files for linting many files.
 *
 * `createRawSource()` allocates a buffer for each file and the source keeps it.
 * The reader reads each file into one shared buffer instead, so linting many files does not allocate for each file
 * and does not keep the content of all files in memory.
 *
 * The source is for linting a file at a time:
 *
 * - `contentBytes` of the source is the shared buffer. It is available until the reader reads the next file,
 *   and it is `undefined` after that. `lintSource()` scans it at the start of the call.
 * - `content` of the source decodes the bytes when it is accessed first, and it is cached.
 *   `lintSource()` reads it while linting only if a rule needs the content or the result has messages.
 *   If it is accessed first after the reader has read the next file, it throws:
 *   the reader does not read the file again, because the file may have been changed after the lint.
 */
export const createFileSourceReader = (): FileSourceReader => {
    let sharedBuffer = Buffer.allocUnsafe(INITIAL_BUFFER_SIZE);
    // the number of files that the reader has read. It tells whether the shared buffer still has a file.
    let generation = 0;
    const readFile = (filePath: string): Buffer => {
        const fd = fs.openSync(filePath, "r");
        try {
            const stat = fs.fstatSync(fd);
            let buffer = sharedBuffer;
            let length = 0;
            while (true) {
                if (length === buffer.length) {
                    const grown = Buffer.allocUnsafe(buffer.length * 2);
                    buffer.copy(grown, 0, 0, length);
                    buffer = grown;
                }
                // Only a read of 0 bytes is the end of the file.
                // A short read is not: files such as /proc/* return less than requested before the end
                const bytesRead = fs.readSync(fd, buffer, length, buffer.length - length, null);
                if (bytesRead === 0) {
                    break;
                }
                length += bytesRead;
                // The file has `stat.size` bytes, so do not call read again only to get 0.
                // Files such as /proc/* have the size 0, and they are read to the end.
                if (length === stat.size) {
                    break;
                }
            }
            if (buffer.length <= MAX_SHARED_BUFFER_SIZE) {
                sharedBuffer = buffer;
            }
            return buffer.subarray(0, length);
        } finally {
            fs.closeSync(fd);
        }
    };
    return (filePath: string): SecretLintRawSource => {
        generation++;
        const sourceGeneration = generation;
        let bytes: Buffer | undefined = readFile(filePath);
        const contentType = detectContentType(filePath, bytes);
        let decodedContent: string | undefined;
        const source: SecretLintRawSource = {
            filePath,
            get content(): string {
                if (decodedContent !== undefined) {
                    return decodedContent;
                }
                if (bytes === undefined || generation !== sourceGeneration) {
                    throw new Error(
                        `The content is not available after the reader has read the next file: ${filePath}`,
                    );
                }
                decodedContent = bytes.toString();
                bytes = undefined;
                return decodedContent;
            },
            ext: path.extname(filePath),
            contentType,
        };
        return defineContentBytes(source, () => (generation === sourceGeneration ? bytes : undefined));
    };
};
