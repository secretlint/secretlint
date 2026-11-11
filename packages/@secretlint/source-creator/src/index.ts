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
type FileStamp = { size: number; mtimeMs: number; ctimeMs: number };
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
 * - `contentBytes` of the source is the shared buffer. It is available until the reader reads the next file,
 *   and it is `undefined` after that. `lintSource()` scans it at the start of the call.
 * - `content` of the source is always available. It decodes the bytes when it is accessed.
 *   If the reader has already read the next file, it reads the file again.
 */
export const createFileSourceReader = (): FileSourceReader => {
    let sharedBuffer = Buffer.allocUnsafe(INITIAL_BUFFER_SIZE);
    // the number of files that the reader has read. It tells whether the shared buffer still has a file.
    let generation = 0;
    // size and times of the file that `readFile()` has read last
    let lastStat: FileStamp = { size: 0, mtimeMs: 0, ctimeMs: 0 };
    const readFile = (filePath: string): Buffer => {
        const fd = fs.openSync(filePath, "r");
        try {
            const stat = fs.fstatSync(fd);
            lastStat = { size: stat.size, mtimeMs: stat.mtimeMs, ctimeMs: stat.ctimeMs };
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
        const stamp = lastStat;
        const scannedLength = bytes.length;
        const contentType = detectContentType(filePath, bytes);
        let decodedContent: string | undefined;
        // Read the file again, because the shared buffer has another file.
        // The content must be the content that was linted. If the file has been changed, it is an error:
        // a formatter such as "mask-result" would output the new content that no rule has checked.
        const readAgain = (): Buffer => {
            const fd = fs.openSync(filePath, "r");
            try {
                const stat = fs.fstatSync(fd);
                if (stat.size !== stamp.size || stat.mtimeMs !== stamp.mtimeMs || stat.ctimeMs !== stamp.ctimeMs) {
                    throw new Error(`The file was changed while linting: ${filePath}`);
                }
                const buffer = fs.readFileSync(fd);
                if (buffer.length !== scannedLength) {
                    throw new Error(`The file was changed while linting: ${filePath}`);
                }
                return buffer;
            } finally {
                fs.closeSync(fd);
            }
        };
        const source: SecretLintRawSource = {
            filePath,
            get content(): string {
                if (decodedContent === undefined) {
                    decodedContent = (
                        bytes !== undefined && generation === sourceGeneration ? bytes : readAgain()
                    ).toString();
                    bytes = undefined;
                }
                return decodedContent;
            },
            ext: path.extname(filePath),
            contentType,
        };
        return defineContentBytes(source, () => (generation === sourceGeneration ? bytes : undefined));
    };
};
